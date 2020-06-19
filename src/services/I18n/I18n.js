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
		COMPANIES: {
			BUTTON: {
				NEW: { en: "New company", nl: "Nieuw bedrijf" },
			},
			TABLE: {
				HEADERS: {
					ACTIONS: { en: "Actions", nl: "Bewerken" },
					CITY: { en: "City", nl: "Stad" },
					CONTACT: { en: "Contact", nl: "Contactpersoon" },
					NAME: { en: "Name", nl: "Naam" },
				},
			},
		},
		COMPANY: {
			BUTTON: {
				BACKTOLISTVIEW: { en: "Back to overview", nl: "Terug naar overzicht" },
				BACKTOPREVIOUSLOCATION: { en: "Back to {1}", nl: "Terug naar {1}" },
				NEW: { en: "New", nl: "Nieuw" },
				SAVEANDBACKTOLISTVIEW: { en: "Save and show overview", nl: "Bewaar en toon overzicht" },
				SAVEANDBACKTOPREVIOUSLOCATION: { en: "Save and show {1}", nl: "Bewaar en toon {1}" },
				UPDATE: { en: "Update", nl: "Bijwerken" },
			},
			LABEL: {
				ADDRESS: { en: "Address", nl: "Adres" },
				BANK: { en: "Bank", nl: "Bank" },
				BANKACCOUNTNR: { en: "IBAN", nl: "IBAN" },
				BANKACCOUNTNAMEHOLDER: { en: "IBAN name", nl: "IBAN tenaam stelling" },
				BTWNR: { en: "VAT number", nl: "BTW nummer" },
				CITY: { en: "City", nl: "Stad" },
				CONTACT: { en: "Contact", nl: "Contact persoon" },
				CONTACT_TELEPHONE: { en: "Contact telephone", nl: "Contact telephone" },
				CONTACT_TITLE: { en: "Title", nl: "Titel" },
				COUNTRY: { en: "Country", nl: "Land" },
				EMAIL: { en: "Email", nl: "E-Mail" },
				FAX: { en: "Fax number", nl: "Fax nummer" },
				KVKNR: { en: "COC registration number", nl: "KvK nummer" },
				NAME: { en: "Company name", nl: "Bedrijfsnaam" },
				NOTES: { en: "Notes", nl: "Opmerkingen" },
				SALESTAXNR: { en: "Sales tax number", nl: "Omzetbelasting nummer" },
				URL: { en: "Website URL", nl: "Website URL" },
				ZIPCODE: { en: "Zipcode", nl: "Postcode" },
			},
			PROMPT: {
				DELETE: {
					en: "Are you sure you want to delete this company from iFactuur?",
					nl: "Weet u zeker dat u dit bedrijf wil verwijderen uit iFactuur?",
				},
			},
		},
		EXPENSE: {
			BUTTON: {
				BACK: { en: "Back to overview", nl: "Terug naar overzicht" },
				SAVE: { en: "Save and show overview", nl: "Bewaar en naar overzicht" },
			},
			LABEL: {
				AMOUNT: { en: "Amount", nl: "Bedrag" },
				COMPANY: { en: "Company", nl: "Bedrijf" },
				DATE: { en: "Date", nl: "Datum" },
				ITEM: { en: "Items/Services", nl: "Goederen/Diensten" },
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				TAX: { en: "Tax", nl: "BTW" },
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
		EXPENSES: {
			BUTTON: { NEW: { en: "New expense", nl: "Nieuwe uitgave" } },
			TABLE: {
				HEADERS: {
					ACTIONS: { en: "Actions", nl: "Bewerken" },
					AMOUNT: { en: "Amount", nl: "Bedrag" },
					COMPANY: { en: "Company", nl: "Bedrijf" },
					DATE: { en: "Date", nl: "Datum" },
				},
			},
		},
		INVOICE: {
			BUTTON: {
				BACK: { en: "Back to overview", nl: "Terug naar overzicht" },
				DELETE: { en: "Delete", nl: "Verwijder" },
				NEW_COMPANY: { en: "New company", nl: "Nieuw bedrijf" },
				SAVE: { en: "Save and show overview", nl: "Bewaar en naar overzicht" },
			},
			COLUMNHEADER: {
				HOURS: { en: "Hours", nl: "Uren" },
				RATE: { en: "Hourly rate", nl: "Uurtarief" },
				SERVICES: { en: "Services delivered", nl: "Geleverde diensten" },
				TOTAL: { en: "Total", nl: "Totaal" },
			},
			INPUT: {
				COMPANY: { en: "Select a company", nl: "Selecteer bedrijf" },
				VATRATE: { en: "Select...", nl: "Selecteer..." },
			},
			LABEL: {
				COMPANY: { en: "Company", nl: "Bedrijf" },
				INVOICE_DATE: { en: "Invoice date", nl: "Factuur datum" },
				INVOICETYPE: { en: "Invoice type", nl: "Factuur type" },
				SUBTOTAL: { en: "Subtotal", nl: "Subtotaal" },
				TOTAL: { en: "Total", nl: "Totaal" },
				VATRATE: { en: "VAT", nl: "BTW" },
			},
			SUBMIT: {
				ERROR: {
					MISSINGFIELDVALUES: {
						en: "The invoice is not filled in completely. Please fill in missing values",
						nl: "De factuur is niet volledig ingevuld. Vul a.u.b. de ontbrekende gegevens in.",
					},
				},
			},
			TITLE: { en: "Invoice", nl: "Factuur" },
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
				ATT: { en: "C.o.", nl: "T.a.v." },
				DATE: { en: "Date", nl: "Datum" },
				INVOICENR: { en: "Invoice nr", nl: "Factuurnr" },
			},
			STATUSMESSAGE: { en: "This invoice is cancelled", nl: "Deze factuur is vervallen" },
			TABLE_HEADER: {
				AMOUNT: { en: "Amount", nl: "Bedrag" },
				HOURS: { en: "Hours", nl: "Uren" },
				RATE: { en: "Rate", nl: "Tarief" },
				SERVICES: { en: "Services", nl: "Geleverde diensten" },
				SUBTOTAL: { en: "Subtotal", nl: "Subtotaal" },
				TOTAL: { en: "Total", nl: "Totaal" },
				VAT_RATE: { en: "Vatrate", nl: "BTW-tarief" },
			},
			TITLE: { en: "Invoice", nl: "Factuur" },
		},
		INVOICES: {
			BUTTON: { NEW: { en: "New invoice", nl: "Nieuwe factuur" } },
			TABLE: {
				HEADERS: {
					ACTIONS: { en: "Actions", nl: "Bewerken" },
					CLIENT: { en: "Client", nl: "Klant" },
					DATE: { en: "Date", nl: "Datum" },
					STATUS: { en: "Status", nl: "Status" },
					TYPE: { en: "Type", nl: "Soort" },
				},
			},
		},
		NAVIGATION: {
			MENU_TITLE_COMPANIES: { en: "Companies", nl: "Bedrijven" },
			MENU_TITLE_EXPENSES: { en: "Expenses", nl: "Uitgaven" },
			MENU_TITLE_INVOICES: { en: "Invoices", nl: "Facturen" },
			MENU_TITLE_SETTINGS: { en: "Settings", nl: "Instellingen" },
			MENU_TITLE_STATS: { en: "Stats", nl: "Berekeningen" },
		},
		PAGINATION: {
			FIRST_PAGE: { en: "first page", nl: "eerste pagina" },
			LAST_PAGE: { en: "last page", nl: "laatste pagina" },
			NEXT_PAGE: { en: "next page", nl: "volgende pagina" },
			PREVIOUS_PAGE: { en: "previous page", nl: "vorige pagina" },
			TOTAL: {
				en: "Showing row {from} to {to} of {size}",
				nl: "Toon rij {from} tot {to} van {size}",
			},
		},
		ROUTENAME: {
			EXPENSE: { en: "expense", nl: "uitgave" },
			INVOICE: { en: "invoice", nl: "factuur" },
			SETTINGS: { en: "Usersettings", nl: "Instellingen" },
		},
		STATS: {
			BUTTON: {
				EXPORTDATA: { en: "Export", nl: "Export" },
				SHOWTURNOVER: { en: "Show sales", nl: "Toon omzet" },
				SHOWTURNOVERFORQUARTER: { en: "Turnover in quarter", nl: "Omzet in kwartaal" },
				YEAR: { en: "Year", nl: "Jaar" },
			},
			LABELS: {
				DATE: {
					FROM: { en: "Date from", nl: "vanaf" },
					TO: { en: "Date to", nl: "tot" },
				},
				TOTALEXPENSESVAT: { en: "Total VAT payed", nl: "Totale BTW betaald" },
				TOTALTURNOVER: { en: "Total turnover", nl: "Totale omzet" },
				TURNOVER: { en: "Calculate sales", nl: "Bereken omzet" },
				VAT: { en: "Calculate value added tax", nl: "Bereken BTW" },
			},
			TABLE: {
				HEADER: {
					AMOUNT: { en: "Amount", nl: "Bedrag" },
					CHARGEDTO: { en: "Charged to", nl: "Gefactureerd aan" },
					DATE: { en: "Date", nl: "Datum" },
					ID: { en: "#", nl: "#" },
					INVOICENR: { en: "Invoice", nl: "Factuur" },
					PAYEDTO: { end: "Payed to", nl: "Betaald aan" },
					VATAMOUNT: { en: "Vat", nl: "BTW" },
				},
				TITLE: {
					EXPENSESINPERIOD: { en: "Expenses", nl: "Uitgaven" },
					TURNOVERINPERIOD: { en: "Turnover", nl: "Omzet" },
				},
			},
		},
		STATUSMESSAGE: {
			DOCUMENTADDED: { en: "Document succesfully added", nl: "Document toegevoegd" },
			DOCUMENTCANCELLED: { en: "Changes removed", nl: "Wijzigingen verwijderd" },
			DOCUMENTUPDATED: { en: "Document succesfully updated", nl: "Document gewijzigd" },
		},
		TITLES: { MR: { en: "Mr", nl: "Dhr" }, MRS: { en: "Ms", nl: "Mw" }, THEY: { en: "They", nl: "Zij" } },
		USERSETTINGS: {
			BUTTON: {
				CANCEL: {
					TEXT: { en: "Cancel", nl: "Cancel" },
					TITLE: { en: "Restore the original usersettings", nl: "Vertoon de originele instellingen" },
				},
				SAVE: {
					TEXT: { en: "Save", nl: "Bewaar" },
					TITLE: { en: "Save the current usersettings", nl: "Sla de huidige instellingen op" },
				},
				UPDATE: {
					TEXT: { en: "Update", nl: "Bijwerken" },
					TITLE: { en: "Save the current usersettings", nl: "Sla de huidige instellingen op" },
				},
			},
			DELIVERYCONDITIONS: {
				TITLE: {
					en: "Deliveryconditions",
					nl: "Leveringsvoorwaarden",
				},
			},
			LABEL: {
				ADDRESS: { en: "Address", nl: "Adres" },
				CITY: { en: "City", nl: "Stad" },
				COMPANY: { en: "Company", nl: "Bedrijf" },
				COUNTRY: { en: "Country", nl: "Land" },
				DELIVERYCONDITIONS: { en: "Deliveryconditions", nl: "Leveringsvoorwaarden" },
				FIRSTNAME: { en: "FirstName", nl: "Voornaam" },
				LASTNAME: { en: "Lastname", nl: "Achternaam" },
				TITLE: { en: "Title", nl: "Titel" },
				ZIPCODE: { en: "Zipcode", nl: "Postcode" },
			},
			MODAL: {
				BUTTON: { TEXT: { en: "Add", nl: "Toevoegen" } },
				TEXT: {
					en:
						"No usersettings are filled in. These are needed in order to create invoices. Also please enter your company (choose menuoption 'Companies').",
					nl:
						"Er zijn nog geen gegevens van je ingevuld. Om facturen te kunnen maken zijn deze nodig. Voeg ook uw bedrijf toe (kies menuoptie 'Bedrijven').",
				},
			},
			REGISTRATIONS: {
				COC_NUMBER: { en: "CoC nr", nl: "KvK nr" },
				TITLE: { en: "Registrations", nl: "Registraties" },
				VAT_NUMBER: { en: "VAT nr", nl: "BTW nr" },
			},
			SUBMIT: {
				ERROR: {
					MISSINGFIELDVALUES: {
						en: "Not all user settings are filled in. Please fill in missing values",
						nl: "De pagina is niet volledig ingevuld. Vul a.u.b. de ontbrekende gegevens in.",
					},
				},
			},
		},
	};

	get = (key) => {
		const langOb = key.split(".").reduce((ob, key) => ob[key] || {}, this._LANGUAGES);
		return langOb[this._language] || "--";
	};

	getLocale = () => (navigator.language.search("en") > -1 ? "en" : navigator.language.search("nl") > -1 ? "nl" : "");

	getSelectedLanguage = () => this._language;

	setLanguage = (lang) => (this._language = lang || this._defaultLanguage);
}
