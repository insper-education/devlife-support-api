import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from ".";

const meta: ComponentMeta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      options: ["primary", "secondary", "hidden"],
      control: { type: "radio" },
    },
    onClick: { action: "clicked" },
  },
};
export default meta;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  children: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Button",
};

export const Hidden = Template.bind({});
Hidden.args = {
  variant: "hidden",
  children: "Button",
};
