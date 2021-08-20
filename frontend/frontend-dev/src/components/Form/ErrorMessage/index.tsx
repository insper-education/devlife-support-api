import React, { ReactNode } from "react";

interface ErrorMessageProps {
  children: ReactNode;
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return <p className="text-red-500 text-xs italic">{children}</p>;
};

export default ErrorMessage;
