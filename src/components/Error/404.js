import * as componentStyles from "./_404.module.scss";
import React from "react";

const _404 = () => {
	const back = (e) => {
		e.preventDefault();
		window.history.back();
	};

	return (
		<div>
			<h1 className={componentStyles.h1}>Oops! deze pagina bestaat niet...</h1>
			<span className={componentStyles.link}>
				Ga
				<span className={componentStyles.clickable} onClick={back}>
					terug
				</span>
				waar je vandaan kwam.
			</span>
		</div>
	);
};

export default _404;
