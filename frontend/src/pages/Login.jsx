import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function Login({ setToken }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);  // update token state in App
    navigate("/welcome"); // Redirect to Welcome Page
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}
