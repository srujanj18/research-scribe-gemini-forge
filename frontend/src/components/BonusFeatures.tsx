import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Search, Shield, Lightbulb, GitBranch, AlertCircle, CheckCircle, TrendingUp, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BonusFeatures = () => {
  const [activeTab, setActiveTab] = useState("plagiarism");
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalysis = async (type: string) => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide text or paper content for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call based on analysis type
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, type })
      });
      const data = await res.json();
      if (data.success) {
        setResults({ type, ...data.analysis });
        toast({
          title: "Analysis Complete",
          description: `${type} analysis completed successfully.`,
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConcernColor = (concern: string) => {
    switch (concern) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-amber-600 bg-amber-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          Advanced Analysis Tools
        </h3>
        <p className="text-muted-foreground">
          Plagiarism detection, novelty assessment, and citation graph analysis
        </p>
      </div>

      <Card className="shadow-paper">
        <CardHeader>
          <CardTitle>Input Content</CardTitle>
          <CardDescription>
            Provide research paper content or abstract for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analysis-content">Paper Content or Abstract</Label>
              <Textarea
                id="analysis-content"
                placeholder="Paste your research paper content, abstract, or methodology section here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Provide at least 100 words for meaningful analysis results
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-paper">
        <CardHeader>
          <CardTitle>Analysis Tools</CardTitle>
          <CardDescription>
            Choose the type of analysis to perform on your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plagiarism" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Plagiarism Check
              </TabsTrigger>
              <TabsTrigger value="novelty" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Novelty Detection
              </TabsTrigger>
              <TabsTrigger value="citation" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Citation Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plagiarism" className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={() => handleAnalysis("plagiarism")}
                  disabled={isAnalyzing || !inputText.trim()}
                  variant="academic"
                  size="lg"
                  className="min-w-48"
                >
                  <Shield className="h-5 w-5" />
                  {isAnalyzing ? "Checking..." : "Check Plagiarism"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Compare against arXiv papers and academic databases
                </p>
              </div>
            </TabsContent>

            <TabsContent value="novelty" className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={() => handleAnalysis("novelty")}
                  disabled={isAnalyzing || !inputText.trim()}
                  variant="research"
                  size="lg"
                  className="min-w-48"
                >
                  <Lightbulb className="h-5 w-5" />
                  {isAnalyzing ? "Analyzing..." : "Assess Novelty"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Evaluate uniqueness against existing research
                </p>
              </div>
            </TabsContent>

            <TabsContent value="citation" className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={() => handleAnalysis("citation")}
                  disabled={isAnalyzing || !inputText.trim()}
                  variant="scholarly"
                  size="lg"
                  className="min-w-48"
                >
                  <GitBranch className="h-5 w-5" />
                  {isAnalyzing ? "Building Graph..." : "Analyze Citations"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Build and analyze citation networks
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="shadow-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Running Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Processing text content...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                Querying arXiv database...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                Computing similarity metrics...
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                Generating analysis report...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.type === "plagiarism" && (
        <div className="space-y-6">
          <Card className="shadow-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Plagiarism Report
                </CardTitle>
                <Badge variant={results.overallScore < 20 ? "secondary" : results.overallScore < 50 ? "destructive" : "destructive"}>
                  {results.overallScore}% Similarity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={results.overallScore} className="h-3" />
                  </div>
                  <span className="text-sm font-medium">
                    {results.overallScore < 20 ? "Low Risk" : results.overallScore < 50 ? "Medium Risk" : "High Risk"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {results.matches.map((match: any, index: number) => (
                    <Card key={index} className={`border-l-4 ${match.concern === 'high' ? 'border-l-red-500' : match.concern === 'medium' ? 'border-l-amber-500' : 'border-l-green-500'}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{match.source}</p>
                          <Badge className={getConcernColor(match.concern)}>
                            {match.similarity}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "{match.text}..."
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {results && results.type === "novelty" && (
        <div className="space-y-6">
          <Card className="shadow-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Novelty Assessment
                </CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {results.noveltyScore}% Novel
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Novelty Breakdown</h4>
                  {Object.entries(results.analysis).map(([category, analysis]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize text-sm font-medium">{category}</span>
                        <Badge variant="outline">{category === "methodology" ? "High" : category === "application" ? "Medium" : "Standard"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{String(analysis)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Research Gaps Identified</h4>
                  <ul className="space-y-2">
                    {results.gaps.map((gap: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-paper">
            <CardHeader>
              <CardTitle>Similar Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.similarWorks.map((work: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    {work}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {results && results.type === "citation" && (
        <div className="space-y-6">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Citation Network Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{results.networkStats.totalPapers}</div>
                  <p className="text-sm text-muted-foreground">Papers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{results.networkStats.totalCitations}</div>
                  <p className="text-sm text-muted-foreground">Citations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{results.networkStats.averageCitations}</div>
                  <p className="text-sm text-muted-foreground">Avg Citations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{results.networkStats.hIndex}</div>
                  <p className="text-sm text-muted-foreground">H-Index</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Most Influential Papers</h4>
                  {results.influentialPapers.map((paper: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm pr-2">{paper.title}</p>
                          <Badge variant="outline">{paper.year}</Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{paper.citations} citations</span>
                          <span>Centrality: {paper.centrality}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Research Clusters</h4>
                  {results.clusters.map((cluster: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{cluster.name}</span>
                        <Badge variant="secondary">{cluster.papers} papers</Badge>
                      </div>
                      <Progress value={cluster.strength * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Research Trends
                </h4>
                <ul className="space-y-2">
                  {results.trends.map((trend: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};