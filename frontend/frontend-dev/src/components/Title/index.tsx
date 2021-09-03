import React, { HTMLProps } from "react";

interface TitleProps {
  variant: 1 | 2 | 5;
}

const defaultProps = {
  variant: 1,
};

const Title = ({
  variant,
  children,
  className,
}: HTMLProps<HTMLHeadingElement> & TitleProps & typeof defaultProps) => {
  const Component = variant === 5 ? "h5" : variant === 2 ? "h2" : "h1";
  const textSize = variant === 5 ? "" : variant === 2 ? "text-2xl" : "text-4xl";
  const marginTop =
    !className || (className.indexOf("mt-") < 0 && className.indexOf("my-") < 0)
      ? "mt-4"
      : "";

  return (
    <Component
      className={`${
        className || ""
      } uppercase font-bold ${textSize} leading-none tracking-wide ${marginTop}`}>
      {children}
    </Component>
  );
};
Title.defaultProps = defaultProps;

export default Title;
