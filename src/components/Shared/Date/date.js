import React, { useState } from "react";
import * as styles from "./date.module.scss";

/**
 *
 * @param {string} labelText - text to display as label
 * @param {string} name - input type name
 * @param {any} displayValue - text to display instead of allowing userInput
 * @param {boolean} displayInput - true: display user input DOM element; false: display existing value instead
 * @param {function} handleOnChange - update parent state with user input
 */
const DateComponent = ({ labelText, name, displayValue, displayInput, handleOnChange }) => {
	const [value, setValue] = useState("");

	const onLocalChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container}>
			<label>{labelText}</label>
			<span className='d-flex flex-row justify-content-between align-items-center'>
				{displayInput ? (
					<input type='date' name={name} value={value} onChange={onLocalChange} />
				) : (
					<span>{displayValue}</span>
				)}
			</span>
		</div>
	);
};

export { DateComponent };
