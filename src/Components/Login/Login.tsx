import React, { useState } from "react";
import UserService from "../../Services/UserService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await UserService.login(email, password);
      setMessage("Logowanie zakończone sukcesem!");
      localStorage.setItem("token", result.token);
      window.postMessage({ type: "TOKEN", token: result.token }, "*");
    } catch (error) {
      setMessage("Incorrect password or email.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zaloguj się</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
