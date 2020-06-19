import React from "react";
import styles from "./select.module.scss";
/**
 *
 * @param {string}		buttonText - key holding the value data for the select option
 * @param {boolean}		columnView - true - display label and select in flex-column view
 * @param {boolean}		container - true - display or don't display container class on top level element
 * @param {array}		data - array holding key-value data for all the select options
 * @param {boolean}		displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}		displayKey - key holding the data to display in the select option
 * @param {string}		displayValue - text to display instead of allowing userInput
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {object}		extraStyles - extra inline styles to apply to parent element
 * @param {function} 	handleOnChange - update parent state with user input
 * @param {string}		labelText - text to display as label
 * @param {string}		name - input type name
 * @param {function} 	onButtonClick - execute when user clicks the button
 * @param {string}		valueKey - key holding the value data for the select option
 */
const Select = ({
	buttonText,
	columnView = true,
	container = true,
	data,
	displayInput,
	displayKey,
	displayValue,
	extraClasses,
	extraStyles = {},
	handleOnChange,
	labelText,
	name,
	onButtonClick,
	valueKey,
}) => {
	const onChange = (event) => {
		// Retrieve the id of the _textcontent_ of the selected menu option
		const value = Array.from(event.target.options)
			.filter((option) => option.selected)
			.reduce((acc, selectedOption) => selectedOption.textContent, "");
		handleOnChange(name, value);
	};
	// if a buttons needs displayhed, make room for it
	const selectStyle = buttonText ? { width: "50%" } : { margin: 0 };

	//  display the current state value
	// convert to correct type to match data
	const initialSelectedValue = data
		// use equality op (==) to convert types because "9" should match 9
		.filter((ob) => ob[displayKey] == displayValue)
		.reduce((acc, selectedOb) => selectedOb[valueKey], "");
	return (
		<div
			className={
				(container ? styles.container + " " : "") +
				styles.selectComponent +
				(columnView && " d-flex flex-column") +
				(extraClasses ? " " + extraClasses : "")
			}>
			<label>{labelText}</label>
			<span className='d-flex flex-row w-100'>
				{displayInput ? (
					<>
						<select
							name={name}
							onChange={onChange}
							value={initialSelectedValue}
							style={Object.assign(selectStyle, extraStyles)}>
							<option key={""} value={""}></option>
							{data.map((ob, i) => (
								<option key={i} value={ob[valueKey]}>
									{ob[displayKey]}
								</option>
							))}
						</select>
						{buttonText && (
							<button className='btn btn-primary' onClick={onButtonClick}>
								{buttonText}
							</button>
						)}
					</>
				) : (
					<span>{displayValue}</span>
				)}
			</span>
		</div>
	);
};

export { Select };
