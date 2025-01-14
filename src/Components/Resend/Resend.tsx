import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../Services/UserService";

const VerificationForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await UserService.resendVerificationCode(email);

      if (response === "Verification code sent") {
        setMessage("The verification code has been sent to your email.");

        console.log("Verification code sent");
        setTimeout(() => navigate("/auth/verify"), 2500);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response.data === "Account is already verified") {
          setTimeout(() => navigate("/auth/login"), 1500);
          setMessage(error.response.data);
        }
        if (error.response.data === "User not found") {
          setTimeout(() => navigate("/auth/signup"), 1500);
          setMessage(error.response.data);
        }
      } else {
        console.error("Resend Error:", error.response?.data || error.message);
        setMessage("An error occurred while sending the code");
        setTimeout(() => navigate("/auth/signup"), 1500);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleVerification}>
        <div>
          <h1>Verify Your Account</h1>
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
          <button type={"submit"}>Resend code</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerificationForm;
