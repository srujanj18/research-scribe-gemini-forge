# Research Scribe - AI Research Paper Generator & Reviewer

An AI-powered platform for generating, summarizing, and reviewing academic research papers using Google's Gemini Pro 1.5, integrated with arXiv for research paper access.

## 🚀 Features

- **AI-Powered Paper Generation**: Generate complete research papers in LaTeX format using IEEEtran document class
- **Paper Summarization**: Extract key insights from uploaded PDF research papers
- **Peer Review System**: Get comprehensive academic reviews with strengths, weaknesses, and recommendations
- **Advanced Analysis**: Check for plagiarism, assess novelty, and analyze citation networks
- **LaTeX to PDF Conversion**: Compile LaTeX documents to PDF with proper bibliography handling
- **Academic Chatbot**: Get assistance from an AI research assistant and LaTeX expert
- **Modern UI**: Built with React, TypeScript, and shadcn/ui components
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for modern UI components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **TanStack Query** for API state management
- **LaTeX.js** for LaTeX rendering in the browser
- **Recharts** for data visualization

### Backend
- **Flask** with CORS support
- **Google Generative AI (Gemini Pro 1.5)**
- **PyPDF2** for PDF text extraction
- **LaTeX compilation** with pdflatex and bibtex
- **dotenv** for environment variable management

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- pdflatex (for LaTeX compilation)
- Google Gemini API key

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd python-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Running the Backend

1. From the python-backend directory:
   ```bash
   python app.py
   ```

2. The backend will run on [http://localhost:5000](http://localhost:5000)

## 📖 Usage

### Generating Research Papers
1. Navigate to the Paper Generator section
2. Fill in the topic, research question, methodology, length, domain, and style
3. Click "Generate Paper" to create a LaTeX-formatted research paper

### Summarizing Papers
1. Go to the Paper Summarizer section
2. Upload a PDF research paper or provide an arXiv ID
3. Get an AI-generated summary of the paper

### Peer Review
1. Access the Peer Reviewer section
2. Upload a paper for review
3. Receive detailed feedback on strengths, weaknesses, and recommendations

### Advanced Analysis
- **Plagiarism Check**: Analyze text for potential plagiarism
- **Novelty Assessment**: Evaluate the originality of research content
- **Citation Analysis**: Examine citation networks and impact

### LaTeX to PDF
- Convert generated LaTeX code to PDF format
- Automatic bibliography compilation with bibtex

## 🔌 API Endpoints

### Paper Generation
```
POST /api/generate-paper
```
Generates a complete research paper in LaTeX format.

**Request Body:**
```json
{
  "topic": "Machine Learning in Healthcare",
  "researchQuestion": "How can ML improve diagnostic accuracy?",
  "methodology": "Systematic review and meta-analysis",
  "length": "10",
  "domain": "Computer Science",
  "style": "Academic"
}
```

### Paper Summarization
```
POST /api/summarize
```
Summarizes an uploaded research paper.

**Request:**
- Form data with `paperFile` (PDF) or JSON with `arxivId`

### Peer Review
```
POST /api/review
```
Provides comprehensive peer review feedback.

**Request:**
- Form data with `paperFile` (PDF) or JSON with `arxivId`

### Analysis
```
POST /api/analyze
```
Performs various types of analysis on research content.

**Request Body:**
```json
{
  "inputText": "Your research text here",
  "type": "plagiarism|novelty|citation"
}
```

### Chatbot
```
POST /api/chatbot
```
Interacts with the academic research assistant.

**Request Body:**
```json
{
  "message": "Your question here"
}
```

### LaTeX to PDF
```
POST /api/latex-to-pdf
```
Compiles LaTeX code to PDF.

**Request Body:**
```json
{
  "latex": "Your LaTeX code here"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini Pro 1.5 for AI capabilities
- arXiv for research paper database
- shadcn/ui for beautiful UI components
- The academic community for inspiration

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Research Scribe Team** - Making academic research more accessible through AI
