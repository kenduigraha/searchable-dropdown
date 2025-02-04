import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import SelectedItem from "../SelectedItem";

// helper
const findWord = (word, str) => {
    return str.includes(word);
};
  
function SearchableDropdown({
    id = '1',
    options = [],
    multiple = true,
    withSearch = true,
    outlined = false, // TODO
    portal = true,
    optionLabel = "",
    onChange = () => {},
  }) {
    const [open, setOpen] = useState(false);
	const [optionList, setOptionList] = useState([]);
	const [searchInput, setSearchInput] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
	const [selectedData, setselectedData] = useState([]);
	const [selectedDataSet, setselectedDataSet] = useState(new Set());
	const [activeSuggestion, setActiveSuggestion] = useState(0);

	const inputRef = useRef(null);

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
          setDebouncedInputValue(searchInput);
        }, 500);
        return () => clearTimeout(delayInputTimeoutId);
      }, [searchInput, 500]);

    useEffect(() => {
        setOptionList(options);
    }, [options]);
    
    const DropdownList = (
        <motion.ul
            key={`dropdown-list-${id}`}
            className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-[1050] suggestions-list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            {optionList.length > 0 && optionList?.map((data, index) => {
                return !selectedDataSet.has(data.label) ? (
                    <li
                        key={`option-item-${data.id}-${index}`}
                        className={`p-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedData === data
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() => {
                            handleSelectData(data)
                            setOpen(!open)
                        }}
                    >
                        <span>
                            {data.parsedLabel ? (data.parsedLabel) : `${data.label}`} {data.icon}
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
        const textValue = e.target.value.trim();
        
        setSearchInput(textValue);

        if (!textValue) {
            setOpen(false);

            setOptionList(options);

            return;
        }
        const dataOptions = [];
        // highlight words
        optionList.map((option) => {
            const dataItemOption = option.label.toLowerCase();
            const indexSearchedText = dataItemOption.indexOf(textValue);
            const isFounded = findWord(textValue, dataItemOption);

            const newElement = [
                dataItemOption.substring(0, indexSearchedText),
                <span className={'bg-highlight'}>
                    {option.label.substring(indexSearchedText, indexSearchedText + textValue.length)}
                </span>,
                option.label.substring(indexSearchedText + textValue.length)
            ];

            dataOptions.push({
                ...option,
                parsedLabel: isFounded ? newElement : null,
            });
            
            setOptionList([...dataOptions]);
        });

        setOpen(true);

        // from parent component
        onChange(e);
    };
    
	const handleSelectData = (data) => {
        if (multiple) {
            // prevent double selection
            const result = [...selectedData, data].reduce((acc, item) => {
                if (!acc.find(other => item.id === other.id)) {
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
		
        setSearchInput("");
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
			optionList?.label?.length > 0) {
			e.preventDefault();
			setActiveSuggestion((prevIndex) =>
				prevIndex < optionList.label.length - 1 ?
					prevIndex + 1 : prevIndex
			);
		} else if (e.key === "ArrowUp" &&
			optionList?.label?.length > 0) {
			e.preventDefault();
			setActiveSuggestion((prevIndex) =>
				(prevIndex > 0 ? prevIndex - 1 : 0));
		} else if (
			e.key === "Enter" &&
			activeSuggestion >= 0 &&
			activeSuggestion < optionList.label.length
		) {
			handleSelectData(optionList.label[activeSuggestion]);
		}
	};

	return (
		<div key={`search-dropdown-container-${id}`} className="user-search-container">
            {optionLabel && (
                <label htmlFor={optionLabel}>
                    {optionLabel}
                </label>
            )}
			<div className={`user-search-input ${outlined ? "outline" : ''}`}>
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
				<div className="input-wrapper">
					<input
                        className={`${outlined ? 'search__outlined' : ''}`}
						ref={inputRef}
						type="text"
						value={searchInput}
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