import { useState } from "react";
import { Link } from "react-router-dom";
import { followerService } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Avatar from "./Avatar";
import "./UserCard.css";

function UserCard({ user, onFollowUpdate }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const handleFollowToggle = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      if (isFollowing) {
        await followerService.unfollowUser(user.id);
      } else {
        await followerService.followUser(user.id);
      }

      setIsFollowing(!isFollowing);
      onFollowUpdate?.();
    } catch (error) {
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
