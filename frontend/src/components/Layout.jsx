import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import NewPostModal from "./NewPostModal.jsx";
import "./Layout.css";

function Layout({
  children,
  showFeedSelector = false,
  selectedFeed,
  onFeedChange,
  title,
  showBackButton,
  onPostCreated,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCenteredModal, setShowCenteredModal] = useState(false);
  const [showFloatingModal, setShowFloatingModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <nav className="nav-menu">
        <Link to="/" className="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <title>at</title>
            <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
          </svg>
        </Link>
        <div className="nav-center-bundle">
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="nav-icon"
            >
              <title>Home</title>
              <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22" />
            </svg>
          </Link>
          <Link
            to="/users"
            className={`nav-item ${
              location.pathname === "/users" ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="nav-icon"
            >
              <title>User Index</title>
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
          </Link>
          <button
            className="nav-new-post-button nav-item"
            onClick={() => setShowCenteredModal(!showCenteredModal)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="nav-icon"
            >
              <title>Create</title>
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
          {currentUser && (
            <Link
              to={`/profile/${currentUser.username}`}
              className={`nav-item ${
                location.pathname === `/profile/${currentUser.username}`
                  ? "active"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="nav-icon"
              >
                <title>Profile</title>
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </Link>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button nav-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <title>Logout</title>
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
          </svg>
        </button>
      </nav>

      <div className="center-area">
        <header className="top-header">
          <div className="header-left">
            {showBackButton && (
              <button className="back-button" onClick={handleBack}>
                ←
              </button>
            )}
          </div>
          <div className="header-center">
            {title && <h1 className="page-title">{title}</h1>}

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
        <main className="content">{children}</main>
      </div>

      <button
        className="new-post-button"
        onClick={() => setShowFloatingModal(!showFloatingModal)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="nav-icon"
        >
          <title>Create</title>
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </button>

      <NewPostModal
        isOpen={showFloatingModal}
        onClose={() => setShowFloatingModal(false)}
        variant="floating"
        onPostCreated={onPostCreated}
      />
      <NewPostModal
        isOpen={showCenteredModal}
        onClose={() => setShowCenteredModal(false)}
        variant="centered"
        onPostCreated={onPostCreated}
      />
    </div>
  );
}

export default Layout;
