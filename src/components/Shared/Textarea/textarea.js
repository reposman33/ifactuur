import React, { useState } from "react";
import styles from "./textarea.module.scss";

const Textarea = ({ labelText, name, displayValue, displayInput, handleOnChange, cols, rows, extraClasses }) => {
	const [value, setValue] = useState(displayValue);
	const _extraClasses = extraClasses ? " " + extraClasses : "";
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container + " d-flex flex-column mx-3 mb-3" + _extraClasses}>
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
