import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { postService } from "../services/api.js";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getPost(parseInt(postId));
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return (
      <Layout title="Thread" showBackButton>
        <div className="loading">Loading post...</div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title="Thread" showBackButton>
        <div className="error">Post not found</div>
      </Layout>
    );
  }

  const replies = post.replies || [];

  return (
    <Layout title="Thread" showBackButton>

    </Layout>
  )
}

export default Post;