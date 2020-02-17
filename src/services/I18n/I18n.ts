export default class Languages {
	private static _availableLanguages = ["en", "nl"];
	private static _defaultLanguage = Languages._availableLanguages.includes(navigator.language)
		? navigator.language
		: "nl";
	private static _language = Languages._defaultLanguage;
	private static _LANGUAGES: object = {
		ADMIN: {
			ADDRESS: {
				TITLE: { en: "Address", nl: "Adres" },
				NAME_INITIALS: { en: "Initials", nl: "Initialen" },
				NAME_INFIX: {
					en: "Infix",
					nl: "Tussenvoegsel"
				},
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
			DELIVERYCONDITIONS: {
				TITLE: {
					en: "Deliveryconditions",
					nl: "Leveringsvoorwaarden"
				}
			}
		},
		INVOICES: {
			TABLE: {
				HEADER_DATE: { en: "Date", nl: "Datum" },
				HEADER_CLIENT: { en: "Client", nl: "Klant" },
				HEADER_SUM: { en: "Sum", nl: "Bedrag" },
				HEADER_STATUS: { en: "Status", nl: "Status" }
			},
			BUTTONS: { NEW_INVOICE: { en: "New", nl: "Nieuw" }, CLEAR: { en: "Clear", nl: "Formulier leegmaken" } }
		},
		BUTTONS: { SAVE: { en: "Save", nl: "Bewaar" } }
	};

	public static setLanguage = (lang?: string) => (Languages._language = lang || Languages._defaultLanguage);

	public static getSelectedLanguage = () => Languages._language;

	public static get = (key: string) => {
		const langOb = key
			.split(".")
			.reduce((ob: { [index: string]: any }, key) => ob[key] || "--", Languages._LANGUAGES);
		return langOb[Languages.getSelectedLanguage()] || "--";
	};
}
