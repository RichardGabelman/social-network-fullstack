import { useEffect, useState, useCallback } from "react";
import { followerService, postService, profileService } from "../services/api";
import { useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useRequireAuth } from "../hooks/useRequireAuth.js";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";
import { SkeletonProfile } from "../components/Skeleton.jsx";
import "./Profile.css";

function Profile() {
  const { username } = useParams();
  const toast = useToast();
  const requireAuth = useRequireAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: "", bio: "" });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfileByUsername(username);
      setProfile(profileData);
      setIsFollowing(profileData.isFollowing);
      setEditForm({
        displayName: profileData.displayName,
        bio: profileData.bio || "",
      });

      postService
        .getUserPosts(profileData.id)
        .then((postsData) => setPosts(postsData))
        .catch((err) => console.error("Error loading posts:", err));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };

  const handleFollowToggle = async () => {
    if (!requireAuth()) return;
    if (!profile) return;

    try {
      if (isFollowing) {
        await followerService.unfollowUser(profile.id);
      } else {
        await followerService.followUser(profile.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditForm({
      displayName: profile.displayName,
      bio: profile.bio || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await profileService.updateProfile(editForm);
      setShowEditModal(false);
      setProfile((prevProfile) => ({
        ...prevProfile,
        displayName: editForm.displayName,
        bio: editForm.bio,
      }));
      toast.success("Profile updated");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Layout title="Profile" showBackButton>
        <SkeletonProfile />
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
                className={`profile-follow-button ${
                  isFollowing ? "profile-following" : ""
                }`}
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
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostDeleted={handlePostDeleted}
                />
              );
            })
          )}
        </section>

        {showEditModal && (
          <div className="modal-overlay" onClick={handleEditCancel}>
            <dialog
              open
              className="edit-profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleEditSubmit}>
                <div className="form-groups">
                  <div className="form-group">
                    <label htmlFor="displayName">Name</label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={editForm.displayName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          displayName: e.target.value,
                        })
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
                    <span className="char-count" aria-live="polite">
                      {editForm.bio.length}/150
                    </span>
                  </div>
                </div>

                <footer className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-done">
                    Done
                  </button>
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
