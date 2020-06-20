import React from "react";
import { I18n } from "../../services/I18n/I18n";
import styles from "./languagePicker.module.scss";

const LanguagePicker = (props) => {
	const i18n = new I18n();

	const setLanguage = (e) => {
		props.setLanguage(e.target.attributes["data-lang"].value);
	};

	const selectedLanguage = i18n.getSelectedLanguage();

	return (
		<div className={styles.languageButtons}>
			<button data-lang='en' onClick={setLanguage} disabled={selectedLanguage === "en"}>
				english
			</button>
			&nbsp;/&nbsp;
			<button data-lang='nl' onClick={setLanguage} disabled={selectedLanguage === "nl"}>
				nederlands
			</button>
		</div>
	);
};

export { LanguagePicker };
