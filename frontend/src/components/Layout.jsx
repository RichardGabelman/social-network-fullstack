import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService, profileService } from "../services/api.js";
import NewPostModal from "./NewPostModal.jsx";
import "./Layout.css";

function Layout({
  children,
  showFeedSelector = false,
  selectedFeed,
  onFeedChange,
  title,
  showBackButton,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showCenteredModal, setShowCenteredModal] = useState(false);
  const [showFloatingModal, setShowFloatingModal] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await profileService.getCurrentProfile();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <nav className="nav-menu">
        <Link to="/" className="logo">
          <div>
            <h2>TC</h2>
          </div>
        </Link>
        <div className="nav-center-bundle">
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <span className="nav-icon">🏠</span>
          </Link>
          <Link
            to="/users"
            className={`nav-item ${
              location.pathname === "/users" ? "active" : ""
            }`}
          >
            <span className="nav-icon">🔎</span>
          </Link>
          <button
            className="nav-new-post-button nav-item"
            onClick={() => setShowCenteredModal(!showCenteredModal)}
          >
            +
          </button>
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            💖
          </Link>
          {currentUser && (
            <Link
              to={`/profile/${currentUser.username}`}
              className={`nav-item ${
                location.pathname === `/profile/${currentUser.username}`
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-icon">👤</span>
            </Link>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </nav>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            {showBackButton && (
              <button className="back-button" onClick={handleBack}>
                ←
              </button>
            )}
          </div>
          <div className="header-center">
            {title && (
              <h1 className="page-title">{title}</h1>
            )}

            {showFeedSelector && (
              <div className="feed-selector">
                <button
                  className={`feed-option ${
                    selectedFeed === "following" ? "active" : ""
                  }`}
                  onClick={() => onFeedChange("following")}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
          <div className="header-right"></div>
        </header>

        <div className="content">{children}</div>
      </main>

      <button
        className="new-post-button"
        onClick={() => setShowFloatingModal(!showFloatingModal)}
      >
        +
      </button>

      <NewPostModal
        isOpen={showFloatingModal}
        onClose={() => setShowFloatingModal(false)}
        variant="floating"
      />
      <NewPostModal
        isOpen={showCenteredModal}
        onClose={() => setShowCenteredModal(false)}
        variant="centered"
      />
    </div>
  );
}

export default Layout;
