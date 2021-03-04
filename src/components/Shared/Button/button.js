import React from "react";
import * as styles from "./button.module.scss";

/**
 *
 * @param {boolean}		disabled - true: element is disabled, false: element is enabled
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {string}		extraStyles - extra styles to apply to parent element
 * @param {function} 	onClick - function prop from parent
 * @param {string}		text - text to display on button
 * @param {string}		title - title to display on button
 */

const Button = ({ disabled = false, extraClasses, extraStyles, onClick, text, title = "" }) => {
	return (
		<button
			className={(extraClasses ? extraClasses + " " : "") + "d-flex btn btn-primary justify-content-center " + styles.button}
			style={extraStyles}
			onClick={onClick}
			disabled={disabled}
			title={title}>
			{text}
		</button>
	);
};

export { Button };
