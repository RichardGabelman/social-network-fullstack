import { useEffect, useState } from "react";
import { followerService, postService, profileService } from "../services/api";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";
import "./Profile.css";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: "", bio: "" });

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (profile) {
      loadUserPosts();
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfileByUsername(username);
      setProfile(data);
      setEditForm({
        displayName: data.displayName,
        bio: data.bio || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const postsData = await postService.getUserPosts(profile.id);
      setPosts(postsData);
    } catch (err) {
      console.error("Error loading posts:", err);
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await profileService.updateProfile(editForm);
      setShowEditModal(false);
      loadProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
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
                Edit profile
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

        <section className="profile-posts">
          {posts.length === 0 ? (
            <div className="empty-posts">
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })
          )}
        </section>

        {showEditModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <dialog
              open
              className="edit-profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={editForm.displayName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, displayName: e.target.value })
                    }
                    maxLength={50}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    name="bio"
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    maxLength={150}
                    rows={3}
                  />
                  <span className="char-count" aria-live="polite">{editForm.bio.length}/150</span>
                </div>

                <footer className="modal-actions">
                  <button type="submit" className="modal-done">Done</button>
                </footer>
              </form>
            </dialog>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Profile;
