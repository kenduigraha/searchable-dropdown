import React from "react";
import SearchableDropdown from "../components/SearchableDropdown/SearchableDropdown";

export default {
  title: "Components/SearchableDropdown",
  component: SearchableDropdown,
};

const Template = (args) => <SearchableDropdown {...args} />;

export const MultiSelectInput = Template.bind({});
MultiSelectInput.args = {
  options: [
    { id: 1, value: "1", label: "Apple", icon: "🍎", outlined: true },
    { id: 2, value: "2", label: "Banana", icon: "🍌" },
    { id: 3, value: "3", label: "Cherry", icon: "🍒", outlined: true },
    { id: 4, value: "4", label: "Date", icon: "📅" },
    { id: 5, value: "5", label: "Elderberry", icon: "🫐" },
  ],
  onSelect: (option) => console.log("Selected:", option),
  isMultiSelect: true,
  withSearch: true,
  onChange: () => {},
};