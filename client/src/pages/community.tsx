
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Trash2, Send, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

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
      userId: user.id,
      content,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Community Doubts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="What's your doubt?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
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
      userId: user.id,
      content: comment,
    });
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{post.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.user?.name}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), "PPP p")}</p>
          </div>
        </div>
        {isAdmin && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post image" className="rounded-md max-h-[400px] w-full object-cover border" />
        )}
        {post.videoUrl && post.videoUrl.includes("youtube.com") ? (
          <iframe
            className="w-full aspect-video rounded-md border"
            src={`https://www.youtube.com/embed/${post.videoUrl.split("v=")[1]?.split("&")[0]}`}
            allowFullScreen
          />
        ) : post.videoUrl && (
          <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">
            <Video className="w-4 h-4 inline mr-2" />
            {post.videoUrl}
          </a>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch border-t p-4 space-y-4">
        <div className="space-y-3">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="flex gap-3 text-sm">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px]">{c.user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/50 p-2 rounded-md">
                <p className="font-semibold text-xs">{c.user?.name}</p>
                <p>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <Input
            placeholder="Write a clarification..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={createCommentMutation.isPending}>
            <MessageSquare className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
