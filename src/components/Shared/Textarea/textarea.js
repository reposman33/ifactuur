import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./textarea.module.scss";

/**
 *
 * @param {number}		cols - number of columns of textrea element
 * @param {boolean}		displayInput - true: display user input DOM element; false: display existing value instead
 * @param {string}		displayValue - text to display instead of allowing userInput
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {function} 	handleOnChange - update parent state with user input
 * @param {string}		labelText - text to display as label
 * @param {string}		name - input type name
 * @param {number}		rows - number of rows of textrea element
 * @param {string}		helpText - Text to display when mouseover question mark icon
 */

const Textarea = ({ cols, displayInput, displayValue, extraClasses, handleOnChange, labelText, name, rows, helpText="" }) => {
	const onBlur = (event) => {
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.textareaComponent + " d-flex flex-column" + (extraClasses ? " " + extraClasses : "")}>
			<label>{labelText}</label>
			<div className="d-flex flex-row">
				<div className="d-flex flex-row">
					<textarea
						className={styles.description}
						name={name}
						cols={cols}
						rows={rows}
						disabled={!displayInput}
						defaultValue={displayValue}
						onBlur={onBlur}>
					</textarea>
					{helpText.length ? <FontAwesomeIcon icon='question-circle' size='sm' className={"m-1 " + styles['cursor-help']} title={helpText} /> : null}
				</div>
			</div>
		</div>
	);
};

export { Textarea };
