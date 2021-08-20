import React, { HTMLProps } from "react";

const Container = ({ children }: HTMLProps<HTMLDivElement>) => {
  return <div className="mx-4">{children}</div>;
};

export default Container;
