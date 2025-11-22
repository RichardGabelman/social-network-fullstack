import { useState, useEffect } from "react";
import { postService } from "../services/api.js";
import Layout from "../components/Layout.jsx";
// import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeed, setSelectedFeed] = useState("following");

  useEffect(() => {
    loadFeed();
  }, [selectedFeed]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = selectedFeed === "following" ? await postService.getFeed() : await postService.getExplorePosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout showFeedSelector selectedFeed={selectedFeed} onFeedChange={setSelectedFeed}>
        <div className="loading">Loading feed...</div>
      </Layout>
    );
  }

  if (error) {
    <Layout showFeedSelector selectedFeed={selectedFeed} onFeedChange={setSelectedFeed}>
        <div className="error">Error: {error}</div>
    </Layout>
  }

  return (
    <Layout showFeedSelector selectedFeed={selectedFeed} onFeedChange={setSelectedFeed}>
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <p>
              {selectedFeed === "following" ? "No posts yet. Follow some users to see their posts!" : "No posts available"}
            </p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              post
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Home;