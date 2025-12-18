import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Layout from "../components/Layout.jsx";
import PostCard from "../components/PostCard.jsx";
import Avatar from "../components/Avatar.jsx";
import { postService } from "../services/api.js";
import "./Post.css";

function Post() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [parentPost, setParentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getPost(parseInt(postId));
      setPost(data);

      if (data.replyTo && !data.replyTo.isReplyToDeleted) {
        const parent = await postService.getPost(data.replyTo.id);
        setParentPost(parent);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newReply = await postService.createPost(replyContent, parseInt(postId));

      setPost(prev => ({
        ...prev,
        replies: [newReply, ...(prev.replies || [])],
        _count: {
          ...prev._count,
          replies: prev._count.replies + 1,
        },
      }));

      setReplyContent("");
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Thread" showBackButton>
        <div className="loading">Loading post...</div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title="Thread" showBackButton>
        <div className="error">Post not found</div>
      </Layout>
    );
  }

  const replies = post.replies || [];

  return (
    <Layout title="Thread" showBackButton>
      <article className="post-page">
        {parentPost && (
          <div className="parent-post">
            <PostCard post={parentPost} />
          </div>
        )}

        <article className="main-post">
          <PostCard post={post} />
        </article>

        <section className="replies-section">
          {replies.map((reply) => (
            <PostCard key={reply.id} post={reply} />
          ))}
        </section>

        <form className="reply-form" onSubmit={handleReplySubmit}>
           <div className="reply-form-content">
            {currentUser && (
              <Avatar src={currentUser.avatarUrl} alt={currentUser.username} size={"small"} />
            )}
            <textarea name="content" id="reply-content" placeholder={`Replying to ${post.author.username}`} value={replyContent} onChange={(e) => setReplyContent(e.target.value)} maxLength={500} rows={1} required/>
           </div>
           <div className="reply-form-footer">
            <span className="char-count">{replyContent.length}/500</span>
            <button type="submit" className="reply-button" disabled={!replyContent.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Reply"}
            </button>
           </div>
        </form>
      </article>
    </Layout>
  );
}

export default Post;
