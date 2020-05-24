import React, { useState } from "react";
import styles from "./input.module.scss";

/**
 *
 * @param {boolean}		container - true - display or don't display container class on top level element
 * @param {boolean}		displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}		displayValue - text to display instead of allowing userInput
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {string}		extraStyles - extra styles to apply to parent element
 * @param {function} 	handleOnChange - update parent state with user input
 * @param {string}		labelText - text to display as label
 * @param {string}		name - input type name
 * @param {number}		type - type of input element
 */

const Input = ({
	container = true,
	displayInput,
	displayValue,
	extraClasses,
	extraStyles,
	handleOnChange,
	labelText,
	name,
	type,
}) => {
	const [value, setValue] = useState("");
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div
			className={
				(container ? styles.container + " " : "") +
				"d-flex flex-column" +
				(extraClasses ? " " + extraClasses : "")
			}>
			<label>{labelText}</label>
			{displayInput ? (
				<input
					name={name}
					onChange={onChange}
					step='any'
					type={type}
					value={displayValue}
					style={extraStyles}
				/>
			) : (
				<span>{!!displayValue ? displayValue : "--"}</span>
			)}
		</div>
	);
};
export { Input };
