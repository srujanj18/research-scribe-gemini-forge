import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PaperSummarizer = () => {
  const [arxivId, setArxivId] = useState("");
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async (type: 'arxiv' | 'upload') => {
    if (type === 'arxiv' && !arxivId.trim()) {
      toast({
        title: "arXiv ID Required",
        description: "Please enter a valid arXiv paper ID.",
        variant: "destructive"
      });
      return;
    }

    if (type === 'upload' && !paperFile) {
      toast({
        title: "File Required",
        description: "Please upload a PDF file to summarize.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setSummary(`This paper presents a novel approach to deep learning architectures for medical image segmentation. The authors propose a hybrid model combining convolutional neural networks with transformer attention mechanisms to achieve state-of-the-art performance on medical imaging datasets.

**Problem & Motivation:** The research addresses the challenge of accurate medical image segmentation, which is crucial for diagnosis and treatment planning. Traditional CNN-based approaches often struggle with long-range dependencies and fine-grained details in medical images.

**Methodology:** The paper introduces a U-Net architecture enhanced with transformer blocks that capture global context through self-attention mechanisms. The model uses a hierarchical approach, processing images at multiple scales to preserve both local and global features.

**Key Findings:** Experimental results on three medical imaging datasets show 15% improvement in Dice coefficient compared to baseline U-Net models. The proposed method demonstrates superior performance in segmenting small anatomical structures and handling challenging cases with low contrast.

**Contributions:** The main contributions include: (1) A novel hybrid CNN-Transformer architecture for medical segmentation, (2) Multi-scale feature fusion strategy, and (3) Comprehensive evaluation demonstrating clinical applicability.`);
      
      toast({
        title: "Summary Generated",
        description: "Paper successfully summarized using Gemini Pro 1.5.",
      });
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPaperFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Paper Summarizer
        </h3>
        <p className="text-muted-foreground">
          Generate concise summaries of research papers from arXiv or uploaded PDFs
        </p>
      </div>

      <Card className="shadow-paper">
        <CardHeader>
          <CardTitle>Input Source</CardTitle>
          <CardDescription>
            Choose how you want to provide the research paper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="arxiv" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="arxiv">arXiv Paper</TabsTrigger>
              <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="arxiv" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arxiv-id">arXiv Paper ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="arxiv-id"
                    placeholder="e.g., 2205.12345 or arXiv:2205.12345"
                    value={arxivId}
                    onChange={(e) => setArxivId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSummarize('arxiv')}
                    disabled={isProcessing}
                    variant="scholarly"
                  >
                    <Search className="h-4 w-4" />
                    Fetch & Summarize
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the arXiv ID (e.g., 2205.12345) to automatically fetch and summarize the paper
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paper-file">Upload PDF</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="paper-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSummarize('upload')}
                    disabled={isProcessing || !paperFile}
                    variant="scholarly"
                  >
                    <FileText className="h-4 w-4" />
                    Summarize PDF
                  </Button>
                </div>
                {paperFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {paperFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isProcessing && (
        <Card className="shadow-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Processing Paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Fetching paper content...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                Analyzing with Gemini Pro 1.5...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                Generating structured summary...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card className="shadow-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Paper Summary
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Gemini Pro 1.5</Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <CardDescription>
              AI-generated summary highlighting key findings and contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <Textarea
                value={summary}
                readOnly
                className="min-h-[300px] resize-none border-0 p-0 focus:ring-0"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-primary">Summary Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Included in Summary:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Problem statement and motivation</li>
                <li>• Methodology and approach</li>
                <li>• Key findings and results</li>
                <li>• Main contributions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Technical Details:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 200-300 word structured format</li>
                <li>• Academic writing style</li>
                <li>• Powered by Gemini Pro 1.5</li>
                <li>• Supports PDF and arXiv integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};