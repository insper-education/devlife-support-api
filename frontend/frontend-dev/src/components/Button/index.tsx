import React, { HTMLProps } from "react";

interface ButtonProps {
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
  className,
}: ButtonProps & HTMLProps<HTMLButtonElement>) => {
  const variantClasses = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-secondary hover:bg-secondary-dark text-white",
    hidden: "bg-transparent",
  }[variant];

  return (
    <button
      className={`${className} ${variantClasses} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
      onClick={onClick}
      type={type}>
      {children}
    </button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
