import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ProgressCheck from ".";

const meta: ComponentMeta<typeof ProgressCheck> = {
  title: "Components/ProgressCheck",
  component: ProgressCheck,
};
export default meta;

const Template: ComponentStory<typeof ProgressCheck> = (args) => (
  <div className="flex justify-between">
    <ProgressCheck className="w-8 h-8" {...args} />
    <ProgressCheck className="w-8 h-8" progress={0} />
    <ProgressCheck className="w-8 h-8" progress={0.25} />
    <ProgressCheck className="w-8 h-8" progress={0.5} />
    <ProgressCheck className="w-8 h-8" progress={0.75} />
    <ProgressCheck className="w-8 h-8" progress={1} />
  </div>
);

export const Example = Template.bind({});
Example.args = {};
