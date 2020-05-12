import React, { useState } from "react";
import styles from "./textarea.module.scss";

const Textarea = ({ labelText, name, displayValue, displayInput, handleOnChange, cols, rows }) => {
	const [value, setValue] = useState("");
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<>
			<label>{labelText}</label>
			<div>
				<textarea
					className={styles.description}
					name={name}
					cols={cols}
					rows={rows}
					value={value}
					disabled={!displayInput}
					defaultValue={displayValue}
					onChange={onChange}></textarea>
			</div>
		</>
	);
};

export { Textarea };
