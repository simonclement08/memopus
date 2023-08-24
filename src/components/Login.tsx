import React, { useState, useRef } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import Data from "../services/Data";
import { UserInterface } from "../interface/UserInterface";

interface LoginProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const data = Data.getInstance();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate(); // Utilisez useNavigate pour gérer la redirection
  let user: UserInterface[] | null = null;
  const handleLogin = () => {
    (async () => {
      const users = await data.loadUsers();
      user = users.filter((u) => u.username === username && u.pwd === password);

      if (user.length) {
        setIsAuthenticated(true);
        navigate("/memopus");
      } else {
        setErrorMessage(
          "Échec de la connexion. Veuillez vérifier vos informations."
        );
        setUsername("");
        setPassword("");
        if (usernameRef.current) {
          usernameRef.current.focus();
        }
      }
    })();
  };

  if (isAuthenticated) {
    return <Navigate to="/memopus" />;
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameRef}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
