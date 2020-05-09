import React from "react";
import * as styles from "./select.module.scss";
/**
 *
 * @param {string} labelText - label text
 * @param{string} name - name of select
 * @param{string} existingValue - if not a new item the field value of the existing document
 * @param{array} data - array holding key-value data for all the select options
 * @param{string} displayKey - key holding the data to display in the select option
 * @param{string} valueKey - key holding the value datafor the select option
 */
const Select = ({ labelText, name, existingValue, data, displayKey, valueKey, newButtonText, onNewItem }) => (
	<div className={styles.container}>
		<div>
			<label>{labelText}</label>
			{existingValue ? (
				<div>{existingValue}</div>
			) : data && data.length ? (
				<div>
					<select name={name}>
						{data.map((ob) => (
							<option key={ob[valueKey]} value={ob[valueKey]}>
								{ob[displayKey]}
							</option>
						))}
					</select>
					{newButtonText && (
						<button className='btn btn-primary ml-3' onClick={onNewItem}>
							{newButtonText}
						</button>
					)}
				</div>
			) : (
				""
			)}
		</div>
	</div>
);

export { Select };
