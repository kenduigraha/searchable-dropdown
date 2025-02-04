import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const SearchableDropdown = ({
  options,
  onSelect,
  isMultiSelect = false,
  isSearchable = true,
  renderOption,
  portalTarget = null,
  zIndex = 1000,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onSelect(option);
    if (!isMultiSelect) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownMenu = (
    <div
      style={{ zIndex }}
      className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow-lg"
    >
      {isSearchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border-b border-gray-300 focus:outline-none"
        />
      )}
      <ul className="max-h-60 overflow-y-auto">
        {filteredOptions.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {renderOption ? renderOption(option) : option.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      >
        {isOpen ? "Close Dropdown" : "Open Dropdown"}
      </button>
      {isOpen &&
        (portalTarget
          ? ReactDOM.createPortal(dropdownMenu, portalTarget)
          : dropdownMenu)}
    </div>
  );
};

export default SearchableDropdown;