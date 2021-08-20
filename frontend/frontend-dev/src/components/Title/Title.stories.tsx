import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Title from ".";

const meta: ComponentMeta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  argTypes: {},
};
export default meta;

const Template: ComponentStory<typeof Title> = (args) => <Title {...args} />;

export const Example = Template.bind({});
Example.args = {
  children: "Title",
};
