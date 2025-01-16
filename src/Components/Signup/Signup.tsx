import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../endpoints/users";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = { username, email, password };
      const response = await signup(userData);
      console.log("Signup Response:", response);
      if (response && response.email) {
        setMessage(
          "Registration successful! Please check your email to verify your account",
        );
        navigate("/auth/verify");
      } else {
        setMessage("An error occurred");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response.data);
      setMessage("An error occurred during signup");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupForm;
