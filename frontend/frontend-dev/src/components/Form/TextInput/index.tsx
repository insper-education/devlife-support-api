import React, { forwardRef, HTMLProps } from "react";
import ErrorMessage from "../ErrorMessage";
import Label from "../Label";

interface TextInputProps {
  inputId: string;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
}

const defaultProps = {
  type: "text",
};

const TextInput = forwardRef<
  HTMLInputElement,
  TextInputProps & HTMLProps<HTMLInputElement>
>((props, ref) => {
  const {
    error,
    label,
    placeholder,
    inputId,
    name,
    type,
    ...otherProps
  } = props;
  return (
    <div className="mb-4">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <input
        className={`appearance-none border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        id={inputId}
        type={type}
        name={name}
        ref={ref}
        placeholder={placeholder || ""}
        {...otherProps}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
});

TextInput.defaultProps = defaultProps;

export default TextInput;
