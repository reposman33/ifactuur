export class I18n {
	constructor() {
		if (!I18n.instance) {
			I18n.instance = this;
		}
		return I18n.instance;
	}

	_availableLanguages = ["en", "nl"];
	_defaultLanguage = this._availableLanguages.includes(navigator.language) ? navigator.language : "nl";
	_language = this._defaultLanguage;
	_LANGUAGES = {
		NAVIGATION: {
			MENU_TITLE_INVOICES: { en: "Invoices", nl: "Facturen" },
			MENU_TITLE_EXPENSES: { en: "Expenses", nl: "Uitgaven" },
			MENU_TITLE_COMPANIES: { en: "Companies", nl: "Bedrijven" },
			MENU_TITLE_SETTINGS: { en: "Settings", nl: "Instellingen" },
			MENU_TITLE_STATS: { en: "Stats", nl: "Berekeningen" },
		},

		COMPANIES: {
			TABLE: {
				HEADERS: {
					NAME: { en: "Name", nl: "Naam" },
					CONTACT: { en: "Contact", nl: "Contactpersoon" },
					CITY: { en: "City", nl: "Stad" },
					ACTIONS: { en: "Actions", nl: "Bewerken" },
				},
			},
			BUTTON: {
				NEW: { en: "New company", nl: "Nieuw bedrijf" },
			},
		},
		COMPANY: {
			LABEL: {
				NAME: { en: "Company name", nl: "Bedrijfsnaam" },
				ADDRESS: { en: "Address", nl: "Adres" },
				ZIPCODE: { en: "Zipcode", nl: "Postcode" },
				CITY: { en: "City", nl: "Stad" },
				CONTACT: { en: "Contact", nl: "Contact persoon" },
				CONTACT_TITLE: { en: "Title", nl: "Titel" },
				CONTACT_TELEPHONE: { en: "Contact telephone", nl: "Contact telephone" },
				COUNTRY: { en: "Country", nl: "Land" },
				EMAIL: { en: "Email", nl: "E-Mail" },
				FAX: { en: "Fax number", nl: "Fax nummer" },
				BTWNR: { en: "VAT number", nl: "BTW nummer" },
				KVKNR: { en: "COC registration number", nl: "KvK nummer" },
				SALESTAXNR: { en: "Sales tax number", nl: "Omzetbelasting nummer" },
				NOTES: { en: "Notes", nl: "Opmerkingen" },
				URL: { en: "Website URL", nl: "Website URL" },
				BANK: { en: "Bank", nl: "Bank" },
				BANKACCOUNTNR: { en: "IBAN", nl: "IBAN" },
				BANKACCOUNTNAMEHOLDER: { en: "IBAN name", nl: "IBAN tenaam stelling" },
			},
			PROMPT: {
				DELETE: {
					en: "Are you sure you want to delete this company from iFactuur?",
					nl: "Weet u zeker dat u dit bedrijf wil verwijderen uit iFactuur?",
				},
			},
			BUTTON: {
				SAVEANDBACKTOLISTVIEW: { en: "Save and show overview", nl: "Bewaar en toon overzicht" },
				SAVEANDBACKTOPREVIOUSLOCATION: { en: "Save and show {1}", nl: "Bewaar en toon {1}" },
				UPDATE: { en: "Update", nl: "Bijwerken" },
				NEW: { en: "New", nl: "Nieuw" },
				BACKTOLISTVIEW: { en: "Back to overview", nl: "Terug naar overzicht" },
				BACKTOPREVIOUSLOCATION: { en: "Back to {1}", nl: "Terug naar {1}" },
			},
		},
		EXPENSES: {
			TABLE: {
				HEADERS: {
					DATE: { en: "Date", nl: "Datum" },
					COMPANY: { en: "Company", nl: "Bedrijf" },
					AMOUNT: { en: "Amount", nl: "Bedrag" },
					ACTIONS: { en: "Actions", nl: "Bewerken" },
				},
			},
			BUTTON: { NEW: { en: "New expense", nl: "Nieuwe uitgave" } },
		},
		EXPENSE: {
			LABEL: {
				DATE: { en: "Date", nl: "Datum" },
				COMPANY: { en: "Company", nl: "Bedrijf" },
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				AMOUNT: { en: "Amount", nl: "Bedrag" },
				ITEM: { en: "Items/Services", nl: "Goederen/Diensten" },
				TAX: { en: "Tax", nl: "BTW" },
			},
			BUTTON: {
				BACK: { en: "Back to overview", nl: "Terug naar overzicht" },
				SAVE: { en: "Save and show overview", nl: "Bewaar en naar overzicht" },
			},
			SUBMIT: {
				ERROR: {
					MISSINGFIELDVALUES: {
						en: "The expense is not filled in completely. Please fill in missing values",
						nl: "De nota is niet volledig ingevuld. Vul a.u.b. de ontbrekende gegevens in.",
					},
				},
			},
		},

		INVOICES: {
			TABLE: {
				HEADERS: {
					ACTIONS: { en: "Actions", nl: "Bewerken" },
					CLIENT: { en: "Client", nl: "Klant" },
					DATE: { en: "Date", nl: "Datum" },
					STATUS: { en: "Status", nl: "Status" },
					TYPE: { en: "Type", nl: "Soort" },
				},
			},
			BUTTON: { NEW: { en: "New invoice", nl: "Nieuwe factuur" } },
		},
		INVOICE: {
			TITLE: { en: "Invoice", nl: "Factuur" },
			LABEL: {
				INVOICE_DATE: { en: "Invoice date", nl: "Factuur datum" },
				COMPANY: { en: "Company", nl: "Bedrijf" },
				VATRATE: { en: "VAT", nl: "BTW" },
				TOTAL: { en: "Total", nl: "Totaal" },
				SUBTOTAL: { en: "Subtotal", nl: "Subtotaal" },
				INVOICETYPE: { en: "Invoice type", nl: "Factuur type" },
			},
			COLUMNHEADER: {
				SERVICES: { en: "Services delivered", nl: "Geleverde diensten" },
				RATE: { en: "Hourly rate", nl: "Uurtarief" },
				HOURS: { en: "Hours", nl: "Uren" },
				TOTAL: { en: "Total", nl: "Totaal" },
			},
			INPUT: {
				VATRATE: { en: "Select...", nl: "Selecteer..." },
				COMPANY: { en: "Select a company", nl: "Selecteer bedrijf" },
			},
			BUTTON: {
				BACK: { en: "Back to overview", nl: "Terug naar overzicht" },
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				DELETE: { en: "Delete", nl: "Verwijder" },
				SAVE: { en: "Save and show overview", nl: "Bewaar en naar overzicht" },
			},
			SUBMIT: {
				ERROR: {
					MISSINGFIELDVALUES: {
						en: "The invoice is not filled in completely. Please fill in missing values",
						nl: "De factuur is niet volledig ingevuld. Vul a.u.b. de ontbrekende gegevens in.",
					},
				},
			},
		},
		INVOICEPRINT: {
			FOOTER: {
				PAYMENTTERMS: {
					en:
						"You are kindly requested to transmit the amount due within {1} days to bankaccount number {2} from {3} at {4} ",
					nl:
						"U wordt verzocht het bedrag binnen {1} dagen over te maken op rekeningnummer {2} van {3} te {4} ",
				},
			},
			LABELS: {
				DATE: { en: "Date", nl: "Datum" },
				INVOICENR: { en: "Invoice nr", nl: "Factuurnr" },
				ATT: { en: "C.o.", nl: "T.a.v." },
			},
			STATUSMESSAGE: { en: "This invoice is cancelled", nl: "Deze factuur is vervallen" },
			TITLE: { en: "Invoice", nl: "Factuur" },
			TABLE_HEADER: {
				SERVICES: { en: "Services", nl: "Geleverde diensten" },
				HOURS: { en: "Hours", nl: "Uren" },
				RATE: { en: "Rate", nl: "Tarief" },
				AMOUNT: { en: "Amount", nl: "Bedrag" },
				SUBTOTAL: { en: "Subtotal", nl: "Subtotaal" },
				VAT_RATE: { en: "Vatrate", nl: "BTW-tarief" },
				TOTAL: { en: "Total", nl: "Totaal" },
			},
		},
		PAGINATION: {
			NEXT_PAGE: { en: "next page", nl: "volgende pagina" },
			PREVIOUS_PAGE: { en: "previous page", nl: "vorige pagina" },
			FIRST_PAGE: { en: "first page", nl: "eerste pagina" },
			LAST_PAGE: { en: "last page", nl: "laatste pagina" },
			TOTAL: {
				en: "Showing row {from} to {to} of {size}",
				nl: "Toon rij {from} tot {to} van {size}",
			},
		},
		STATS: {
			LABELS: {
				DATE: {
					FROM: { en: "Date from", nl: "vanaf" },
					TO: { en: "Date to", nl: "tot" },
				},
				TURNOVER: { en: "Calculate sales", nl: "Bereken omzet" },
				VAT: { en: "Calculate value added tax", nl: "Bereken BTW" },
				TOTALTURNOVER: { en: "Total turnover", nl: "Totale omzet" },
				TOTALEXPENSESVAT: { en: "Total VAT payed", nl: "Totale BTW betaald" },
			},
			TABLE: {
				HEADERS: {
					AMOUNT: { en: "Amount", nl: "Bedrag" },
					COMPANY: { en: "Charged to", nl: "Gefactureerd aan" },
					DATETIMECREATED: { en: "Date", nl: "Datum" },
					INVOICENR: { en: "Invoice", nl: "factuur" },
					ID: { en: "#", nl: "#" },
					TOTALVATAMOUNT: { en: "Vat", nl: "BTW" },
				},
			},
			BUTTON: {
				SHOWTURNOVER: { en: "Show sales", nl: "Toon omzet" },
				TURNOVER: { en: "Sales in period", nl: "Omzet over periode" },
				SHOWTURNOVERFORQUARTER: { en: "Turnover in quarter", nl: "Omzet in kwartaal" },
				YEAR: { en: "Year", nl: "Jaar" },
			},
		},
		TITLES: { MR: { en: "Mr", nl: "Dhr" }, MRS: { en: "Ms", nl: "Mw" }, THEY: { en: "They", nl: "Zij" } },
		USERSETTINGS: {
			LABEL: {
				TITLE: { en: "Title", nl: "Titel" },
				FIRSTNAME: { en: "FirstName", nl: "Voornaam" },
				LASTNAME: { en: "Lastname", nl: "Achternaam" },
				ADDRESS: { en: "Address", nl: "Adres" },
				ZIPCODE: { en: "Zipcode", nl: "Postcode" },
				CITY: { en: "City", nl: "Stad" },
				COUNTRY: { en: "Country", nl: "Land" },
				DELIVERYCONDITIONS: { en: "Deliveryconditions", nl: "Leveringsvoorwaarden" },
				COMPANY: { en: "Company", nl: "Bedrijf" },
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
			BUTTON: {
				SAVE: { en: "Save", nl: "Bewaar" },
				UPDATE: { en: "Update", nl: "Bijwerken" },
			},
		},
		LOCATION: {
			EXPENSE: { en: "expense", nl: "uitgave" },
			INVOICE: { en: "invoice", nl: "factuur" },
		},
	};

	getLocale = () => (navigator.language.search("en") > -1 ? "en" : navigator.language.search("nl") > -1 ? "nl" : "");

	setLanguage = (lang) => (this._language = lang || this._defaultLanguage);

	getSelectedLanguage = () => this._language;

	get = (key) => {
		const langOb = key.split(".").reduce((ob, key) => ob[key] || {}, this._LANGUAGES);
		return langOb[this._language] || "--";
	};
}
