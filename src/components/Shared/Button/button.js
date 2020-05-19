import React from "react";

/**
 *
 * @param {boolean}		disabled - true: element is disabled, false: element is enabled
 * @param {string}		extraClasses - extra classes to apply to parent element
 * @param {string}		extraStyles - extra styles to apply to parent element
 * @param {function} 	onClick - function prop from parent
 * @param {string}		text - text to display on button
 */

const Button = ({ disabled = false, extraClasses, extraStyles, onClick, text }) => {
	return (
		<button
			className={(extraClasses ? extraClasses + " " : "") + "d-flex btn btn-primary"}
			style={extraStyles}
			onClick={onClick}
			disabled={disabled}>
			{text}
		</button>
	);
};

export { Button };
