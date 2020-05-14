import React, { useState } from "react";
import styles from "./textInput.module.scss";

const TextInput = ({
	extraClasses,
	extraStyles,
	displayInput,
	displayValue,
	labelText,
	type,
	name,
	handleOnChange,
}) => {
	const [value, setValue] = useState("");
	const _extraClasses = extraClasses ? " " + extraClasses : "";
	const onChange = (event) => {
		setValue(event.target.value);
		handleOnChange(event.target.name, event.target.value);
	};

	return (
		<div className={styles.container + " d-flex flex-column" + _extraClasses}>
			<label>{labelText}</label>
			{displayInput ? (
				<input
					name={name}
					onChange={onChange}
					placeholder={type === "number" ? 423.55 : name}
					step='any'
					type={type}
					value={value}
					style={extraStyles}
				/>
			) : (
				<span>{displayValue}</span>
			)}
		</div>
	);
};
export { TextInput };
