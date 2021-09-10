import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Title from "../Title";
import SubTitle from ".";

const meta: ComponentMeta<typeof SubTitle> = {
  title: "Components/SubTitle",
  component: SubTitle,
  argTypes: {},
};
export default meta;

const Template: ComponentStory<typeof SubTitle> = (args) => (
  <>
    <Title>Some Title Here</Title>
    <SubTitle {...args} />
  </>
);

export const Example = Template.bind({});
Example.args = {
  children: "A longer subtitle right after it",
};
