import React, { HTMLProps } from "react";

interface IButtonProps {
  className: string;
  variant: "primary" | "secondary" | "hidden";
  type: "button" | "submit" | "reset" | undefined;
}

const defaultProps = {
  className: "",
  variant: "primary",
  type: "button",
};

const Button = ({
  onClick,
  variant,
  children,
  type,
  disabled,
  className,
}: IButtonProps & HTMLProps<HTMLButtonElement>) => {
  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 text-gray-500 cursor-default"
      : "bg-primary hover:bg-primary-500 text-white",
    secondary: disabled
      ? "bg-gray-300 text-gray-500 cursor-default"
      : "bg-secondary hover:bg-secondary-500 text-white",
    hidden: disabled
      ? "bg-transparent text-gray-500 cursor-default"
      : "bg-transparent",
  }[variant];

  return (
    <button
      className={`${className} ${variantClasses} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center`}
      onClick={onClick}
      type={type}
      disabled={disabled}>
      {children}
    </button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
