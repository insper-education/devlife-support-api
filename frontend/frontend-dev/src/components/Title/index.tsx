import React, { HTMLProps } from "react";

const Title = ({ children, className }: HTMLProps<HTMLHeadingElement>) => {
  return (
    <h1 className={`${className || ""} text-4xl leading-loose`}>{children}</h1>
  );
};

export default Title;
