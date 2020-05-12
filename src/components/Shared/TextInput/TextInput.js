import React, { useState } from "react";
import styles from "./textInput.module.scss";

const TextInput = ({ displayInput, displayValue, labelText, type, name, handleOnChange }) => {
	const [value, setValue] = useState("");
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container}>
			<label>{labelText}</label>
			{displayInput ? (
				<input
					type={type}
					name={name}
					placeholder={type === "number" && 423.55}
					onChange={onChange}
					value={value}
				/>
			) : (
				<span>{displayValue}</span>
			)}
		</div>
	);
};
export { TextInput };
