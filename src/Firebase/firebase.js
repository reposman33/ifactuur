import app from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import "firebase/auth";
import "firebase/firestore";
import { config_dev, config_prod } from "../environments";
import * as invoices from "../invoices.json";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
		this.invoices = invoices;
		this.i18N = new I18n();
		this.dateFormat = new Intl.DateTimeFormat(this.i18N.getLocale(), {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		app.initializeApp(config);
		this.auth = app.auth();
		this.db = app.firestore();
	}

	// ===============================================================
	// ===============================================================
	// AUTH API
	// ===============================================================
	// ===============================================================

	createUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

	passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

	signOut = () => this.auth.signOut();

	// ===============================================================
	// ===============================================================
	// COMPANIES
	// ===============================================================
	// ===============================================================
	getCompany = (id) => this.db.collection("companies").get();

	getCompanies = () =>
		this.db
			.collection("companies")
			.orderBy("name", "desc")
			.get();

	// ===============================================================
	// ===============================================================
	// VATRATE
	// ===============================================================
	// ===============================================================
	getVatRates = () =>
		this.db
			.collection("vatrates")
			.orderBy("rate")
			.get();

	// ===============================================================
	// ===============================================================
	// INVOICES
	// ===============================================================
	// ===============================================================

	getInvoices = (columns, orderBy = "invoiceID", dir = "desc") => {
		const rowData = [];
		return this.db
			.collection("invoices")
			.orderBy(orderBy, dir)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					rowData.push(
						columns.reduce((acc, col) => {
							const val =
								col.dataField === "dateTimeCreated"
									? this.dateFormat.format(new Date(data[col.dataField]))
									: data[col.dataField];
							acc[col.dataField] = val;
							acc.id = doc.id;
							return acc;
						}, {})
					);
				});
				return rowData;
			});
	};

	getInvoice = (id) =>
		this.db
			.collection("invoices")
			.doc(id)
			.get();

	// ===============================================================
	// ===============================================================
	// UTILITY FUNCTIONS: IMPORTS - UPDATING INVOICES-SPECIFICATIONS
	// ===============================================================
	// ===============================================================
	/**
	 * Convert format of invoice field 'specification' or 'rows'
	 * Each invoice contains a 'specification' field containing JSON string with numbered keys - value pairs. This represents the [description] / [hourly rate] / [hours worked] / [total amount] part of an invoice. Unusable. Convert to an array with subarrays for each line. Example:
	 * 	{uren1: "144", bedrag1: "10800.00", uurtarief1: "75", omschrijving1: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen", omschrijving2: "overeenkomstnummer: 912-16-70198"}
	
	 becomes

	[{invoiceID: "214", uren: "144", bedrag: "10800.00", uurtarief: "75", omschrijving: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen"},{invoiceID: "214", omschrijving: "overeenkomstnummer: 912-16-70198"}]
	 * 
	 */
	convertRows2JSON = () => {
		return this.db
			.collection("invoices")
			.get()
			.then((querySnapshot) => {
				const specs = [];
				querySnapshot.forEach((doc, i) => {
					const rowData = doc.data();
					const rows = JSON.parse(rowData.rows);
					const row = [];

					Object.keys(rows).map((key) => {
						if (rows[key] !== "") {
							// convert last char of key to number
							const ind = parseInt(key.substr(key.length - 1, 1)) - 1; // js array is 0 based, the json string not!
							const strippedKey = key.substr(0, key.length - 1);
							if (row[ind]) {
								row[ind][strippedKey] = rows[key];
							} else {
								row[ind] = { [strippedKey]: rows[key] };
							}
						}
						return null;
					});
					console.log(`Updating invoice: ${JSON.stringify(row)}`);

					// update collection Invoices field specification
					this.db
						.collection("invoices")
						.doc(doc.id)
						.update({ rows: JSON.stringify(row) });

					specs.push(row);
				});
				console.log("Finished updating");
			});
	};

	// IMPORT ../invoices.json INTO FIREBASE
	importInvoices() {
		this.invoices.default.map((invoice, i) =>
			this.db
				.collection("invoices")
				.add(invoice)
				.then((res) =>
					console.log(
						`${i === this.invoices.default.length - 1 ? "LAST " : ""}Document ${i + 1}:${
							this.invoices.default.length
						} added`
					)
				)
				.catch((err) => console.log("ERROR: ", err))
		);
	}

	/**
	 * update the invoices.type field. This field value is '1' for normal (debit) invoice, it is '2' for a 'credit' invoice
	 *
	 */
	updateInvoicesField() {
		this.db
			.collection("invoices")
			.get()
			.then((querySnapshot) =>
				querySnapshot.forEach((doc) => {
					const invoice = doc.data();
					const invoiceType = invoice.type === "1" ? "debet" : "credit";
					this.db
						.collection("invoices")
						.doc(doc.id)
						.update({ type: invoiceType });
					console.log(`updated factuur ${invoice.invoiceID} ==> ${invoiceType} factuur`);
				})
			);
	}
}

export default Firebase;
