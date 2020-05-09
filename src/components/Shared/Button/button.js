import React from "react";

const Button = ({ disabled = false, onClick, text, styles, classes }) => {
	const _classes = `btn ${classes ? " " + classes : ""}`;
	return (
		<button className={_classes} style={styles} onClick={onClick}>
			{text}
		</button>
	);
};

export { Button };
