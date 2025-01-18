import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../../endpoints/users";
import { useAuth } from "../../../context/AuthContext";

import "../styles.css";
import FormInput from "../../FormInput/FormInput";
import Button from "../../Button/Button";
import { useState } from "react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const email = watch("email");

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      localStorage.setItem("token", result.token);
      await checkAuthStatus();
      navigate("/");
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message || "Incorrect password or email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("email", {
        type: "manual",
        message: "Please enter your email first",
      });
      return;
    }
    navigate(`/auth/resetPassword/${email}`);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          register={register}
          registerOptions={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          error={errors.email?.message}
          disabled={isLoading}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          register={register}
          registerOptions={{
            required: "Password is required",
            minLength: {
              value: 4,
              message: "Password must be at least 4 characters",
            },
          }}
          error={errors.password?.message}
          disabled={isLoading}
          required
        />

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            label="Log in"
            loading={isLoading}
          />

          <button
            type="button"
            className="forgot-password-link"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {"Forgot Password?"}
          </button>
        </div>

        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
