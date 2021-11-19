import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CodeDiff } from ".";

const meta: ComponentMeta<typeof CodeDiff> = {
  title: "Components/CodeDiff",
  component: CodeDiff,
  argTypes: {
    language: {
      options: ["python", "javascript", "css"],
      control: { type: "radio" },
    },
  },
};
export default meta;

const Template: ComponentStory<typeof CodeDiff> = (args) => (
  <CodeDiff {...args} />
);

const cssExamples = {
  base: `
.class-name {
  background-color: red;
  color: #f6f6f6;
  display: flex;
}

.class-name > div {
  flex: 1;
  border: 1px solid gray;
}
`,
  differentBase: `
.class-name {
  background-color: red;
  color: white;
  display: flex;
}

.class-name div.main-div {
  flex: 1;
  border: 1px solid gray;
}
`,
};

export const Css = Template.bind({});
Css.args = {
  language: "css",
  left: cssExamples.base,
  right: cssExamples.differentBase,
};

const javascriptExamples = {
  base: `
let conf = userInput('Você ainda tem dúvidas? ');
while (conf !== "nao") {
  console.log("Pratique mais")
  conf = userInput('Você ainda tem dúvidas? ');
  if (conf === "nao") {
    console.log("até a próxima")
  }
}
`,
  differentBase: `
let conf = userInput('Você tem dúvidas? ');
while (conf !== "Não") {
  console.log("Pratique mais")
  conf = userInput('Você tem dúvidas? ');
  if (conf === "Não") {
    console.log("até a próxima")
  }
}`,
};

export const Javascript = Template.bind({});
Javascript.args = {
  language: "javascript",
  left: javascriptExamples.base,
  right: javascriptExamples.differentBase,
};

const pythonExamples = {
  smaller: `
conf = input('Você ainda tem dúvidas? ')
if conf == 'não':
  print('Até a próxima')
`,
  base: `
conf = input('Você ainda tem dúvidas? ')
while conf != 'N':
  print('Pratique mais')
  conf = input('Você ainda tem dúvidas? ')
  if conf == 'N':
    print('Até a próxima')
`,
  differentBase: `
conf = input('Você tem dúvidas? ')
while conf != 'Não':
  print('Pratique mais')
  conf = input('Você tem dúvidas? ')
  if conf == 'Não':
    print('Até a próxima')
`,
  bigger: `
conf = input('Você ainda tem dúvidas? ')

while conf != 'N':
  print('Pratique mais')
  conf = input('Você ainda tem dúvidas? ')

  if conf == 'N':
    print('Até a próxima')
`,
};

export const Python = Template.bind({});
Python.args = {
  language: "python",
  left: pythonExamples.base,
  right: pythonExamples.base,
};

export const PythonChanged = Template.bind({});
PythonChanged.args = {
  language: "python",
  left: pythonExamples.base,
  right: pythonExamples.differentBase,
};

export const PythonAdditions = Template.bind({});
PythonAdditions.args = {
  language: "python",
  left: pythonExamples.smaller,
  right: pythonExamples.bigger,
};

export const PythonDeletions = Template.bind({});
PythonDeletions.args = {
  left: pythonExamples.bigger,
  right: pythonExamples.smaller,
};
