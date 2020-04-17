import app from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import "firebase/auth";
import "firebase/firestore";
import * as invoices from "../invoices.json";

import { config_dev, config_prod } from "../environments";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
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
		this.userId = null;
		this.invoices = invoices;
	}

	// ===============================================================
	// ===============================================================
	// AUTH API
	// ===============================================================
	// ===============================================================

	createUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

	passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password).then((res) => {
			this.userId = res.user.uid;
			return res;
		});

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
			.where("userId", "==", this.userId)
			.orderBy(orderBy, dir)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const invoice = doc.data();
					rowData.push(
						columns.reduce((acc, col) => {
							acc[col.dataField] = invoice[col.dataField];
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

	saveInvoice = (invoice) => {
		// retrieve latest invoiceNr
		this.db
			.collection("invoices")
			.orderBy("invoiceNr", "desc")
			.limit(1)
			.then((doc) => {
				const _invoice = doc.data();
				// add 1 to latest invoiceNr
				invoice.invoiceNr = _invoice.invoiceNr + 1;
				invoice.userId = this.userId;
				return this.db.collection("invoices").add(invoice);
			});
	};

	// ===============================================================
	// ===============================================================
	// UTILITY FUNCTIONS: IMPORTS - UPDATING INVOICES-SPECIFICATIONS
	// ===============================================================
	// ===============================================================

	/**
	 * ==> steps to import invooice table from MySQL to Firestore
	 * 1 From phpmyadmin run query from "F:\www\ifactuur\MVC\ifactuur\application\model\GateWays\FactuurGateway.cfc"
	 * 2 export as JSON and save as invoices.json;
	 * 3 remove comments and replace '{\"1\": ' with '' and '\"}]}",' with '\"}]",'; !!!IMPORTANT!!!
	 * 4 check invoice.rows for id 10  since it is not valid json anymore; !!!IMPORTANT!!!
	 * 5 from localhost:3000: run the following scripts from /components/invoices/componentDidMout()
	 *   4.1 this.props.firebase.importInvoices(); // maybe need to create index - follow link in console
	 *   4.2 this.props.firebase.convertRows2Array();
	 *   4.3 this.props.firebase.typeInvoices();
	 *   4.4 this.props.firebase.updateUserId("<userId>"); // since useriId is "1" now for all
	 *
	 */
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
	 * Convert format of invoice field 'rows'
	 * "{uren1: "144", bedrag1: "10800.00", uurtarief1: "75", omschrijving1: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen", omschrijving2: "overeenkomstnummer: 912-16-70198"}""
	
	 becomes

	[{uren: "144", bedrag: "10800.00", uurtarief: "75", omschrijving: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen"},{invoiceID: "214", omschrijving: "overeenkomstnummer: 912-16-70198"}]
	 * 
	 */
	convertRows2Array = () => {
		this.db
			.collection("invoices")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc, i) => {
					const invoice = doc.data();
					let rows;
					let newRows;

					try {
						rows = JSON.parse(invoice.rows);
					} catch (error) {
						// should not fail if all invoice.rows are correct json (see steps 3 and 4 above)
						console.log("ERROR in JSON.parse(invoice.rows) @ invoice.id ", invoice.id, ": ", error);
					}

					// some rows are already arrays. Don't try to process these.
					if (Array.isArray(rows)) {
						newRows = rows;
					} else {
						newRows = [];
						Object.keys(rows).map((key) => {
							if (rows[key] !== "") {
								// convert last char of key to number
								let ind = parseInt(key.substr(key.length - 1, 1)) - 1; // js array is 0 based, the json string not!
								const strippedKey = key.substr(0, key.length - 1);
								const val = isNaN(rows[key]) ? rows[key] : parseFloat(rows[key]);
								if (newRows[ind]) {
									// add new key to existing row object
									newRows[ind][strippedKey] = val;
								} else {
									// add new row object
									newRows.push({ [strippedKey]: val });
								}
							}
							return null;
						});
						// prevent 'gaps' in the array created by an index > array.length
						newRows = newRows.filter((ob) => ob != null);
					}
					// update collection rows
					this.db
						.collection("invoices")
						.doc(doc.id)
						.update({ rows: newRows })
						.then(() => console.log("updated ", invoice.id))
						.catch((err) => console.log("ERROR: ", err));
				});
				console.log("Finished updating");
			});
	};

	/**
	 * convert strikngs to integers / floats etc
	 * id: "1",id:"2" => id:1, id:2 etc
	 * @param {object} types - an object containing field-type-convertfunction mappings to convert string to datatypes:
	 * @returns: void - SETs invoices collection instead
	 * */
	//
	typeInvoices() {
		// import the stringified values in the row array as well
		const convert = {
			defaultValues: {
				integer: null,
				float: null,
				array: [],
				Date: null,
			},
			keys: {
				id: { type: "integer", convert: parseInt },
				userId: { type: "integer", convert: parseInt },
				dateTimeCreated: { type: "Date", convert: (date) => new Date(date) },
				dateTimePrinted: { type: "Date", convert: (date) => new Date(date) },
				dateTimeSent: { type: "Date", convert: (date) => new Date(date) },
				dateTimePaid: { type: "Date", convert: (date) => new Date(date) },
				VATRate: { type: "integer", convert: parseInt },
			},
		};

		const convertInvoices = (querySnapshot, types) => {
			return querySnapshot.forEach((doc) => {
				const invoice = doc.data();

				const convertedInvoice = Object.keys(invoice).reduce((convertedInvoice, key) => {
					// if the field's key is listed to be converted _and_ the value exists,
					if (types.keys[key] && !!invoice[key]) {
						// apply conversion function to field's value
						convertedInvoice[key] = types.keys[key].convert(invoice[key]);
					} else if (types.keys[key]) {
						// field's key should be converted but has no value - use defaultValue for type
						convertedInvoice[key] = types.defaultValues[types.keys[key].type];
					} else {
						// field's key should not be converted - transfer as is
						convertedInvoice[key] = invoice[key];
					}
					// convert the invoicenr if it is a striingified nr "122"
					convertedInvoice.invoiceNr = isNaN(parseInt(invoice.invoiceNr))
						? invoice.invoiceNr
						: parseInt(invoice.invoiceNr);

					return convertedInvoice;
				}, {});
				console.log("SETting invoice id: ", invoice.id);
				this.db
					.collection("invoices")
					.doc(doc.id)
					.set(convertedInvoice);
			});
		};

		this.db
			.collection("invoices")
			.get()
			.then((querySnapshot) => convertInvoices(querySnapshot, convert));
	}

	/**
	 * upate the userId field of all documents to the given value
	 * @param {string} userId - the new userId
	 */
	updateUserId(userId) {
		this.db
			.collection("invoices")
			.get()
			.then((querySnapshot) =>
				querySnapshot.forEach((doc) => {
					const invoice = doc.data();
					console.log("updating invoice id ", invoice.id);
					this.db
						.collection("invoices")
						.doc(doc.id)
						.update({ userId: userId });
				})
			);
	}
}

export default Firebase;
