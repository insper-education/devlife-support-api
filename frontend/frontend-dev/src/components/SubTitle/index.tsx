import React, { HTMLProps } from "react";

const SubTitle = ({ children, className }: HTMLProps<HTMLHeadingElement>) => {
  return (
    <h2
      className={`${className || ""} text-2xl text-primary leading-none mt-1`}>
      {children}
    </h2>
  );
};

export default SubTitle;
