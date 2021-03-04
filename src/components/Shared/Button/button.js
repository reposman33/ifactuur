import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./button.module.scss";

/**
 *
 * @param {boolean}		disabled - true: element is disabled, false: element is enabled
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {string}		extraStyles - extra styles to apply to parent element
 * @param {function} 	onClick - function prop from parent
 * @param {string}		text - text to display on button
 * @param {string}		title - title to display on button
 * @param {string}		helpText - Text to display when mouseover question mark icon
 * 
 */

const Button = ({ disabled = false, extraClasses, extraStyles, onClick, text, title = "", helpText = "" }) => {
	return (
		<>
		<button
			className={(extraClasses ? extraClasses + " " : "") + "d-flex btn btn-primary justify-content-center " + styles.button}
			style={extraStyles}
			onClick={onClick}
			disabled={disabled}
			title={title}>
			{text}
		</button>
		{ helpText.length ? <FontAwesomeIcon icon='question-circle' size='sm' className={"m-1 " + styles['cursor-help']} title={helpText} /> : null }
</>
	);
};

export { Button };
