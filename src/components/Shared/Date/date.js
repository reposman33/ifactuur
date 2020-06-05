import React, { useState } from "react";
import * as styles from "./date.module.scss";

/**
 *
 * @param {boolean}	container - true - display or don't display container class on top level element
 * @param {boolean}	displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}	displayValue - text to display instead of allowing userInput
 * @param {string}	extraClasses - extra classes to apply to parent element
 * @param {function} handleOnChange - update parent state with user input
 * @param {string}	extraClasses - extra xlsses to apply to parent element
 * @param {string}	labelText - text to display as label
 * @param {string}	name - input type name
 */
const DateComponent = ({
	container = true,
	displayInput,
	displayValue,
	extraClasses,
	handleOnChange,
	labelText,
	name,
}) => {
	const [value, setValue] = useState("");

	const onLocalChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div
			className={
				(container ? styles.container + " " : "") +
				styles.dateComponent +
				" d-flex flex-column" +
				(extraClasses ? " " + extraClasses : "")
			}>
			<label>{labelText}</label>
			{displayInput ? (
				<span className='d-flex flex-row justify-content-between'>
					<input type='date' name={name} value={value} onChange={onLocalChange} />{" "}
				</span>
			) : (
				<span className='d-flex flex-row justify-content-between'>{displayValue} </span>
			)}
		</div>
	);
};

export { DateComponent };
