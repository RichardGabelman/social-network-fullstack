import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/api";
import Layout from "../components/Layout.jsx";
import UserCard from "../components/UserCard.jsx";
import { SkeletonList } from "../components/Skeleton.jsx";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  if (loading) {
    return (
      <Layout title="Users" showBackButton>
        <SkeletonList />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Users" showBackButton>
        <div className="error">
          <p>Failed to load users</p>
          <button className="retry-button" onClick={loadUsers}>Try again</button>
        </div>
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
