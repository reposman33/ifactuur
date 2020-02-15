export default class Languages {
	constructor(props) {
		this.availableLanguages = ["en", "nl"];
		// bind non-React functions to this scope
		this.setLanguage = this.setLanguage.bind(this);
		this.getSelectedLanguage = this.getSelectedLanguage.bind(this);
		this.get = this.get.bind(this);
		// determine language by looking at Browser UI language, if not supported fall back to 'nl'
		this.defaultLanguage = this.availableLanguages.includes(navigator.language) ? navigator.language : "nl";
		this.setLanguage();
	}

	LANGUAGES = {
		ADMIN: {
			ADDRESS: {
				TITLE: { en: "Address", nl: "Adres" },
				NAME_INITIALS: { en: "Initials", nl: "Initialen" },
				NAME_PREFIX: { en: "Prefixes", nl: "tussenvoegsel" },
				NAME_LASTNAME: { en: "Surname", nl: "Achternaam" },
				ADDRESS: { en: "Address", nl: "Adres" },
				ZIPCODE: { en: "Postalcode", nl: "Postcode" },
				CITY: { en: "City", nl: "Stad" },
				COUNTRY: { en: "Country", nl: "Land" }
			},
			REGISTRATIONS: {
				TITLE: { en: "Registrations", nl: "Registraties" },
				COC_NUMBER: { en: "CoC nr", nl: "KvK nr" },
				VAT_NUMBER: { en: "VAT nr", nl: "BTW nr" }
			},
			DELIVERYCONDITIONS: { TITLE: { en: "Deliveryconditions", nl: "Leveringsvoorwaarden" } }
		}
	};

	setLanguage(lang) {
		this.language = lang || this.defaultLanguage;
	}

	getSelectedLanguage() {
		return this.language;
	}

	get(key) {
		const langOb = key.split(".").reduce((ob, key) => ob[key] || "--", this.LANGUAGES);
		return langOb[this.getSelectedLanguage()] || "--";
	}
}
