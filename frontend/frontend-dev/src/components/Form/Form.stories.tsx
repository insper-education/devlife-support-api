import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from ".";
import ErrorMessage from "./ErrorMessage";
import Button from "../Button";

const meta: ComponentMeta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  argTypes: { onUsernameChange: { action: "username changed" } },
};
export default meta;

const Template: ComponentStory<typeof Form> = (args) => (
  <Form className="px-4 py-4" {...args}>
    <Form.TextInput
      label="Username"
      inputId="username"
      name="username"
      placeholder="Type username"
    />
    <Form.TextInput
      label="Password"
      inputId="password"
      name="password"
      type="password"
      placeholder="Password"
      error={"Wrong password"}
    />
    <ErrorMessage>Some error message</ErrorMessage>
    <Button className="mt-2 w-full" type="submit">
      Sign in
    </Button>
  </Form>
);

export const Example = Template.bind({});
Example.args = {};
