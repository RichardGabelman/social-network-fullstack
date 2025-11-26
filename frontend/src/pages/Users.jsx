import { useState, useEffect } from "react";
import { userService, followerService } from "../services/api";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await followerService.unfollowerUser(userId);
      } else {
        await followerService.followerUser(userId);
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? {...user, isFollowing: !isFollowing }
            : user
        )
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status")
    }
  };

  if (loading) {
    return (
      <Layout title="Users" showBackButton>
        <div className="loading">Loading users...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Users" showBackButton>
        <div className="error">Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Users" showBackButton></Layout>
  );
}

export default Users;