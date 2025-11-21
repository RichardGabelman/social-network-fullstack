import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/api";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      authService.handleCallback(token);
      navigate("/");
    } else if (error) {
      navigate(`/login?error=${error}`);
    }
  }, [searchParams, navigate]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;