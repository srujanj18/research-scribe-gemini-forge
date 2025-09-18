import os
import logging
import traceback
import google.generativeai as genai
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import PyPDF2
import subprocess
import tempfile
import shutil
import io
import re
from dotenv import load_dotenv

# Explicitly load .env from the same directory as app.py
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)

# --- Gemini API Key Check ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    app.logger.error("GEMINI_API_KEY environment variable not found!")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Helper: Call Gemini for text generation
def gemini_generate(prompt):
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API key is not configured. Please check your .env file in the python-backend directory.")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return response.text

# Helper: Extract text from PDF
def extract_text_from_pdf(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    try:
        data = request.get_json()
        prompt = f"Generate a complete academic research paper in LaTeX format using the IEEEtran document class (do not use svjour3 or any other document class). Start the document with \\documentclass{{IEEEtran}}. Include all necessary packages (e.g., lipsum for placeholder text, graphicx, tikz, pgfplots) in the preamble. For all citations used in the text (e.g., \\cite{{ref1}}), include corresponding \\bibentry definitions in a \\begin{{thebibliography}} environment at the end of the document. Do not rely on external .bib files or other document classes like svjour3. Ensure the LaTeX code is syntactically correct, compiles without errors, and avoids undefined control sequences or missing references. Example bibliography entry: \\bibentry{{ref1}}{{Author, A., ``Title of Paper,'' \\emph{{Journal}}, 2023.}}\\n\\nTopic: {data.get('topic')}\\nResearch Question: {data.get('researchQuestion')}\\nMethodology: {data.get('methodology')}\\nLength: {data.get('length')} pages\\nDomain: {data.get('domain')}\\nStyle: {data.get('style')}"
        output = gemini_generate(prompt)
        # Post-process to ensure IEEEtran
        app.logger.info(f"Generated LaTeX content (before post-processing):\n{output}")
        output = re.sub(r'\\documentclass\s*(?:\[[^\]]*\])?\s*\{[^}]+}', r'\\documentclass{IEEEtran}', output, 1)
        # Validate document class
        if not re.search(r'\\documentclass\s*(?:\[[^\]]*\])?\s*\{IEEEtran\}', output):
            app.logger.warning("IEEEtran document class not found. Prepending \\documentclass{IEEEtran}.")
            output = re.sub(r'^\s*', r'\\documentclass{IEEEtran}\n', output, 1)
        app.logger.info(f"Generated LaTeX content (after post-processing):\n{output}")
        return jsonify({"success": True, "paper": output})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in generate_paper: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500

@app.route('/api/summarize', methods=['POST'])
def summarize():
    try:
        if 'paperFile' in request.files:
            file = request.files['paperFile']
            paper_text = extract_text_from_pdf(file.stream)
        elif 'arxivId' in request.json:
            paper_text = f"[arXiv paper fetch not implemented: {request.json['arxivId']}]"
        else:
            return jsonify({"success": False, "error": "No paper provided"}), 400
        
        prompt = f"Summarize the following research paper:\\n\\n{paper_text}"
        summary = gemini_generate(prompt)
        return jsonify({"success": True, "summary": summary})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in summarize: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500

@app.route('/api/review', methods=['POST'])
def review():
    try:
        if 'paperFile' in request.files:
            file = request.files['paperFile']
            paper_text = extract_text_from_pdf(file.stream)
        elif 'arxivId' in request.json:
            paper_text = f"[arXiv paper fetch not implemented: {request.json['arxivId']}]"
        else:
            return jsonify({"success": False, "error": "No paper provided"}), 400

        prompt = f"Provide a comprehensive academic peer review for the following paper, including strengths, weaknesses, and recommendations:\\n\\n{paper_text}"
        review_text = gemini_generate(prompt)
        return jsonify({"success": True, "review": review_text})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in review: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        input_text = data.get('inputText')
        analysis_type = data.get('type')
        if not input_text or not analysis_type:
            return jsonify({"success": False, "error": "Missing inputText or type"}), 400

        prompt = ""
        if analysis_type == 'plagiarism':
            prompt = f"Check the following text for plagiarism and list any sources or similar works:\\n\\n{input_text}"
        elif analysis_type == 'novelty':
            prompt = f"Assess the novelty of the following research content and compare with existing literature:\\n\\n{input_text}"
        elif analysis_type == 'citation':
            prompt = f"Analyze the citation network and impact of the following research content:\\n\\n{input_text}"
        else:
            return jsonify({"success": False, "error": "Invalid analysis type"}), 400
        
        analysis = gemini_generate(prompt)
        return jsonify({"success": True, "analysis": analysis})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in analyze: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({"success": False, "error": "Missing message"}), 400
        
        prompt = f"You are an academic research assistant and LaTeX expert. Answer the following user question clearly and concisely.\\n\\nUser: {message}"
        reply = gemini_generate(prompt)
        return jsonify({"success": True, "reply": reply})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in chatbot: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500

@app.route('/api/latex-to-pdf', methods=['POST'])
def latex_to_pdf():
    temp_dir = tempfile.mkdtemp()
    try:
        data = request.get_json()
        if not data or 'latex' not in data:
            return jsonify({"success": False, "error": "Missing 'latex' in request body"}), 400

        latex_content = data['latex']
        app.logger.info(f"LaTeX content received:\n{latex_content}")

        # --- Preprocess LaTeX content ---
        # Replace any document class with IEEEtran to avoid dependency issues
        latex_content = re.sub(
            r'\\documentclass\s*(?:\[[^\]]*\])?\s*\{[^}]+}',
            r'\\documentclass{IEEEtran}',
            latex_content,
            1
        )

        # Add lipsum package if \lipsum is detected and not already included
        if r'\lipsum' in latex_content and r'\usepackage{lipsum}' not in latex_content:
            app.logger.info("Adding lipsum package to LaTeX content")
            latex_content = re.sub(
                r'(\\documentclass(?:\[[^\]]*\])?{[^\}]+})',
                r'\1\n\usepackage{lipsum}',
                latex_content,
                1
            )

        # Check for citations and bibliography
        citation_pattern = r'\\cite\{[^}]+\}'
        citations = re.findall(citation_pattern, latex_content)
        has_bibliography = r'\begin{thebibliography}' in latex_content or r'\bibliography\{' in latex_content
        if citations and not has_bibliography:
            app.logger.warning("Citations found but no bibliography defined. Removing undefined citations.")
            try:
                latex_content = re.sub(r'\\cite\{[^}]+\}', '', latex_content)
            except re.error as re_err:
                app.logger.error(f"Regex error while removing citations: {str(re_err)}")
                return jsonify({"success": False, "error": f"Regex error: {str(re_err)}"}), 500

        # --- Detect image file references in LaTeX ---
        image_pattern = r'\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}'
        image_files = re.findall(image_pattern, latex_content)

        for image_name in image_files:
            image_path = os.path.join(os.path.dirname(__file__), 'assets', image_name)
            if os.path.exists(image_path):
                shutil.copy(image_path, temp_dir)
            else:
                app.logger.warning(f"Image '{image_name}' not found. Replacing with placeholder.")
                placeholder = f"\\fbox{{Missing image: {image_name}}}"
                try:
                    latex_content = re.sub(
                        rf'\\includegraphics(?:\[[^\]]*\])?\{{{re.escape(image_name)}\}}',
                        placeholder,
                        latex_content
                    )
                except re.error as re_err:
                    app.logger.error(f"Regex error while replacing image: {str(re_err)}")
                    return jsonify({"success": False, "error": f"Regex error: {str(re_err)}"}), 500

        # Save the LaTeX file
        temp_tex_path = os.path.join(temp_dir, 'preview.tex')
        with open(temp_tex_path, 'w', encoding='utf-8') as f:
            f.write(latex_content)

        # Compile LaTeX to PDF
        commands = [['pdflatex', '-interaction=nonstopmode', '--enable-installer', 'preview.tex']]
        if citations and has_bibliography:
            commands.extend([
                ['bibtex', 'preview'],
                ['pdflatex', '-interaction=nonstopmode', '--enable-installer', 'preview.tex'],
                ['pdflatex', '-interaction=nonstopmode', '--enable-installer', 'preview.tex']
            ])

        for i, command in enumerate(commands):
            app.logger.info(f"Running compilation pass {i+1}: {' '.join(command)}")
            result = subprocess.run(
                command,
                cwd=temp_dir,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace'
            )
            if result.returncode != 0:
                log_path = os.path.join(temp_dir, 'preview.log')
                log_content = ""
                if os.path.exists(log_path):
                    with open(log_path, 'r', encoding='utf-8', errors='replace') as log_file:
                        log_content = log_file.read()
                app.logger.error(f"Compilation failed with exit code {result.returncode}")
                app.logger.error(f"Compilation log:\n{log_content}")
                # Continue if PDF exists, as BibTeX failures may not prevent PDF generation
                if not os.path.exists(os.path.join(temp_dir, 'preview.pdf')):
                    return jsonify({
                        "success": False,
                        "error": f"LaTeX compilation failed: {' '.join(command)}",
                        "log": log_content
                    }), 500

        pdf_path = os.path.join(temp_dir, 'preview.pdf')
        if not os.path.exists(pdf_path):
            log_path = os.path.join(temp_dir, 'preview.log')
            log_content = ""
            if os.path.exists(log_path):
                with open(log_path, 'r', encoding='utf-8', errors='replace') as log_file:
                    log_content = log_file.read()
            return jsonify({
                "success": False,
                "error": "PDF file was not found after compilation.",
                "log": log_content
            }), 500
        
        # Send the PDF file
        try:
            response = send_file(
                pdf_path,
                mimetype='application/pdf',
                as_attachment=False
            )
            return response
        except Exception as e:
            app.logger.error(f"Error sending PDF: {str(e)}")
            return jsonify({"success": False, "error": "PDF generated but failed to send."}), 500
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error(f"Error in latex_to_pdf: {e}\n{tb}")
        return jsonify({"success": False, "error": str(e), "traceback": tb}), 500
    finally:
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            app.logger.warning(f"Failed to clean up temp directory {temp_dir}: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)