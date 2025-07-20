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

export const PaperGenerator = () => {
  const [formData, setFormData] = useState({
    topic: "",
    researchQuestion: "",
    methodology: "",
    length: "5",
    domain: "",
    style: "ieee"
  });
  const [isGenerating, setIsGenerating] = useState(false);
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

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Paper Generated Successfully",
        description: "Your research paper has been generated in LaTeX format.",
      });
    }, 3000);
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
                    <SelectItem value="acm">ACM</SelectItem>
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
            
            <Button variant="outline" size="lg" disabled={isGenerating}>
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
                Connecting to Gemini Pro 1.5...
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
        </CardContent>
      </Card>
    </div>
  );
};