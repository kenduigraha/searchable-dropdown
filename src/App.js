import React from "react";
import SearchableDropdown from "./components/SearchableDropdown/SearchableDropdown";

const options = [
  { id: 1, value: "1", label: "Apple", icon: "🍎", outlined: true },
  { id: 2, value: "2", label: "Banana", icon: "🍌" },
  { id: 3, value: "3", label: "Cherry", icon: "🍒", outlined: true },
  { id: 4, value: "4", label: "Date", icon: "📅" },
  { id: 5, value: "5", label: "Elderberry", icon: "🫐" },
];

const App = () => {
  const handleSelect = (option) => {
    console.log("Selected:", option);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Searchable Dropdown</h1>
      <SearchableDropdown
        options={options}
        onSelect={handleSelect}
        multiple={true}
        withSearch={true}
        outlined={false}
      />
    </div>
  );
};

export default App;