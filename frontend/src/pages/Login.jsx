import { authService } from "../services/api.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleGitHubLogin = () => {
    authService.loginWithGithub();
  };

  return (
    <div class="login-container">
      <div class="login-card">
        <h1 classname="login-title">Login</h1>
        <button onClick={handleGitHubLogin} classname="github-button">
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
