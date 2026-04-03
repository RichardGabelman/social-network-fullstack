import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAutoResize } from "../hooks/useAutoResize.js";
import { useRequireAuth } from "../hooks/useRequireAuth.js";
import Layout from "../components/Layout.jsx";
import PostCard from "../components/PostCard.jsx";
import Avatar from "../components/Avatar.jsx";
import { SkeletonPost } from "../components/Skeleton.jsx";
import { postService } from "../services/api.js";
import "./Post.css";

function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  const replyRef = useAutoResize();
  const requireAuth = useRequireAuth();
  const [post, setPost] = useState(null);
  const [parentPost, setParentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postIdInt = parseInt(postId);

  useEffect(() => {
    if (isNaN(postIdInt)) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await postService.getPost(postIdInt);
        setPost(data);

        if (data.replyTo && !data.replyTo.isReplyToDeleted) {
          const parent = await postService.getPost(data.replyTo.id);
          setParentPost(parent);
        } else {
          setParentPost(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postIdInt]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newReply = await postService.createPost(replyContent, postIdInt);

      setPost((prev) => ({
        ...prev,
        replies: [newReply, ...(prev.replies || [])],
        _count: {
          ...prev._count,
          replies: prev._count.replies + 1,
        },
      }));

      setReplyContent("");
      toast.success("Reply posted");
    } catch (error) {
      console.error("Error creating reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    if (deletedPostId === post.id) {
      navigate(-1);
    } else {
      setPost((prev) => ({
        ...prev,
        replies: prev.replies.filter((r) => r.id !== deletedPostId),
        _count: {
          ...prev._count,
          replies: prev._count.replies - 1,
        },
      }));
    }
  };

  if (loading) {
    return (
      <Layout title="Thread" showBackButton>
        <SkeletonPost />
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
          <PostCard post={post} onPostDeleted={handlePostDeleted} />
        </article>

        <form
          className={`reply-form ${replies.length === 0 ? "reply-form-last" : ""}`}
          onSubmit={handleReplySubmit}
        >
          <div className="reply-form-content">
            {currentUser && (
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                size={"small"}
              />
            )}
            <textarea
              ref={replyRef}
              name="content"
              id="reply-content"
              placeholder={`Replying to ${post.author.username}`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={500}
              rows={1}
              required
            />
          </div>
          <div className="reply-form-footer">
            <span className="char-count">{replyContent.length}/500</span>
            <button
              type="submit"
              className="reply-button"
              disabled={!replyContent.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Reply"}
            </button>
          </div>
        </form>

        <section className="replies-section">
          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </section>
      </article>
    </Layout>
  );
}

export default Post;
