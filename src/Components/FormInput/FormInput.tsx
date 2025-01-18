import React, { InputHTMLAttributes, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import "./styles.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: "text" | "email" | "password";
  name: string;
  error?: string;
  register: UseFormRegister<any>;
  registerOptions?: Object;
}

export const FormInput: React.FC<InputProps> = ({
  label,
  type,
  name,
  error,
  register,
  registerOptions,
  required,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <div className="input-wrapper">
        <input
          id={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className="form-input"
          {...register(name, registerOptions)}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            className="show-password-button"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <span role="alert" className="form-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
