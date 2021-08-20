import React, { HTMLProps } from "react";

const Label = ({ htmlFor, children }: HTMLProps<HTMLLabelElement>) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-gray-700 text-sm font-bold mb-2">
      {children}
    </label>
  );
};

export default Label;
