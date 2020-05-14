import React, { useState } from "react";
import styles from "./textInput.module.scss";

const TextInput = ({ displayInput, displayValue, labelText, type, name, handleOnChange }) => {
	const [value, setValue] = useState("");
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container + " d-flex flex-column"}>
			<label>{labelText}</label>
			{displayInput ? (
				<input
					name={name}
					onChange={onChange}
					placeholder={type === "number" && 423.55}
					step='any'
					type={type}
					value={value}
				/>
			) : (
				<span>{displayValue}</span>
			)}
		</div>
	);
};
export { TextInput };
