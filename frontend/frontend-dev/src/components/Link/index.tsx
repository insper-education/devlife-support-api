import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

const Link = ({ to, children, className }: LinkProps) => {
  return (
    <RouterLink to={to} className={`text-primary underline ${className ?? ''}`}>
      {children}
    </RouterLink>
  );

};

export default Link;