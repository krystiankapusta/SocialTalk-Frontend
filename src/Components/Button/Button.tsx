import React from "react";
import Spinner from "../Spinner/Spinner";
import "./styles.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "primary" | "secondary" | "disabled" | "tertiary";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  loading = false,
  disabled,
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={disabled || loading || variant === "disabled"}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="small" color="currentColor" />
          <span>Please wait...</span>
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
