import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Sparkles, Download, Eye, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function wrapLatexIfNeeded(latex: string) {
  if (/\\documentclass/.test(latex)) {
    return latex;
  }
  return `
\\documentclass{article}
\\begin{document}
${latex}
\\end{document}
  `.trim();
}

function cleanLatex(latex: string) {
  // Remove Markdown code block markers from start/end
  return latex
    .replace(/^```latex\s*/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();
}

function cleanProblematicPackages(latex: string) {
  // Remove specific problematic packages that the AI might generate
  return latex.replace(/\\usepackage\{acm-ec-ecai\}/g, '');
}

function cleanBibliography(latex: string) {
  // Remove bibliography lines if no .bib file is uploaded
  // Also remove acm-ec-format which is an old, problematic package
  return latex.replace(/\\bibliographystyle\{[^}]+\}/g, '')
              .replace(/\\bibliography\{[^}]+\}/g, '')
              .replace(/\\usepackage\{acm-ec-format\}/g, '');
}

function fillTemplate(template, data) {
  return template
    .replace('<<TITLE>>', data.title || "")
    .replace('<<AUTHOR>>', data.author || "")
    .replace('<<INSTITUTION>>', data.institution || "")
    .replace('<<CITY>>', data.city || "")
    .replace('<<COUNTRY>>', data.country || "")
    .replace('<<EMAIL>>', data.email || "")
    .replace('<<CONTENT>>', data.content || "")
    .replace('<<IMAGES>>', data.imagesLatex || "");
}

function stripLatexPreamble(latex) {
  return latex
    // Remove all \documentclass lines
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]+\}/g, '')
    // Remove all \usepackage lines
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]+\}/g, '')
    // Remove all \maketitle
    .replace(/\\maketitle/g, '')
    // Remove all \begin{document} and \end{document}
    .replace(/\\begin\{document\}/g, '')
    .replace(/\\end\{document\}/g, '')
    // Remove extra whitespace and blank lines
    .replace(/^\s*\n/gm, '')
    .trim();
}

const templates = {
  ieee: `
\\documentclass[10pt,conference]{IEEEtran}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\begin{document}
\\title{<<TITLE>>}
\\author{<<AUTHOR>>}
\\maketitle
<<CONTENT>>
<<IMAGES>>
\\end{document}
`.trim(),
  arxiv: `
\\documentclass{article}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\begin{document}
\\title{<<TITLE>>}
\\author{<<AUTHOR>>}
\\maketitle
<<CONTENT>>
<<IMAGES>>
\\end{document}
`.trim(),
  springer: `
\\documentclass{svjour3}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\begin{document}
\\title{<<TITLE>>}
\\author{<<AUTHOR>>}
\\maketitle
<<CONTENT>>
<<IMAGES>>
\\end{document}
`.trim()
};


export const PaperGenerator = () => {
  const [formData, setFormData] = useState({
    topic: "",
    researchQuestion: "",
    methodology: "",
    length: "5",
    domain: "",
    style: "ieee",
    institution: "",
    city: "",
    country: "",
    email: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a research topic to generate a paper.",
        variant: "destructive"
      });
      return;
    }
    const latexToSend = fillTemplate(templates[formData.style], {
      title: formData.topic,
      author: formData.researchQuestion,
      content: cleanLatex(generatedPaper),
      imagesLatex: "", // No images in preview for now
    });

    setIsGenerating(true);
    setGeneratedPaper("");
    try {
      const res = await fetch("http://localhost:5000/api/generate-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPaper(data.paper);
        toast({
          title: "Paper Generated Successfully",
          description: "Your research paper has been generated using Gemini.",
        });
      } else {
        console.error("Error generating paper:", data); // Log the full error
        throw new Error(data.error || "Failed to generate paper");
      }
    } catch (err: any) {
      toast({
        title: "Generation Failed",
        description: err.message || "An error occurred while generating the paper.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!generatedPaper) return;
    setPdfUrl(null);
    setShowPreview(true);
    try {
      const selectedTemplate = formData.style;
      const title = formData.topic;
      const author = formData.researchQuestion;
      const imagesLatex = `
      \\begin{figure}[h]
      \\centering
      \\begin{tikzpicture}
      \\begin{axis}[
      xlabel={False Positive Rate},
      ylabel={True Positive Rate},
      title={ROC Curve},
      legend pos=south east,
      width=0.8\\linewidth,
      height=6cm,
      grid=major,
      ]
      \\addplot[color=blue, thick] coordinates {
      (0,0) (0.1,0.6) (0.3,0.75) (0.5,0.85) (0.7,0.9) (1,1)
      };
      \\addlegendentry{ResNet50}
      \\addplot[color=green, thick] coordinates {
      (0,0) (0.1,0.7) (0.3,0.8) (0.5,0.9) (0.7,0.95) (1,1)
      };
      \\addlegendentry{EfficientNetB0}
      \\addplot[dashed, color=black] coordinates {
      (0,0) (1,1)
      };
      \\addlegendentry{Random}
      \\end{axis}
      \\end{tikzpicture}
      \\caption{ROC Curve generated with TikZ/PGFPlots}
      \\label{fig:tikzroc}
      \\end{figure}
      `;


      // Fill the selected template with the generated paper
      const latexToSend = cleanProblematicPackages(cleanBibliography(
        fillTemplate(templates[selectedTemplate], {
          title,
          author,
          institution: formData.institution,
          city: formData.city,
          country: formData.country,
          email: formData.email,
          content: stripLatexPreamble(cleanLatex(generatedPaper)),
          imagesLatex, // now includes TikZ diagram
        })
      ));
      
      const res = await fetch("http://localhost:5000/api/latex-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: latexToSend }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to generate PDF preview:", errorData);
        // Prioritize showing the detailed LaTeX log if it exists
        const errorMessage = errorData.log || errorData.error || "An unknown error occurred during PDF generation.";
        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setPdfUrl(null);
      toast({
        title: "PDF Preview Failed",
        description: e.message,
        variant: "destructive",
        duration: 15000, // Show for longer to allow reading the error
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Research Paper Generator
        </h3>
        <p className="text-muted-foreground">
          Generate complete academic papers with LaTeX formatting using Gemini Pro 1.5
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paper Configuration
            </CardTitle>
            <CardDescription>
              Configure your research paper parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Research Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Deep Learning for Medical Image Segmentation"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="research-question">Research Question</Label>
              <Textarea
                id="research-question"
                placeholder="What specific research question are you addressing?"
                value={formData.researchQuestion}
                onChange={(e) => setFormData({ ...formData, researchQuestion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Preferred Methodology</Label>
              <Textarea
                id="methodology"
                placeholder="Describe your preferred research methodology or approach"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Paper Length (pages)</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData({ ...formData, length: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 pages</SelectItem>
                    <SelectItem value="5">5 pages</SelectItem>
                    <SelectItem value="8">8 pages</SelectItem>
                    <SelectItem value="10">10 pages</SelectItem>
                    <SelectItem value="15">15 pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">LaTeX Style</Label>
                <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ieee">IEEE</SelectItem>
                    <SelectItem value="arxiv">arXiv</SelectItem>
                    <SelectItem value="springer">Springer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Research Domain</Label>
              <Input
                id="domain"
                placeholder="e.g., Computer Science, Machine Learning, AI"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g., University Name"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="e.g., your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-paper">
          <CardHeader>
            <CardTitle>Paper Structure Preview</CardTitle>
            <CardDescription>
              Your paper will include these sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Abstract",
                "Introduction", 
                "Related Work",
                "Methodology",
                "Results & Discussion",
                "Conclusion",
                "References"
              ].map((section, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{section}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium">Technologies Used:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Gemini Pro 1.5</Badge>
                <Badge variant="secondary">LangChain</Badge>
                <Badge variant="secondary">arXiv API</Badge>
                <Badge variant="secondary">LaTeX</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-paper">
        <CardHeader>
          <CardTitle>Generate Research Paper</CardTitle>
          <CardDescription>
            Click generate to create your complete research paper with LaTeX formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="academic"
              size="lg"
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  Generating Paper...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Paper
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={isGenerating || !generatedPaper}
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            
            <Button variant="outline" size="lg" disabled={isGenerating}>
              <Download className="h-4 w-4" />
              Download LaTeX
            </Button>
          </div>

          {isGenerating && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Connecting to Gemini 2.5 Flash...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                Fetching related work from arXiv...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                Generating paper structure...
              </div>
            </div>
          )}
          {generatedPaper && (
            <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-inner">
              <h3 className="font-semibold mb-2 text-lg">Generated Paper (LaTeX)</h3>
              <pre className="whitespace-pre-wrap text-xs overflow-x-auto">{generatedPaper}</pre>
            </div>
          )}
        </CardContent>
      </Card>
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => { setShowPreview(false); setPdfUrl(null); }}
              aria-label="Close preview"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">PDF Preview</h3>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-[70vh] border rounded"
              />
            ) : (
              <div>Loading PDF preview...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};