import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, ClipboardList, Search, GitBranch, Zap, Brain, Microscope } from "lucide-react";
import { PaperGenerator } from "@/components/PaperGenerator";
import { PaperSummarizer } from "@/components/PaperSummarizer";
import { PeerReviewer } from "@/components/PeerReviewer";
import { BonusFeatures } from "@/components/BonusFeatures";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Research Paper Generation",
      description: "Generate complete academic papers with LaTeX formatting using Gemini Pro 1.5",
      tab: "generate"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Paper Summarization",
      description: "Summarize arXiv papers with key findings and methodology",
      tab: "summarize"
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Peer Review",
      description: "Comprehensive academic peer review with detailed analysis",
      tab: "review"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Advanced Analysis",
      description: "Plagiarism detection, novelty assessment, and citation analysis",
      tab: "bonus"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-paper sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-academic rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Research Scribe</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Academic Research System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gradient-academic text-white">
                Gemini Pro 1.5
              </Badge>
              <Badge variant="outline">
                LangChain
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-academic bg-clip-text text-transparent">
              AI Research Paper Generator & Reviewer
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Generate, summarize, and review academic papers with advanced AI. Powered by Gemini Pro 1.5, 
              LangChain workflows, and arXiv integration for comprehensive research assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="academic" 
                size="lg"
                onClick={() => setActiveTab("generate")}
                className="min-w-40"
              >
                <Microscope className="h-5 w-5" />
                Start Research
              </Button>
              <Button variant="outline" size="lg" className="min-w-40">
                <GitBranch className="h-5 w-5" />
                Connect Supabase
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elevated transition-all duration-300 cursor-pointer border-border/50"
                onClick={() => setActiveTab(feature.tab)}
              >
                <CardHeader className="pb-4">
                  <div className="p-3 bg-gradient-academic rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <Card className="shadow-elevated border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Research Tools</CardTitle>
              <CardDescription>
                Choose your research task and let AI assist your academic work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="generate" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate
                  </TabsTrigger>
                  <TabsTrigger value="summarize" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Summarize
                  </TabsTrigger>
                  <TabsTrigger value="review" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Review
                  </TabsTrigger>
                  <TabsTrigger value="bonus" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="space-y-6">
                  <PaperGenerator />
                </TabsContent>

                <TabsContent value="summarize" className="space-y-6">
                  <PaperSummarizer />
                </TabsContent>

                <TabsContent value="review" className="space-y-6">
                  <PeerReviewer />
                </TabsContent>

                <TabsContent value="bonus" className="space-y-6">
                  <BonusFeatures />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Backend Notice */}
      <section className="py-12 px-6 bg-gradient-scholarly">
        <div className="container mx-auto">
          <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Backend Integration Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-4">
                This system requires backend functionality for Gemini Pro 1.5, LangChain workflows, 
                and arXiv API integration. Connect to Supabase to enable the full research capabilities.
              </p>
              <Button variant="secondary" size="lg">
                Connect to Supabase
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
