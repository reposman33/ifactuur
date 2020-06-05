import React from "react";
import styles from "./textarea.module.scss";

/**
 *
 * @param {number}		cols - number of columns of textrea element
 * @param {array}		data - array holding key-value data for all the select options
 * @param {boolean}		displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}		displayValue - text to display instead of allowing userInput
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {function} 	handleOnChange - update parent state with user input
 * @param {string}		labelText - text to display as label
 * @param {string}		name - input type name
 * @param {number}		rows - number of rows of textrea element
 */

const Textarea = ({ cols, displayInput, displayValue, extraClasses, handleOnChange, labelText, name, rows }) => {
	const onChange = (event) => {
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.textareaComponent + " d-flex flex-column" + (extraClasses ? " " + extraClasses : "")}>
			<label>{labelText}</label>
			<textarea
				className={styles.description}
				name={name}
				cols={cols}
				rows={rows}
				disabled={!displayInput}
				defaultValue={displayValue}
				onChange={onChange}></textarea>
		</div>
	);
};

export { Textarea };
