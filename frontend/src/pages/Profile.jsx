import { useEffect, useState } from "react";
import { followerService, profileService } from "../services/api";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfileByUsername(username);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;

    try {
      if (isFollowing) {
        await followerService.unfollowerUser(profile.id);
      } else {
        await followerService.followUser(profile.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <Layout title="Profile" showBackButton>
        <div className="loading">Loading profile...</div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout title="Profile" showBackButton>
        <div className="error">User not found</div>
      </Layout>
    );
  }

  return (
    <Layout title={profile.displayName} showBackButton>
      <div className="profile-container">
        <header className="profile-header">
          <div className="profile-top">
            <div className="profile-names">
              <h2 className="profile-display-name">{profile.displayName}</h2>
              <p className="profile-username">{profile.username}</p>
            </div>
            <Avatar
              src={profile.avatarUrl}
              alt={profile.username}
              size="huge"
            />
          </div>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-actions">
            {profile.isOwnProfile ? (
              <button
                className="edit-profile-button"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={`follow-button ${isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </header>
      </div>
    </Layout>
  );
}

export default Profile;
