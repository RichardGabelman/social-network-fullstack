import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/api.js";

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
