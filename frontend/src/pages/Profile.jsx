import { useEffect, useState } from "react";
import { profileService } from "../services/api";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfileByUsername(username);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Profile" showBackButton>
        <div className="loading">Loading profile...</div>
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
        <div className="profile-header">
          <Avatar src={profile.avatarUrl} alt={profile.username} size="huge" />
        </div>
      </div>
    </Layout>
  )
}

export default Profile;