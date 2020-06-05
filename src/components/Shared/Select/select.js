import React, { useState } from "react";
import styles from "./select.module.scss";
/**
 *
 * @param {string}		buttonText - key holding the value data for the select option
 * @param {boolean}		container - true - display or don't display container class on top level element
 * @param {array}		data - array holding key-value data for all the select options
 * @param {string}		displayKey - key holding the data to display in the select option
 * @param {boolean}		displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}		displayValue - text to display instead of allowing userInput
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {function} 	handleOnChange - update parent state with user input
 * @param {number} 		initialSelectedValue - The initially selected select value
 * @param {string}		labelText - text to display as label
 * @param {string}		name - input type name
 * @param {function} 	onButtonClick - execute when user clicks the button
 * @param {string}		valueKey - key holding the value datafor the select option
 */
const Select = ({
	buttonText,
	container = true,
	data,
	displayInput,
	displayKey,
	displayValue,
	extraClasses,
	handleOnChange,
	labelText,
	name,
	onButtonClick,
	initialSelectedValue = 0,
	valueKey,
}) => {
	const [value, setValue] = useState(initialSelectedValue);

	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};
	return (
		<div
			className={
				(container ? styles.container + " " : "") +
				styles.selectComponent +
				" d-flex flex-column" +
				(extraClasses ? " " + extraClasses : "")
			}>
			<label>{labelText}</label>
			<span className='d-flex flex-row w-100'>
				{displayInput ? (
					<>
						<select
							name={name}
							onChange={onChange}
							value={value}
							// if there's a button make select 50%
							style={{ width: buttonText ? "50%" : "100%" }}>
							{data.map((ob) => (
								<option key={ob[valueKey]} value={ob[displayKey]}>
									{ob[displayKey]}
								</option>
							))}
						</select>
						{buttonText && (
							<button className='btn btn-primary w-75 ml-3 p-0' onClick={onButtonClick}>
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
