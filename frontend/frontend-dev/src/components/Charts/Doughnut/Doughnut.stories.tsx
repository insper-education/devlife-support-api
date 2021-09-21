import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Doughnut } from ".";

const meta: ComponentMeta<typeof Doughnut> = {
  title: "Components/Charts/Doughnut",
  component: Doughnut,
};

export default meta;

const Template: ComponentStory<typeof Doughnut> = (args) => (
  <Doughnut {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: ["A", "B", "C"],
  numSelectedOptions: [3, 4, 5],
};
