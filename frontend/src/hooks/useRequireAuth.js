import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
 
export function useRequireAuth() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
 
  const requireAuth = () => {
    if (!currentUser) {
      navigate("/login");
      return false;
    }
    return true;
  };
 
  return requireAuth;
}