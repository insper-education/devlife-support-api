import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Separator from ".";

const meta: ComponentMeta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  argTypes: {},
};
export default meta;

const Template: ComponentStory<typeof Separator> = (args) => (
  <div className="w-42 border border-gray-200">
    <Separator {...args} />
  </div>
);

export const Example = Template.bind({});
Example.args = {
  children: "Some separator text",
};
