import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Memo from "./Memo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="App">
      <header className="col d-flex justify-content-center bg-light p-4 h1">
        Mémopus
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/memopus"
          element={isAuthenticated ? <Memo /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
