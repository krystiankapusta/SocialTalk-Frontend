import "./styles.css";

type ButtonProps = {
  label: string;
  variant: "primary" | "secondary" | "disabled" | "tertiary";
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({ label, variant, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled || variant === "disabled"}
    >
      {label}
    </button>
  );
};

export default Button;
