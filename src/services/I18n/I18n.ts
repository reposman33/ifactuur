export class I18n {
	private _availableLanguages: string[];
	private _defaultLanguage: string;
	private _language: string;

	private constructor() {
		this._availableLanguages = ["en", "nl"];
		this._defaultLanguage = this._availableLanguages.includes(navigator.language) ? navigator.language : "nl";
		this._language = this._defaultLanguage;
	}

	private _LANGUAGES: object = {
		NAVIGATION: {
			MENU_TITLE_INVOICES: { en: "Invoices", nl: "Facturen" },
			MENU_TITLE_BILLS: { en: "Bills", nl: "Notas" },
			MENU_TITLE_COMPANIES: { en: "Companies", nl: "Bedrijven" },
			MENU_TITLE_SETTINGS: { en: "Settings", nl: "Instellingen" },
			MENU_TITLE_STATS: { en: "Stats", nl: "Berekeningen" },
		},
		ADMIN: {
			TITLE: { en: "Settings", nl: "Instellingen" },
			ADDRESS: {
				TITLE: { en: "Address", nl: "Adres" },
				NAME_INITIALS: { en: "Initials", nl: "Initialen" },
				NAME_INFIX: {
					en: "Infix",
					nl: "Tussenvoegsel",
				},
				NAME_LASTNAME: { en: "Surname", nl: "Achternaam" },
				ADDRESS: { en: "Address", nl: "Adres" },
				ZIPCODE: { en: "Postalcode", nl: "Postcode" },
				CITY: { en: "City", nl: "Stad" },
				COUNTRY: { en: "Country", nl: "Land" },
			},
			REGISTRATIONS: {
				TITLE: { en: "Registrations", nl: "Registraties" },
				COC_NUMBER: { en: "CoC nr", nl: "KvK nr" },
				VAT_NUMBER: { en: "VAT nr", nl: "BTW nr" },
			},
			DELIVERYCONDITIONS: {
				TITLE: {
					en: "Deliveryconditions",
					nl: "Leveringsvoorwaarden",
				},
			},
		},
		INVOICES: {
			TITLE: { en: "Invoices", nl: "Facturen" },
			TABLE: {
				HEADER_DATE: { en: "Date", nl: "Datum" },
				HEADER_CLIENT: { en: "Client", nl: "Klant" },
				HEADER_SUM: { en: "Sum", nl: "Bedrag" },
				HEADER_STATUS: { en: "Status", nl: "Status" },
				HEADER_TYPE: { en: "Type", nl: "Type" },
			},
			BUTTONS: {
				NEW_INVOICE: { en: "New", nl: "Nieuw" },
				CLEAR: { en: "Clear", nl: "Formulier leegmaken" },
			},
		},
		INVOICE: {
			TITLE: { en: "Invoice", nl: "Factuur" },
			INPUT_INVOICE_DATE: { en: "Invoice date", nl: "Factuur datum" },
			INPUT_COMPANY: { en: "Company", nl: "Bedrijf" },
			INPUT_PERIOD: { en: "Invoice period", nl: "factuur periode" },
			INPUT_PERIOD_FROM: { en: "From", nl: "Van" },
			INPUT_PERIOD_TO: { en: "To", nl: "Tot" },
			INPUT_SERVICES: { en: "Services delivered", nl: "Geleverde diensten" },
			INPUT_RATE: { en: "Hourly rate", nl: "Uurtarief" },
			INPUT_HOURS: { en: "Hours", nl: "Uren" },
			INPUT_TAX: { en: "VAT", nl: "BTW" },
			TOTAL: { en: "Total", nl: "Totaal" },
			BUTTONS: {
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				DELETE: { en: "Delete", nl: "Verwijder" },
				SAVE: { en: "Save", nl: "Bewaar" },
			},
		},
		BUTTONS: { SAVE: { en: "Save", nl: "Bewaar" } },
		PAGINATION: {
			NEXT_PAGE: { en: "next page", nl: "volgende pagina" },
			PREVIOUS_PAGE: { en: "previous page", nl: "vorige pagina" },
			FIRST_PAGE: { en: "first page", nl: "eerste pagina" },
			LAST_PAGE: { en: "last page", nl: "laatste pagina" },
			TOTAL: {
				en: "Showing page {from} to {to} of {size}",
				nl: "Toon pagina {from} tot {to} van {size}",
			},
		},
	};

	getLocale = () => (navigator.language.search("en") > -1 ? "en" : navigator.language.search("nl") > -1 ? "nl" : "");

	setLanguage = (lang?: string) => (this._language = lang || this._defaultLanguage);

	getSelectedLanguage = () => this._language;

	get = (key: string) => {
		const langOb = key.split(".").reduce((ob: { [index: string]: any }, key) => ob[key] || "--", this._LANGUAGES);
		return langOb[this._language] || "--";
	};
}
