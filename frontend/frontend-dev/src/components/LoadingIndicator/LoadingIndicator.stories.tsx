import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LoadingIndicator from ".";

const meta: ComponentMeta<typeof LoadingIndicator> = {
  title: "Components/LoadingIndicator",
  component: LoadingIndicator,
  argTypes: {
    className: {
      options: [
        "text-xs",
        "text-sm",
        "text-md",
        "text-lg",
        "text-xl",
        "text-2xl",
        "text-3xl",
        "text-4xl",
      ],
      control: { type: "radio" },
    },
  },
};
export default meta;

const Template: ComponentStory<typeof LoadingIndicator> = (args) => (
  <div className={args.light ? "bg-black" : "bg-white"}>
    <LoadingIndicator {...args} />
  </div>
);

export const Example = Template.bind({});
Example.args = {
  className: "text-xs",
};
