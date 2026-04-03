import { useState, useEffect } from "react";
import { userService } from "../services/api";
import Layout from "../components/Layout.jsx";
import UserCard from "../components/UserCard.jsx";
import { SkeletonList } from "../components/Skeleton.jsx";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleFollowChange = (userId, isFollowing) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFollowing } : u)),
    );
  };

  const filteredUsers = query.trim()
    ? users.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.username.toLowerCase().includes(q) ||
          (u.displayName && u.displayName.toLowerCase().includes(q))
        );
      })
    : users;

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
          <button
            className="retry-button"
            onClick={() => {
              setError(null);
              setLoading(true);
              userService
                .getAllUsers()
                .then((data) => setUsers(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            Try again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Users" showBackButton>
      <div className="users-search">
        <input
          type="text"
          className="users-search-input"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search users"
        />
      </div>
      <div className="users-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-users">
            <p>
              {query.trim() ? "No users match your search." : "No users found."}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onFollowChange={handleFollowChange}
            />
          ))
        )}
      </div>
    </Layout>
  );
}

export default Users;
