import React from "react";
import SearchableDropdown from "../components/SearchableDropdown/SearchableDropdown";

export default {
  title: "Components/SearchableDropdown",
  component: SearchableDropdown,
};

const Template = (args) => <SearchableDropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ],
  onSelect: (option) => console.log("Selected:", option),
};