import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles.css";
import { signup } from "../../../endpoints/users";
import FormInput from "../../FormInput/FormInput";
import Button from "../../Button/Button";
import { useState } from "react";

interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (data: SignupFormInputs) => {
    setIsLoading(true);
    try {
      const response = await signup(data);
      if (response && response.email) {
        setError("root", {
          type: "success",
          message:
            "Registration successful! Please check your email to verify your account",
        });
        navigate(`/auth/verify/${data.email}`);
      } else {
        setError("root", {
          type: "manual",
          message: "An error occurred",
        });
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data);
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message || "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput
          label="Username"
          type="text"
          name="username"
          placeholder="Enter your username"
          register={register}
          registerOptions={{
            required: "Username is required",
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username can only contain letters, numbers and underscores",
            },
          }}
          error={errors.username?.message}
          disabled={isLoading}
          required
        />

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

        <Button
          type="submit"
          variant="primary"
          label="Sign Up"
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
  );
};

export default SignupForm;
