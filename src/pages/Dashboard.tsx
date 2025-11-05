import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Sparkles, Plus, Search, User, LogOut, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Post = {
  id: string;
  title: string;
  description: string;
  type: "offer" | "request";
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    checkUser();
    fetchPosts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch profiles for each post
      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", post.user_id)
            .single();
          
          return {
            ...post,
            profiles: profile,
          };
        })
      );

      setPosts(postsWithProfiles as Post[]);
    } catch (error: any) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && post.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SkillSwap</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/create-post">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="request">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found.</p>
                <Link to="/create-post">
                  <Button className="mt-4">Create First Post</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-[var(--gradient-card)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant={post.type === "offer" ? "default" : "secondary"}
                      >
                        {post.type === "offer" ? "Offering" : "Requesting"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Posted by {post.profiles?.full_name || "Anonymous"}
                      </div>
                      <Link to={`/chat/${post.user_id}`}>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
