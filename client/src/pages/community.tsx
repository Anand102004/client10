
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Trash2, Send, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function Community() {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { data: posts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPost: any) => {
      const res = await apiRequest("POST", "/api/posts", newPost);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setImageUrl("");
      setVideoUrl("");
      toast({ title: "Post created successfully" });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl("/api/posts/:id", { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Post deleted successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPostMutation.mutate({
      userId: user?.id,
      content,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Community Doubts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="What's your doubt?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Image URL (optional)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <Video className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Video URL (optional)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" disabled={createPostMutation.isPending} className="w-full">
              {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Post Doubt
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} isAdmin={role === "admin"} onDelete={() => deletePostMutation.mutate(post.id)} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, isAdmin, onDelete }: { post: any; isAdmin: boolean; onDelete: () => void }) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const createCommentMutation = useMutation({
    mutationFn: async (newComment: any) => {
      const res = await apiRequest("POST", "/api/comments", newComment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setComment("");
      toast({ title: "Clarification added" });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutation.mutate({
      postId: post.id,
      userId: user?.id,
      content: comment,
    });
  };

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">{post.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{post.user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{format(new Date(post.createdAt), "PPP p")}</p>
          </div>
        </div>
        {isAdmin && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-4">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="rounded-lg overflow-hidden border bg-muted/30">
            <img src={post.imageUrl} alt="Post image" className="max-h-[400px] w-full object-contain" />
          </div>
        )}
        {post.videoUrl && (post.videoUrl.includes("youtube.com") || post.videoUrl.includes("youtu.be")) ? (
          <div className="rounded-lg overflow-hidden border aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${post.videoUrl.split("v=")[1]?.split("&")[0] || post.videoUrl.split("/").pop()}`}
              allowFullScreen
            />
          </div>
        ) : post.videoUrl && (
          <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30 text-sm text-primary hover:bg-muted transition-colors">
            <Video className="w-4 h-4" />
            <span className="truncate">{post.videoUrl}</span>
          </a>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch p-0 bg-muted/10">
        <div className="p-4 space-y-3">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="flex gap-2 text-xs">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[8px] bg-secondary/20">{c.user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-white p-2 rounded-lg border shadow-sm">
                <p className="font-bold text-[10px] mb-0.5">{c.user?.name}</p>
                <p className="text-muted-foreground">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 pt-0">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Input
              placeholder="Write a clarification..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Button type="submit" size="icon" className="h-9 w-9" disabled={createCommentMutation.isPending}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
