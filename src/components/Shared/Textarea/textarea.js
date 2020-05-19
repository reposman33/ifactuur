import React, { useState } from "react";
import styles from "./textarea.module.scss";

const Textarea = ({ cols, displayInput, displayValue, extraClasses, handleOnChange, labelText, name, rows }) => {
	const _extraClasses = extraClasses ? " " + extraClasses : "";
	const onChange = (event) => {
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={"d-flex flex-column mx-3 mb-3" + _extraClasses}>
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
