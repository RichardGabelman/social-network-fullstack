import { useState, useEffect } from "react";
import { postService } from "../services/api.js";
import Layout from "../components/Layout.jsx";
import "./Home.css";
import NewPostModal from "../components/NewPostModal.jsx";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeed, setSelectedFeed] = useState("following");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [selectedFeed]);

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
          <span className="trigger-placeholder">What's new?</span>
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
            <div key={post.id} className="post-card">
              post (placeholder)
            </div>
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
