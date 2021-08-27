import React, { HTMLProps } from "react";

const Container = ({ className, children }: HTMLProps<HTMLDivElement>) => {
  return <div className={`mx-4 ${className}`}>{children}</div>;
};

export default Container;
