import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../endpoints/users";

import FormInput from "../../Components/FormInput/FormInput";
import Button from "../../Components/Button/Button";
import { useNavigate } from "react-router-dom";

interface ResetPasswordInputs {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const password = watch("newPassword");

  const onSubmit = async (data: ResetPasswordInputs) => {
    setIsLoading(true);
    try {
      const response = await resetPassword(data.newPassword);
      if (response === "Password has been reset successfully") {
        setError("root", {
          type: "success",
          message: "Password has been reset successfully!",
        });
        setTimeout(() => navigate("/auth/login"), 3000);
      }
    } catch (error) {
      setError("root", {
        type: "error",
        message: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2 className="form-title">Reset Password</h2>
        <p className="form-subtitle">Enter your new password</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            register={register}
            registerOptions={{
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            }}
            error={errors.newPassword?.message}
            disabled={isLoading}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            register={register}
            registerOptions={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            label="Reset Password"
            loading={isLoading}
          />

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
        </form>
      </div>
    </div>
  );
};
