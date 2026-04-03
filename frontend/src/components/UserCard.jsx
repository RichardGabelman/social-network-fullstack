import { useState } from "react";
import { Link } from "react-router-dom";
import { followerService } from "../services/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { useRequireAuth } from "../hooks/useRequireAuth.js";
import Avatar from "./Avatar.jsx";
import "./UserCard.css";

function UserCard({ user, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const requireAuth = useRequireAuth();

  const handleFollowToggle = async () => {
    if (!requireAuth()) return;
    if (isUpdating) return;

    const originalIsFollowing = isFollowing
    const newIsFollowing = !isFollowing;

    setIsFollowing(newIsFollowing);
    onFollowChange?.(user.id, newIsFollowing);

    try {
      setIsUpdating(true);
      if (originalIsFollowing) {
        await followerService.unfollowUser(user.id);
      } else {
        await followerService.followUser(user.id);
      }
    } catch (error) {
      setIsFollowing(originalIsFollowing);
      onFollowChange?.(user.id, originalIsFollowing);
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.username}`} className="user-info">
        <Avatar src={user.avatarUrl} alt={user.username} size="large" />
        <div className="user-details">
          <p className="user-username">{user.username}</p>
          <p className="user-display-name">{user.displayName}</p>
        </div>
      </Link>

      <button
        className={`follow-button ${isFollowing ? "following" : ""}`}
        onClick={handleFollowToggle}
        disabled={isUpdating}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default UserCard;
