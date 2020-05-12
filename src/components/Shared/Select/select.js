import React, { useState } from "react";
import styles from "./select.module.scss";
/**
 *
 * @param {string} labelText - text to display as label
 * @param {string} name - input type name
 * @param {string} displayValue - text to display instead of allowing userInput
 * @param {boolean} displayInput - true: display user input DOM element; false: display existing value instead
 * @param {array} data - array holding key-value data for all the select options
 * @param {string} displayKey - key holding the data to display in the select option
 * @param {string} valueKey - key holding the value datafor the select option
 * @param {string} buttonText - key holding the value data for the select option
 * @param {function} handleOnChange - update parent state with user input
 * @param {function} onButtonClick - execute when user clicks the button
 */
const Select = ({
	labelText,
	name,
	displayValue,
	displayInput,
	data,
	displayKey,
	valueKey,
	buttonText,
	handleOnChange,
	onButtonClick,
}) => {
	const [value, setValue] = useState("");

	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container}>
			<label>{labelText}</label>
			{displayInput ? (
				<span className='d-flex flex-row justify-content-between'>
					<select name={name} onChange={onChange} value={value}>
						<option value=''>--</option>
						{data.map((ob) => (
							<option key={ob[valueKey]} value={ob[displayKey]}>
								{ob[displayKey]}
							</option>
						))}
					</select>
					{buttonText && (
						<button className='btn btn-primary ml-3' onClick={onButtonClick}>
							{buttonText}
						</button>
					)}
				</span>
			) : (
				<span>{displayValue}</span>
			)}
		</div>
	);
};

export { Select };
