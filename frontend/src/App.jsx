import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { SkeletonFeed } from "./components/Skeleton.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import Home from "./pages/Home.jsx";
import Users from "./pages/Users.jsx";
import Profile from "./pages/Profile.jsx";
import Post from "./pages/Post.jsx";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <SkeletonFeed />
      </Layout>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <SkeletonFeed />
      </Layout>
    );
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PublicRoute>
                    <Users />
                  </PublicRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <PublicRoute>
                    <Profile />
                  </PublicRoute>
                }
              />
              <Route
                path="/post/:postId"
                element={
                  <PublicRoute>
                    <Post />
                  </PublicRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
