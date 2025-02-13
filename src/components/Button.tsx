import React from "react";

interface ButtonProps {
  onClick: () => void;
  label: string;
  color?: "red" | "green" | "blue" | "orange";
  minWidth?: string;
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  color = "red",
  minWidth = "min-w-7xl",
  isDisabled = false,
}) => {
  const buttonClass = `px-4 py-2 ${minWidth} w-20 rounded-md text-white ${
    color === "red"
      ? "bg-red-500 hover:bg-red-600"
      : color === "green"
      ? "bg-green-500 hover:bg-green-600"
      : color === "blue"
      ? "bg-blue-500 hover:bg-blue-600"
      : color === "orange"
      ? "bg-orange-500 hover:bg-orange-600"
      : "bg-gray-500 hover:bg-gray-600"
  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button
      className={buttonClass}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default Button;
