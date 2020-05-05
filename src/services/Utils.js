import { I18n } from "./I18n/I18n";

class Utils {
	constructor() {
		console.log("this.I18n = ", this.I18n);
	}

	I18n = new I18n();

	dateFormat = new Intl.DateTimeFormat(this.I18n.getLocale(), {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	currencyFormat = new Intl.NumberFormat(this.I18n.getLocale(), {
		style: "currency",
		currency: "EUR",
	});

	dateSortFunction = (a, b, order, dataField, rowA, rowB) =>
		order === "asc" ? a - b : order === "desc" ? b - a : "";
}

export { Utils };
