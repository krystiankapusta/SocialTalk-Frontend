import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../endpoints/users";

const VerificationForm = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyEmail(email, verificationCode);
      if (response === "Account verified successfully") {
        setMessage("E-mail verified successfully!");
      }
      navigate("/auth/login");
    } catch (error) {
      setMessage("Verification failed. Try again!");
    }
  };

  return (
    <div>
      <form onSubmit={handleVerification}>
        <h1>Verify Your Account</h1>
        <p>Please enter the code sent to your email</p>
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
          <label htmlFor="code">Verification code</label>
          <input
            type="text"
            id="code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>

        <div>
          <input type={"submit"} value={"Verify email"} />

          <Link to={"/auth/resend?email=${email}"}>Resend code again</Link>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerificationForm;
