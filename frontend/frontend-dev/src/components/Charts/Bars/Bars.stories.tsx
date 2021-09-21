import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Bars } from "./";

const meta: ComponentMeta<typeof Bars> = {
  title: "Components/Charts/Bars",
  component: Bars,
};

export default meta;

const Template: ComponentStory<typeof Bars> = (args) => <Bars {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: ["A", "B", "C"],
  numSelectedOptions: [3, 4, 5]
}