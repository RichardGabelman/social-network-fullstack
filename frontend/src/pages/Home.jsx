import { useState, useEffect } from "react";
import { postService, profileService } from "../services/api.js";
import Layout from "../components/Layout.jsx";
import NewPostModal from "../components/NewPostModal.jsx";
import PostCard from "../components/PostCard.jsx";
import Avatar from "../components/Avatar.jsx";
import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeed, setSelectedFeed] = useState("following");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadFeed();
    loadCurrentUser();
  }, [selectedFeed]);

  const loadCurrentUser = async () => {
    try {
      const user = await profileService.getCurrentProfile();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data =
        selectedFeed === "following"
          ? await postService.getFeed()
          : await postService.getExplorePosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadFeed();
  };

  if (loading) {
    return (
      <Layout
        showFeedSelector
        title={selectedFeed === "following" ? "Following" : "Explore"}
        selectedFeed={selectedFeed}
        onFeedChange={setSelectedFeed}
      >
        <div className="loading">Loading feed...</div>
      </Layout>
    );
  }

  if (error) {
    <Layout
      showFeedSelector
      selectedFeed={selectedFeed}
      onFeedChange={setSelectedFeed}
    >
      <div className="error">Error: {error}</div>
    </Layout>;
  }

  return (
    <Layout
      showFeedSelector
      title={selectedFeed === "following" ? "Following" : "Explore"}
      selectedFeed={selectedFeed}
      onFeedChange={setSelectedFeed}
    >
      <div
        className="new-post-trigger"
        onClick={() => setShowNewPostModal(true)}
      >
        <div className="trigger-content">
          <div className="trigger-left">
            <Avatar src={currentUser.avatarUrl} alt={currentUser.username} size="medium"/>
            <span className="trigger-placeholder">What's new?</span>
          </div>
          <button
            type="button"
            className="trigger-post-button"
            onClick={() => setShowNewPostModal(true)}
          >
            Post
          </button>
        </div>
      </div>
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <p>
              {selectedFeed === "following"
                ? "No posts yet. Follow some users to see their posts!"
                : "No posts available"}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={loadFeed} />
          ))
        )}
      </div>

      <NewPostModal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onPostCreated={handlePostCreated}
        variant="centered"
      />
    </Layout>
  );
}

export default Home;
