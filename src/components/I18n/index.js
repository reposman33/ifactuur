export default class Languages {
	constructor() {
		this.init();
	}

	init() {
		this.setLanguage("nl");
		this.LANGUAGES = {
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
	}

	setLanguage(lang) {
		this.language = lang || navigator.language;
	}

	get(key) {
		const langOb = key.split(".").reduce((ob, key) => ob[key] || "--", this.LANGUAGES);
		return langOb[this.language] || "--";
	}
}
