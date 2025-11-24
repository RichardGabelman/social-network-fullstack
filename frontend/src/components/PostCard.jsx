import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postService } from "../services/api.js";
import "./PostCard.css";

function PostCard({ post, onPostDeleted }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;

    try {
      setIsLiking(true);
      if (isLiked) {
        await postService.unlikePost(post.id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await postService.likePost(post.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      onPostUpdate?.();
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!confirm("Delete this post?")) return;

    try {
      await postService.deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return posted.toLocaleDateString("en-us", {month: "short", day: "numeric"});
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      {post.replyTo && (
        <div className="reply-context">
          {post.replyTo.isReplyToDeleted ? (
            <span className="reply-text">Replying to deleted post</span>
          ) : (
            <span className="reply-text">
              Replying to @{post.replyTo.author.username}
            </span>
          )}
        </div>
      )}

      <div className="post-header">
        <Link to={`/profile/${post.author.username}`} onClick={handleAuthorClick} className="author-link">
        </Link>
      </div>
    </div>
  )

}