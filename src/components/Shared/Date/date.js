import React from "react";
import * as styles from "./date.module.scss";

const DateComponent = ({ labelText, name, existingValue }) => (
	<div className={styles.container}>
		<label>{labelText}</label>
		{existingValue ? <div>{existingValue}</div> : <input type='date' name={name} />}
	</div>
);

export { DateComponent };
