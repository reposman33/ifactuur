import React, { useState } from "react";
import styles from "./TextInput.module.scss";

const TextInput = ({ existingValue, labelText }) => {
	const [value, setValue] = useState("");
	const onChange = (ev) => setValue(ev.target.value);

	return (
		<div className={styles.container}>
			<label>{labelText}</label>
			{existingValue ? <span>{existingValue}</span> : <input type='text' onChange={onChange} value={value} />}
		</div>
	);
};
export { TextInput };
