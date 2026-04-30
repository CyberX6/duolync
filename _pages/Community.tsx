import { useState } from "react";
import Link from "next/link";
import { Plus, MessageSquare, Users, Send, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { validatePostContent, validateCommentContent } from "@/lib/validation";

interface Post {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
  };
  comment_count: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  member_count: number;
}

const Community = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [postType, setPostType] = useState("general");
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const createPost = () => {
    if (!profile) return;
    const validation = validatePostContent(newPostContent);
    if (validation.success === false) {
      toast({ title: "Validation Error", description: validation.error, variant: "destructive" });
      return;
    }
    setIsPosting(true);
    const newPost: Post = {
      id: Date.now().toString(),
      content: validation.data,
      post_type: postType,
      created_at: new Date().toISOString(),
      author: { id: profile.id, full_name: profile.full_name, avatar_url: profile.avatar_url, user_type: profile.user_type },
      comment_count: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    toast({ title: "Post created!" });
    setIsPosting(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const addComment = (postId: string) => {
    if (!profile) return;
    const commentContent = newComments[postId];
    const validation = validateCommentContent(commentContent || "");
    if (validation.success === false) {
      toast({ title: "Validation Error", description: validation.error, variant: "destructive" });
      return;
    }
    const newComment: Comment = {
      id: Date.now().toString(),
      content: validation.data,
      created_at: new Date().toISOString(),
      author: { id: profile.id, full_name: profile.full_name, avatar_url: profile.avatar_url },
    };
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p));
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  const deletePost = (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast({ title: "Post deleted" });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const postTypeLabels: Record<string, { label: string; color: string }> = {
    general: { label: "General", color: "bg-secondary" },
    collaboration_call: { label: "Collaboration", color: "bg-primary/10 text-primary" },
    opportunity: { label: "Opportunity", color: "bg-accent/10 text-accent" },
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with brands and creators, share opportunities
          </p>
        </div>

        <Tabs defaultValue="feed">
          <TabsList className="mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <div className="card-elevated p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <Textarea
                  placeholder="Share an update, opportunity, or collaboration call..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.entries(postTypeLabels).map(([type, { label, color }]) => (
                    <button
                      key={type}
                      onClick={() => setPostType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        postType === type ? color : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={createPost}
                  disabled={isPosting || !newPostContent.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post
                </Button>
              </div>
            </div>

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-elevated p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary rounded w-1/4" />
                        <div className="h-20 bg-secondary rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="card-elevated p-6">
                    <div className="flex items-start gap-4">
                      <Link href={`/profile/${post.author.id}`}>
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          {post.author.avatar_url ? (
                            <img
                              src={post.author.avatar_url}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">👤</span>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/profile/${post.author.id}`}
                            className="font-semibold hover:underline"
                          >
                            {post.author.full_name || "User"}
                          </Link>
                          <span className="text-sm text-muted-foreground capitalize">
                            • {post.author.user_type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {formatTime(post.created_at)}
                          </span>
                          {post.post_type !== "general" && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                postTypeLabels[post.post_type]?.color || ""
                              }`}
                            >
                              {postTypeLabels[post.post_type]?.label}
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap">{post.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {post.comment_count} {post.comment_count === 1 ? "Comment" : "Comments"}
                          </button>
                        </div>

                        {/* Comments Section */}
                        {expandedComments.has(post.id) && (
                          <div className="mt-4 pt-4 border-t border-border space-y-4">
                            {comments[post.id]?.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                  {comment.author.avatar_url ? (
                                    <img
                                      src={comment.author.avatar_url}
                                      alt=""
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm">👤</span>
                                  )}
                                </div>
                                <div className="flex-1 bg-secondary/50 rounded-xl p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                      {comment.author.full_name || "User"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(comment.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment */}
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                {profile?.avatar_url ? (
                                  <img
                                    src={profile.avatar_url}
                                    alt=""
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm">👤</span>
                                )}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={newComments[post.id] || ""}
                                  onChange={(e) =>
                                    setNewComments((prev) => ({
                                      ...prev,
                                      [post.id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") addComment(post.id);
                                  }}
                                  className="flex-1 bg-secondary/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => addComment(post.id)}
                                  disabled={!newComments[post.id]?.trim()}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      {post.author.id === profile?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => deletePost(post.id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-elevated p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to share something!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="groups">
            <div className="grid sm:grid-cols-2 gap-4">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <div key={group.id} className="card-interactive p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                        {group.cover_image_url ? (
                          <img
                            src={group.cover_image_url}
                            alt={group.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold truncate">{group.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {group.description || "No description"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {group.member_count} members
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 card-elevated p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">No groups yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Groups are coming soon! Stay tuned.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Community;
