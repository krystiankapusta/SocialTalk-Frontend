import "./styles.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Spinner = ({ size = "medium", color = "currentColor" }: SpinnerProps) => {
  const sizeMap = {
    small: "16px",
    medium: "24px",
    large: "32px",
  };

  return (
    <div
      className="spinner"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderColor: color,
        borderRightColor: "transparent",
      }}
    />
  );
};

export default Spinner;
