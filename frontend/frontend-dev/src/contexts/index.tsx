import React from "react";
import UserProvider from "./user-context";

const Contexts: React.FC = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Contexts;
