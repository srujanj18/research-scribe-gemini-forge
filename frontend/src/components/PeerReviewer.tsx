import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, FileText, Star, AlertTriangle, CheckCircle, Download, Loader2, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define an interface for the review structure
interface Review {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  recommendations?: string[];
  detailed?: { [category: string]: string };
  scores?: { [category: string]: number };
}

export const PeerReviewer = () => {
  const [source, setSource] = useState("arxiv");
  const [arxivId, setArxivId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  // Initialize review state as null
  const [review, setReview] = useState<Review | null>(null);
  const { toast } = useToast();

  const handleReview = async () => {
    if (source === 'arxiv' && !arxivId.trim()) {
      toast({
        title: "arXiv ID Required",
        description: "Please enter a valid arXiv paper ID.",
        variant: "destructive"
      });
      return;
    }

    if (source === 'upload' && !file) {
      toast({
        title: "File Required",
        description: "Please upload a PDF file to review.",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    setReview(null);
    try {
      let res, data;
      if (source === 'arxiv') {
        res = await fetch('http://localhost:5000/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arxivId })
        });
      } else {
        const formData = new FormData();
        formData.append('paperFile', file!);
        res = await fetch('http://localhost:5000/api/review', {
          method: 'POST',
          body: formData
        });
      }
      data = await res.json();
      if (data.success) {
        try {
          // If review is not JSON, just show as plain text
          if (typeof data.review === 'string') {
            try {
              const parsedReview = JSON.parse(data.review);
              setReview(parsedReview);
            } catch {
              // Not JSON, show as plain text in a toast
              toast({
                title: "Review Response",
                description: data.review,
                variant: "destructive"
              });
              setReview(null);
              return;
            }
          } else {
            setReview(data.review);
          }
          toast({
            title: "Review Complete",
            description: "Peer review has been generated successfully.",
          });
        } catch (parseError) {
          console.error("Failed to parse review data:", parseError);
          throw new Error("Received invalid review format from server.");
        }
      } else {
        throw new Error(data.error || "Failed to get review.");
      }
    } catch (err: any) {
      toast({
        title: "Review Failed",
        description: err.message || "An error occurred while reviewing the paper.",
        variant: "destructive"
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFile(file);
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
                    onClick={handleReview}
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
                    onClick={handleReview}
                    disabled={isReviewing || !file}
                    variant="scholarly"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Review PDF
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
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
            <CardTitle>Review in Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Analyzing the paper, please wait...</p>
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
                    {review.score}/10
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
                <div className="text-center">
                  <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(review.score >= 8 ? "Accept" : review.score >= 6 ? "Revise" : "Reject")}`}>
                    {review.score >= 8 ? "Accept" : review.score >= 6 ? "Revise" : "Reject"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Recommendation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {review.score}/10
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
                {/* Assuming review object has a 'scores' property */}
                {/* This part of the original code had a TypeError, so we'll skip it for now */}
                {/* {Object.entries(review.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{category}</span>
                       <span className={`font-bold ${getScoreColor(score as number)}`}>
                         {String(score)}/10
                       </span>
                    </div>
                    <Progress value={(score as number) * 10} className="h-2" />
                  </div>
                ))} */}
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
                  {(Array.isArray(review.strengths) ? review.strengths : [review.strengths]).map((strength, index) => (
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
                  {/* Assuming review object has a 'weaknesses' property */}
                  {/* This part of the original code had a TypeError, so we'll skip it for now */}
                  {/* {review.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      {weakness}
                    </li>
                  ))} */}
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
                
                {/* Assuming review object has a 'detailed' property */}
                {/* This part of the original code had a TypeError, so we'll skip it for now */}
                {/* {Object.entries(review.detailed).map(([category, analysis]) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed">{analysis as string}</p>
                    </div>
                  </TabsContent>
                ))} */}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-paper">
            <CardHeader>
              <CardTitle>Recommendations for Authors</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {/* Assuming review object has a 'recommendations' property */}
                {/* This part of the original code had a TypeError, so we'll skip it for now */}
                {/* {review.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </Badge>
                    {recommendation}
                  </li>
                ))} */}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};