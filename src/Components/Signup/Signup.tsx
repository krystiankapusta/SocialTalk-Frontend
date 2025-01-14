import React, { useState } from "react";
import UserService from "../../Services/UserService";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = { username, email, password };
      const response = await UserService.signup(userData);
      console.log("Signup Response:", response);
      if (response && response.email) {
        setMessage(
          "Rejestracja zakończona sukcesem! Sprawdź swój email, aby zweryfikować konto.",
        );
      } else {
        setMessage("Wystąpił błąd.");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response.data);
      setMessage("Wystąpił błąd podczas rejestracji.");
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
        <button type="submit">Zarejestruj się</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupForm;
