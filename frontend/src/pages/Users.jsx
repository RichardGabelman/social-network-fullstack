import { useState, useEffect } from "react";
import { userService, profileService } from "../services/api";
import Layout from "../components/Layout.jsx";
import UserCard from "../components/UserCard.jsx";
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
      setError(err.message);
    } finally {
      setLoading(false);
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
    <Layout title="Users" showBackButton>
      <div className="users-container">
        {users.length === 0 ? (
          <div className="empty-users">
            <p>No users found.</p>
          </div>
        ) : (
          users.map((user) => (
            <UserCard key={user.id} user={user} onFollowUpdate={loadUsers} />
          ))
        )}
      </div>
    </Layout>
  );
}

export default Users;
