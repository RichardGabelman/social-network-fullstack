import { useState } from "react";
import { Link } from "react-router-dom";
import { followerService } from "../services/api";
import Avatar from "./Avatar";
import "./UserCard.css";

function UserCard({ user, onFollowUpdate }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
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
      alert("Failed to update follow status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.username}`} className="user-info">
        <Avatar src={user.avatarUrl} alt={user.username} size="medium" />
        <div className="user-details">
          <p className="username">{user.username}</p>
          <p className="display-name">{user.displayName}</p>
        </div>
      </Link>

      <button
        className={`follow-button ${user.isFollowing ? "following" : ""}`}
        onClick={() => handleFollowToggle(user.id, user.isFollowing)}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default UserCard;
