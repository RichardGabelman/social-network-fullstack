import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useRequireAuth } from "../hooks/useRequireAuth.js";
import NewPostModal from "./NewPostModal.jsx";
import "./Layout.css";

function Layout({
  children,
  showFeedSelector = false,
  selectedFeed,
  onFeedChange,
  title,
  showBackButton = false,
  onPostCreated,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCenteredModal, setShowCenteredModal] = useState(false);
  const [showFloatingModal, setShowFloatingModal] = useState(false);
  const { currentUser, logout } = useAuth();
  const requireAuth = useRequireAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
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
            <title>DevThreads</title>
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
              <path
                d="M13.4056 3.72522C12.5838 3.06783 11.4162 3.06783 10.5944 3.72522L4.28209 8.7751C3.62975 9.29697 3.25 10.0871 3.25 10.9225V18C3.25 19.5188 4.48122 20.75 6 20.75H18C19.5188 20.75 20.75 19.5188 20.75 18V10.9225C20.75 10.0871 20.3703 9.29697 19.7179 8.7751L13.4056 3.72522ZM9.0327 1.77305C10.7675 0.385221 13.2325 0.38522 14.9673 1.77305L21.2796 6.82293C22.525 7.81923 23.25 9.32762 23.25 10.9225V18C23.25 20.8995 20.8995 23.25 18 23.25H6C3.1005 23.25 0.75 20.8995 0.75 18V10.9225C0.75 9.32763 1.47497 7.81923 2.72035 6.82293L9.0327 1.77305Z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
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
              <path
                clipRule="evenodd"
                d="M11.2607 1.01074C5.59982 1.01074 1.01074 5.59982 1.01074 11.2607C1.01074 16.9217 5.59982 21.5107 11.2607 21.5107C13.6407 21.5107 15.8312 20.6996 17.5709 19.3387L20.8554 22.6231C21.3435 23.1113 22.135 23.1113 22.6231 22.6231C23.1113 22.135 23.1113 21.3435 22.6231 20.8554L19.3387 17.5709C20.6996 15.8312 21.5107 13.6407 21.5107 11.2607C21.5107 5.59982 16.9217 1.01074 11.2607 1.01074ZM3.51074 11.2607C3.51074 6.98053 6.98054 3.51074 11.2607 3.51074C15.5409 3.51074 19.0107 6.98053 19.0107 11.2607C19.0107 15.541 15.5409 19.0107 11.2607 19.0107C6.98054 19.0107 3.51074 15.541 3.51074 11.2607Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </Link>
          <button
            className="nav-new-post-button nav-item"
            onClick={() => { if (requireAuth()) setShowCenteredModal(true); }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="nav-icon"
            >
              <title>Create</title>
              <path
                d="M13.25 3.00001C13.25 2.30965 12.6904 1.75001 12 1.75001C11.3096 1.75001 10.75 2.30965 10.75 3.00001V10.75H3C2.30964 10.75 1.75 11.3097 1.75 12C1.75 12.6904 2.30964 13.25 3 13.25H10.75V21C10.75 21.6904 11.3096 22.25 12 22.25C12.6904 22.25 13.25 21.6904 13.25 21V13.25H21C21.6904 13.25 22.25 12.6904 22.25 12C22.25 11.3097 21.6904 10.75 21 10.75H13.25V3.00001Z"
                strokeWidth="1.5"
              ></path>
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
                id="profile-icon"
              >
                <title>Profile</title>
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </Link>
          )}
        </div>
        {currentUser ? (
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
        ) : (
          <Link to="/login" className="login-button nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="nav-icon">
              <title>Log in</title>
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
            </svg>
            <span>Log In</span>
          </Link>
        )}
      </nav>

      <div className="center-area">
        <header className="mobile-home-header">
          <div className="mobile-upper">
            <div className="mobile-left-spacer">
              {showBackButton && (
                <button className="mobile-back-button" onClick={handleBack}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="nav-icon"
                  >
                    <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mobile-logo-header">
              <Link to="/" className="logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="nav-icon"
                >
                  <title>DevThreads</title>
                  <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
                </svg>
              </Link>
            </div>
            <div className="mobile-right-spacer"></div>
          </div>
          {showFeedSelector && (
            <div className="mobile-feed-selector">
              <button
                className={`mobile-feed-option ${
                  selectedFeed === "following" ? "active" : ""
                }`}
                onClick={() => onFeedChange("following")}
              >
                Following
              </button>
              <button
                className={`mobile-feed-option ${
                  selectedFeed === "explore" ? "active" : ""
                }`}
                onClick={() => onFeedChange("explore")}
              >
                Explore
              </button>
            </div>
          )}
        </header>

        <header className="top-header">
          <div className="header-left">
            {showBackButton && (
              <button className="back-button" onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>Back</title>
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
              </button>
            )}
          </div>
          <div className="header-center">
            {title && !showFeedSelector && (
              <h1 className="page-title">{title}</h1>
            )}
            {showFeedSelector && (
              <div className="feed-selector">
                <button
                  className={`feed-tab ${selectedFeed === "following" ? "active" : ""}`}
                  onClick={() => onFeedChange("following")}
                >
                  Following
                </button>
                <button
                  className={`feed-tab ${selectedFeed === "explore" ? "active" : ""}`}
                  onClick={() => onFeedChange("explore")}
                >
                  Explore
                </button>
              </div>
            )}
          </div>
          <div className="header-right"></div>
        </header>

        <main className="content">{children}</main>
      </div>

      <nav className="navbar-mobile">
        <Link
          to="/"
          className={`nav-item-mobile ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="nav-icon-mobile"
          >
            <title>Home</title>
            <path
              d="M13.4056 3.72522C12.5838 3.06783 11.4162 3.06783 10.5944 3.72522L4.28209 8.7751C3.62975 9.29697 3.25 10.0871 3.25 10.9225V18C3.25 19.5188 4.48122 20.75 6 20.75H18C19.5188 20.75 20.75 19.5188 20.75 18V10.9225C20.75 10.0871 20.3703 9.29697 19.7179 8.7751L13.4056 3.72522ZM9.0327 1.77305C10.7675 0.385221 13.2325 0.38522 14.9673 1.77305L21.2796 6.82293C22.525 7.81923 23.25 9.32762 23.25 10.9225V18C23.25 20.8995 20.8995 23.25 18 23.25H6C3.1005 23.25 0.75 20.8995 0.75 18V10.9225C0.75 9.32763 1.47497 7.81923 2.72035 6.82293L9.0327 1.77305Z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <Link
          to="/users"
          className={`nav-item-mobile ${
            location.pathname === "/users" ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="nav-icon-mobile"
          >
            <title>User Index</title>
            <path
              clipRule="evenodd"
              d="M11.2607 1.01074C5.59982 1.01074 1.01074 5.59982 1.01074 11.2607C1.01074 16.9217 5.59982 21.5107 11.2607 21.5107C13.6407 21.5107 15.8312 20.6996 17.5709 19.3387L20.8554 22.6231C21.3435 23.1113 22.135 23.1113 22.6231 22.6231C23.1113 22.135 23.1113 21.3435 22.6231 20.8554L19.3387 17.5709C20.6996 15.8312 21.5107 13.6407 21.5107 11.2607C21.5107 5.59982 16.9217 1.01074 11.2607 1.01074ZM3.51074 11.2607C3.51074 6.98053 6.98054 3.51074 11.2607 3.51074C15.5409 3.51074 19.0107 6.98053 19.0107 11.2607C19.0107 15.541 15.5409 19.0107 11.2607 19.0107C6.98054 19.0107 3.51074 15.541 3.51074 11.2607Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </Link>

        <button
          className="nav-item-mobile"
          onClick={() => { if (requireAuth()) setShowCenteredModal(true); }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="nav-icon-mobile"
          >
            <title>Create</title>
            <path
              d="M13.25 3.00001C13.25 2.30965 12.6904 1.75001 12 1.75001C11.3096 1.75001 10.75 2.30965 10.75 3.00001V10.75H3C2.30964 10.75 1.75 11.3097 1.75 12C1.75 12.6904 2.30964 13.25 3 13.25H10.75V21C10.75 21.6904 11.3096 22.25 12 22.25C12.6904 22.25 13.25 21.6904 13.25 21V13.25H21C21.6904 13.25 22.25 12.6904 22.25 12C22.25 11.3097 21.6904 10.75 21 10.75H13.25V3.00001Z"
              strokeWidth="1.5"
            ></path>
          </svg>
        </button>

        {currentUser ? (
          <Link
            to={`/profile/${currentUser.username}`}
            className={`nav-item-mobile ${location.pathname === `/profile/${currentUser.username}` ? "active" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="nav-icon-mobile">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`nav-item-mobile ${location.pathname === "/login" ? "active" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="nav-icon-mobile">
              <title>Log in</title>
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
            </svg>
          </Link>
        )}

        {currentUser && (
          <button onClick={handleLogout} className="nav-item-mobile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="nav-icon-mobile"
            >
              <title>Logout</title>
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
            </svg>
          </button>
        )}
      </nav>

      <button
        className="new-post-button"
        onClick={() => { if (requireAuth()) setShowFloatingModal(true); }}
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
        isOpen={showCenteredModal || showFloatingModal}
        onClose={() => {
          setShowCenteredModal(false);
          setShowFloatingModal(false)
        }}
        variant={showFloatingModal ? "floating" : "centered"}
        onPostCreated={onPostCreated}
      />
    </div>
  );
}

export default Layout;
