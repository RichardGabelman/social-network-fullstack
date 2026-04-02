import { useState, useEffect } from "react";
import { postService } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useRequireAuth } from "../hooks/useRequireAuth.js";
import Layout from "../components/Layout.jsx";
import NewPostModal from "../components/NewPostModal.jsx";
import PostCard from "../components/PostCard.jsx";
import Avatar from "../components/Avatar.jsx";
import { SkeletonFeed } from "../components/Skeleton.jsx";
import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { currentUser } = useAuth();
  const requireAuth = useRequireAuth();
  const [selectedFeed, setSelectedFeed] = useState(() => {
    const saved = localStorage.getItem("selectedFeed") || "explore";
    return saved;
  });
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const handleTriggerClick = () => {
    if (!requireAuth()) return;
    setShowNewPostModal(true);
  };

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        const feedToLoad =
          selectedFeed === "following" && !currentUser
            ? "explore"
            : selectedFeed;
        const data =
          feedToLoad === "following"
            ? await postService.getFeed()
            : await postService.getExplorePosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, [currentUser, selectedFeed, retryCount]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };

  const handleFeedChange = (feed) => {
    if (feed === "following" && !requireAuth()) return;
    setSelectedFeed(feed);
    localStorage.setItem("selectedFeed", feed);
  };

  if (loading) {
    return (
      <Layout
        showFeedSelector
        selectedFeed={selectedFeed}
        onFeedChange={handleFeedChange}
      >
        <SkeletonFeed />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        showFeedSelector
        selectedFeed={selectedFeed}
        onFeedChange={handleFeedChange}
      >
        <div className="error">
          <p>Failed to load feed</p>
          <button
            className="retry-button"
            onClick={() => setRetryCount((c) => c + 1)}
          >
            Try again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showFeedSelector
      selectedFeed={selectedFeed}
      onFeedChange={handleFeedChange}
      onPostCreated={handlePostCreated}
    >
      <div className="new-post-trigger" onClick={handleTriggerClick}>
        <div className="trigger-content">
          <div className="trigger-left">
            {currentUser && (
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                size="medium"
              />
            )}
            <span className="trigger-placeholder">What's new?</span>
          </div>
          <button type="button" className="trigger-post-button">
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
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
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
