import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postService } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import "./PostCard.css";

function PostCard({ post, onPostDeleted }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;

    try {
      setIsLiking(true);
      if (isLiked) {
        await postService.unlikePost(post.id);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await postService.likePost(post.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
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
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return posted.toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
    });
  };

  const isOwnPost = currentUser && currentUser.id === post.author.id;

  function NotLikedHeart() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="not-liked post-svg"
        viewBox="0 0 24 24"
      >
        <title>Like</title>
        <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
      </svg>
    );
  }

  function LikedHeart() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="liked post-svg"
        viewBox="0 0 24 24"
      >
        <title>Unlike</title>
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
      </svg>
    );
  }

  function CommentSpeechBubble() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="reply post-svg"
      >
        <title>Reply</title>
        <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3M12,17C7.58,17 4,14.31 4,11C4,7.69 7.58,5 12,5C16.42,5 20,7.69 20,11C20,14.31 16.42,17 12,17Z" />
      </svg>
    );
  }

  return (
    <article className="post-card" onClick={handleCardClick}>
      {post.replyTo && (
        <div className="reply-context">
          {post.replyTo.isReplyToDeleted ? (
            <span className="reply-text">Reply to deleted post</span>
          ) : (
            <span className="reply-text">
              Reply to @{post.replyTo.author.username}
            </span>
          )}
        </div>
      )}

      <div className="post-layout">
        <Link
          to={`/profile/${post.author.username}`}
          onClick={handleAuthorClick}
          className="author-link"
        >
          <Avatar
            src={post.author.avatarUrl}
            alt={post.author.username}
            size="medium"
          />
        </Link>

        <div className="post-main">
          <header className="post-header">
            <div className="author-info">
              <Link
                to={`/profile/${post.author.username}`}
                onClick={handleAuthorClick}
                className="author-link"
              >
                <p className="username">{post.author.username}</p>
              </Link>
            </div>
            <div className="meta-info">
              <span className="timestamp">{getTimeAgo(post.createdAt)}</span>
            </div>
            {isOwnPost && (
              <div className="post-menu" ref={menuRef}>
                <button
                  className="post-menu-button"
                  onClick={handleMenuToggle}
                  aria-label="Post options"
                >
                  ⋯
                </button>

                {showMenu && (
                  <div className="post-menu-dropdown">
                    <button
                      className="post-menu-item delete"
                      onClick={handleDelete}
                    >
                      <span>Delete</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>Delete</title>
                        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </header>

          <p className="post-content">{post.content}</p>

          <div className="post-actions">
            <button
              className={`action-button like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              {isLiked ? <LikedHeart /> : <NotLikedHeart />}
              <span className="action-count">{likeCount}</span>
            </button>

            <button
              className="action-button comment-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${post.id}`);
              }}
            >
              <CommentSpeechBubble />
              <span className="action-count">{post._count.replies}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
