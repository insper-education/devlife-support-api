import React, { ReactNode } from "react";

interface IErrorMessageProps {
  children: ReactNode;
}

const ErrorMessage = ({ children }: IErrorMessageProps) => {
  return <p className="text-red-500 text-xs italic">{children}</p>;
};

export default ErrorMessage;
