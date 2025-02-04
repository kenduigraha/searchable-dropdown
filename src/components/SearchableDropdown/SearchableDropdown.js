import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import SelectedItem from "../SelectedItem";
  
function SearchableDropdown({
    options = [],
    multiple = true,
    withSearch = true,
    outlined = false, // TODO
    portal = true,
    optionLabel = "",
    onChange = () => {},
  }) {
    const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedData, setselectedData] = useState([]);
	const [selectedDataSet, setselectedDataSet] = useState(new Set());
	const [activeSuggestion, setActiveSuggestion] = useState(0);

	const inputRef = useRef(null);
    

    const DropdownList = (
        <motion.ul
            className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-[1050] suggestions-list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            {options?.map((data, index) => {
                // TODO: selected item background highligth
                return !selectedDataSet.has(data.label) ? (
                    <li
                        className={`p-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedData === data
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        key={data.id || data.value}
                        onClick={() => {
                            handleSelectData(data)
                            setOpen(!open)
                        }}
                    >
                        <span>
                            {data.label} {data.icon}
                        </span>
                    </li>
                ) : (
                    <></>
                );
            })}
        </motion.ul>
    );

    const handleOnChange = (e) => {
        e.preventDefault();

        setOpen(!open);
        
        setSearchTerm(e.target.value);

        onChange(e);
    }
	const handleSelectData = (data) => {
        if (multiple) {
            // prevent double selection
            const result = [...selectedData, data].reduce((acc, item) => {
                if (!acc.find(other => item.id == other.id)) {
                    acc.push(item);
                }
                    return acc;  
            }, []);
            setselectedData(result);
            setselectedDataSet(new Set([...result]));
        } else {
            // only 1 data
            setselectedData([data]);
            setselectedDataSet(new Set([data.id]));
        }
		
        setSearchTerm("");
        inputRef.current.focus();
	};

	const handleRemoveData = (data) => {
		const filteredData = selectedData.filter(
			(arrData) => arrData.id !== data.id
		);
		setselectedData(filteredData);

        // update the data list
		const updatedData = new Set(selectedDataSet);
		updatedData.delete(data.id);

		setselectedDataSet(updatedData);
	};


    // TODO: for better UX
	const handleKeyDown = (e) => {
		if (
			e.key === "Backspace" &&
			e.target.value === "" &&
			selectedData.length > 0
		) {
			const lastData = selectedData[selectedData.length - 1];
			handleRemoveData(lastData);
		} else if (e.key === "ArrowDown" &&
			options?.label?.length > 0) {
			e.preventDefault();
			setActiveSuggestion((prevIndex) =>
				prevIndex < options.label.length - 1 ?
					prevIndex + 1 : prevIndex
			);
		} else if (e.key === "ArrowUp" &&
			options?.label?.length > 0) {
			e.preventDefault();
			setActiveSuggestion((prevIndex) =>
				(prevIndex > 0 ? prevIndex - 1 : 0));
		} else if (
			e.key === "Enter" &&
			activeSuggestion >= 0 &&
			activeSuggestion < options.label.length
		) {
			handleSelectData(options.label[activeSuggestion]);
		}
	};

	return (
		<div className="user-search-container">
            {optionLabel && (
                <label for={optionLabel}>
                    {optionLabel}
                </label>
            )}
			<div className="user-search-input">
				{selectedData.map((data) => {
					return (
						<SelectedItem
							key={`search_item_${data.id}`}
							text={`${data.label || ''} ${data.icon || ''}`}
							onClick={() => handleRemoveData(data)}
						/>
					);
				})}
				{/* input field with search suggestions */}
				<div>
					<input
						ref={inputRef}
						type="text"
						value={searchTerm}
                        onClick={() => setOpen(!open)}
						onChange={(e) => handleOnChange(e)}
						placeholder="Search..."
						onKeyDown={handleKeyDown}
                        readOnly={!withSearch}
                        
					/>
                    {open && (portal ? createPortal(DropdownList, document.body) : DropdownList)}
				</div>
			</div>
		</div>
	);
}

export default SearchableDropdown;