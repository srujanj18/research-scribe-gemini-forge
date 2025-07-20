import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, FileText, Star, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PeerReviewer = () => {
  const [arxivId, setArxivId] = useState("");
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [review, setReview] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  const handleReview = async (type: 'arxiv' | 'upload') => {
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
        description: "Please upload a PDF file to review.",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsReviewing(false);
      setReview({
        overall: {
          score: 7.5,
          recommendation: "Accept with Minor Revisions",
          confidence: 8
        },
        scores: {
          clarity: 8,
          novelty: 7,
          methodology: 8,
          results: 7,
          significance: 7
        },
        strengths: [
          "Well-structured paper with clear motivation and problem statement",
          "Comprehensive related work section covering relevant literature",
          "Solid experimental methodology with appropriate baselines",
          "Clear presentation of results with proper statistical analysis",
          "Good discussion of limitations and future work"
        ],
        weaknesses: [
          "Limited evaluation on additional datasets to demonstrate generalizability",
          "Some technical details in the methodology section could be clearer",
          "Missing comparison with some recent state-of-the-art methods",
          "Computational complexity analysis would strengthen the paper"
        ],
        detailed: {
          clarity: "The paper is generally well-written with clear structure and flow. The motivation is well-established and the problem statement is precise. However, some technical details in Section 3.2 could benefit from additional clarification.",
          novelty: "The approach presents incremental improvements over existing methods. While the combination of techniques is novel, individual components are well-established. The contribution is solid but not groundbreaking.",
          methodology: "The experimental design is sound with appropriate baselines and evaluation metrics. The authors properly address potential confounding factors. Statistical significance testing is included, which strengthens the results.",
          results: "Results are clearly presented with proper error bars and statistical analysis. The improvement over baselines is consistent across different settings. However, evaluation on additional datasets would strengthen the claims.",
          significance: "The work addresses an important problem with practical applications. The results demonstrate meaningful improvements that could impact the field, though the advance is incremental rather than revolutionary."
        },
        recommendations: [
          "Add evaluation on at least one additional benchmark dataset",
          "Clarify the technical details in Section 3.2 regarding the attention mechanism",
          "Include comparison with recent methods published in 2023",
          "Add computational complexity analysis and runtime comparisons",
          "Consider discussing potential ethical implications of the proposed method"
        ]
      });
      
      toast({
        title: "Review Completed",
        description: "Comprehensive peer review generated using Gemini Pro 1.5.",
      });
    }, 4000);
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("Accept")) return "bg-green-100 text-green-800";
    if (recommendation.includes("Revise")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Peer Reviewer
        </h3>
        <p className="text-muted-foreground">
          Generate comprehensive peer reviews with detailed analysis and recommendations
        </p>
      </div>

      <Card className="shadow-paper">
        <CardHeader>
          <CardTitle>Paper to Review</CardTitle>
          <CardDescription>
            Provide the research paper for AI-powered peer review
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
                <Label htmlFor="review-arxiv-id">arXiv Paper ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="review-arxiv-id"
                    placeholder="e.g., 2205.12345 or arXiv:2205.12345"
                    value={arxivId}
                    onChange={(e) => setArxivId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleReview('arxiv')}
                    disabled={isReviewing}
                    variant="scholarly"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Review Paper
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="review-paper-file">Upload PDF</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="review-paper-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleReview('upload')}
                    disabled={isReviewing || !paperFile}
                    variant="scholarly"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Review PDF
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

      {isReviewing && (
        <Card className="shadow-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Conducting Peer Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Analyzing paper structure and content...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                Evaluating methodology and experimental design...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                Assessing novelty and significance...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                Generating detailed recommendations...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {review && (
        <div className="space-y-6">
          <Card className="shadow-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Review Summary
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">Gemini Pro 1.5</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Export Review
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {review.overall.score}/10
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
                <div className="text-center">
                  <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(review.overall.recommendation)}`}>
                    {review.overall.recommendation}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Recommendation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {review.overall.confidence}/10
                  </div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-paper">
            <CardHeader>
              <CardTitle>Detailed Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(review.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{category}</span>
                       <span className={`font-bold ${getScoreColor(score as number)}`}>
                         {String(score)}/10
                       </span>
                    </div>
                    <Progress value={(score as number) * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-paper">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {review.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-paper">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {review.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-paper">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="clarity" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="clarity">Clarity</TabsTrigger>
                  <TabsTrigger value="novelty">Novelty</TabsTrigger>
                  <TabsTrigger value="methodology">Methodology</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="significance">Significance</TabsTrigger>
                </TabsList>
                
                {Object.entries(review.detailed).map(([category, analysis]) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed">{analysis as string}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-paper">
            <CardHeader>
              <CardTitle>Recommendations for Authors</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {review.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </Badge>
                    {recommendation}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};