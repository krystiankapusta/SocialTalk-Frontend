import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resendVerificationCode, verifyEmail } from "../../../endpoints/users";
import FormInput from "../../FormInput/FormInput";
import Button from "../../Button/Button";
import "../styles.css";

interface VerificationFormInputs {
  verificationCode: string;
}

const VerificationForm = () => {
  const { email } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerificationFormInputs>();

  const handleResendCode = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    try {
      await resendVerificationCode(email);
      setResendMessage("Verification code has been resent to your email");
      setTimeout(() => {
        setResendMessage("");
      }, 5000);
    } catch (error) {
      setResendMessage("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: VerificationFormInputs) => {
    if (!email) {
      setError("root", {
        type: "manual",
        message: "Email is missing. Please try signing up again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyEmail(email, data.verificationCode);
      if (response === "Account verified successfully") {
        setError("root", {
          type: "success",
          message: "E-mail verified successfully!",
        });
        navigate("/auth/login");
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Verification failed. Try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="login-page">
        <div className="form-container">
          <h2 className="form-title">Error</h2>
          <p className="error-message">
            Email is missing. Please try signing up again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h2 className="form-title">Verify Your Account</h2>
        <p className="form-subtitle">
          Please enter the verification code sent to {email}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <FormInput
            label="Verification code"
            type="text"
            name="verificationCode"
            placeholder="Enter verification code"
            register={register}
            registerOptions={{
              required: "Verification code is required",
            }}
            error={errors.verificationCode?.message}
            disabled={isLoading}
            required
          />

          <div className="button-group">
            <Button
              type="submit"
              variant="primary"
              label="Verify email"
              loading={isLoading}
            />

            <Button
              type="button"
              variant="tertiary"
              label={isResending ? "Sending..." : "Resend code"}
              onClick={handleResendCode}
              disabled={isResending}
            />
          </div>

          {errors.root && (
            <p
              className={`${
                errors.root.type === "success"
                  ? "success-message"
                  : "error-message"
              }`}
            >
              {errors.root.message}
            </p>
          )}

          {resendMessage && <p className="info-message">{resendMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;
