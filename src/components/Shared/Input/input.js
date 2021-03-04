import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
 * @param {number}		type - type of input 
 * @param {string}		helpText - Text to display when mouseover question mark iconelement
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
	helpText = "",
}) => {
	const onBlur = (event) => {
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div
			className={
				(container ? styles.container + " " : "") +
				styles.inputComponent +
				" d-flex flex-column" +
				(extraClasses ? " " + extraClasses : "")
			}>
			<label>{labelText}</label>
			{displayInput ? (
				<div className="d-flex flex-row">
					<input
						name={name}
						onBlur={onBlur}
						step='any'
						type={type}
						defaultValue={displayValue}
						style={extraStyles}
					/>
					{ helpText.length ? <FontAwesomeIcon icon='question-circle' size='sm' className={"m-1 " + styles['cursor-help']} title={helpText} /> : null}
				</div>
			) : (
				<span>{!!displayValue ? displayValue : "--"}</span>
			)}
		</div>
	);
};
export { Input };
