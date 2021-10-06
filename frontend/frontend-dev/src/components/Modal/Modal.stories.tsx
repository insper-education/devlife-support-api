import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Modal from ".";
import Button from "../Button";

const meta: ComponentMeta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};
export default meta;

const Template: ComponentStory<typeof Modal> = ({
  okText,
  cancelText,
  title,
  bodyText,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <div className="">
      <Button
        onClick={() => {
          setIsOpened(true);
        }}>
        Open modal
      </Button>
      <Modal
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        okText={okText}
        cancelText={cancelText}
        title={title}
        bodyText={bodyText}
      />
    </div>
  );
};

export const Example = Template.bind({});
Example.args = {
  okText: "Yeah",
  cancelText: "Nah",
  title: "Plant a tree?",
  bodyText: "Or maybe you prefer to write a book",
};
