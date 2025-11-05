import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Conversation = {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export default function Messages() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchConversations();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(user.id);
  };

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const msg of messages || []) {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          // Fetch partner profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", partnerId)
            .single();

          const unreadCount = messages?.filter(
            m => m.sender_id === partnerId && m.receiver_id === user.id && !m.read
          ).length || 0;

          conversationMap.set(partnerId, {
            userId: partnerId,
            userName: profile?.full_name || "Unknown User",
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount
          });
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold gradient-text">Messages</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet. Start connecting with others!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => navigate(`/chat/${conv.userId}`)}
                className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20">
                      {conv.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conv.userName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
