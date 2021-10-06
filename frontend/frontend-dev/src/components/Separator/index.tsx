import React from "react";
import styles from "./Separator.module.css";

interface ISeparatorProps {
  children: React.ReactNode;
}

const Separator = ({ children }: ISeparatorProps) => {
  return (
    <div className={`uppercase ${styles.separator}`}>
      <span>{children || ""}</span>
    </div>
  );
};

export default Separator;
