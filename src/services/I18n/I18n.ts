export default class I18n {
	private static _availableLanguages = ["en", "nl"];
	private static _defaultLanguage = I18n._availableLanguages.includes(navigator.language) ? navigator.language : "nl";
	private static _language = I18n._defaultLanguage;
	private static _LANGUAGES: object = {
		ADMIN: {
			TITLE: { en: "Settings", nl: "Instellingen" },
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
			TITLE: { en: "Invoices", nl: "Facturen" },
			TABLE: {
				HEADER_DATE: { en: "Date", nl: "Datum" },
				HEADER_CLIENT: { en: "Client", nl: "Klant" },
				HEADER_SUM: { en: "Sum", nl: "Bedrag" },
				HEADER_STATUS: { en: "Status", nl: "Status" }
			},
			BUTTONS: {
				NEW_INVOICE: { en: "New", nl: "Nieuw" },
				CLEAR: { en: "Clear", nl: "Formulier leegmaken" }
			}
		},
		INVOICE: {
			TITLE: { en: "Invoice", nl: "Factuur" },
			INPUT_INVOICE_DATE: { en: "Invoice date", nl: "Factuur datum" },
			INPUT_COMPANY: { en: "Company", nl: "Bedrijf" },
			INPUT_PERIOD: { en: "Invoice period", nl: "factuur periode" },
			INPUT_PERIOD_FROM: { en: "From", nl: "Van" },
			INPUT_PERIOD_TO: { en: "To", nl: "Tot" },
			INPUT_SERVICES: { en: "Services delivered", nl: "Geleverde diensten" },
			INPUT_RATE: { en: "Rate/hour", nl: "Tarief / uur" },
			INPUT_HOURS: { en: "Hours", nl: "Uren" },
			INPUT_TAX: { en: "VAT", nl: "BTW" },
			BUTTONS: {
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				DELETE: { en: "Delete", nl: "Verwijder" },
				SAVE: { en: "Save", nl: "Bewaar" }
			}
		},
		BUTTONS: { SAVE: { en: "Save", nl: "Bewaar" } }
	};

	public static setLanguage = (lang?: string) => (I18n._language = lang || I18n._defaultLanguage);

	public static getSelectedLanguage = () => I18n._language;

	public static get = (key: string) => {
		const langOb = key.split(".").reduce((ob: { [index: string]: any }, key) => ob[key] || "--", I18n._LANGUAGES);
		return langOb[I18n.getSelectedLanguage()] || "--";
	};
}
