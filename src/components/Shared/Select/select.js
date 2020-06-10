import React from "react";
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
}) => {
	const onChange = (event) => {
		handleOnChange(event.target.name, event.target.value);
	};
	const selectStyle = buttonText ? { width: "50%" } : { margin: 0 };

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
							value={displayValue}
							style={Object.assign(selectStyle, extraStyles)}>
							<option key={""} value={null}>
								---
							</option>
							{data.map((ob, i) => (
								<option key={i} value={ob[displayKey]}>
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
