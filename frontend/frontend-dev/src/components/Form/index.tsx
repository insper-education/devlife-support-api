import React, { HTMLProps } from "react";
import Label from "./Label";
import TextInput from "./TextInput";

const Form = (props: HTMLProps<HTMLFormElement>) => {
  return <form {...props} />;
};

Form.Label = Label;
Form.TextInput = TextInput;

export default Form;
