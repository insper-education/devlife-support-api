import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Table } from "./";

const meta: ComponentMeta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: [
    { "String": "this is a string (0, 0)", "Number": 0, "ReactNode": <pre>bold (0, 2)</pre>  },
    { "String": "this is a string (1, 0)", "Number": 1, "ReactNode": <pre>bold (1, 2)</pre>  },
    { "String": "this is a string (2, 0)", "Number": 2, "ReactNode": <pre>bold (2, 2)</pre>  },
    { "String": "this is a string (3, 0)", "Number": 3, "ReactNode": <pre>bold (3, 2)</pre>  },
  ],
};
