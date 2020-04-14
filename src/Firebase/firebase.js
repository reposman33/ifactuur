import app from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import "firebase/auth";
import "firebase/firestore";
import { config_dev, config_prod } from "../environments";
//import * as invoices from "../invoices.json";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
		this.i18N = new I18n();
		this.dateFormat = new Intl.DateTimeFormat(this.i18N.getLocale(), {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
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

	passwordReset = email => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = password => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

	signOut = () => this.auth.signOut();

	// ===============================================================
	// ===============================================================
	// COMPANIES
	// ===============================================================
	// ===============================================================
	getCompany = id => this.db.collection("companies").get();

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
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
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

	getInvoice = id =>
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
	 * Convert format of invoice field 'rows'
	 * Each invoice contains a 'rows' field containing stringified object with numbered keys. This represents the [description] / [hourly rate] / [hours worked] / [total amount] part of an invoice. Convert it to an array with subarrays for each line.
	 * 
	 * Example:
	 * {uren1: "144", bedrag1: "10800.00", uurtarief1: "75", omschrijving1: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen", omschrijving2: "overeenkomstnummer: 912-16-70198"}
	
	 becomes

	[{uren: "144", bedrag: "10800.00", uurtarief: "75", omschrijving: "Vivat werkzaamheden in mei t.b.v. Zwitserleven bel…en / Mijn Zwitserleven dashboard / Reaal beleggen"},{invoiceID: "214", omschrijving: "overeenkomstnummer: 912-16-70198"}]
	 * 
	 */
	convertRows2JSON = () => {
		this.db
			.collection("invoices")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach((doc, i) => {
					const invoice = doc.data();
					let rows = JSON.parse(invoice.rows);
					// some json strings are arrays. Don't try to process these
					if (!Array.isArray(rows)) {
						//const newRows = [];
						let newRows = [];
						Object.keys(rows).map(key => {
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
						newRows = newRows.filter(ob => ob != null);
						// update collection rows
						this.db
							.collection("invoices")
							.doc(doc.id)
							.update({ rows: JSON.stringify(newRows) })
							.then(() => console.log("updated ", invoice.id))
							.catch(err => console.log("ERROR: ", err));
					} else {
						console.log("not updated invoice ", invoice.id);
					}
				});
				console.log("Finished updating");
			});
	};

	/**
	 * convert field rows from string to array.
	 * @returns: void  - updates invoice.rows
	 */
	convertInvoiceRowsToArray() {
		let invoice;
		let counter = 1;
		this.db
			.collection("invoices")
			.get()
			.then(snapshot =>
				snapshot.forEach(doc => {
					invoice = doc.data();
					return this.db
						.collection("invoices")
						.doc(doc.id)
						.update({ rows: JSON.parse(invoice.rows) })
						.then(() =>
							console.log(
								"updating invoice ",
								counter++,
								"of ",
								snapshot.size,
								": ",
								JSON.parse(invoice.rows)
							)
						);
				})
			)
			.then(() => console.log("updated ", invoice.id))
			.catch(err => console.log("ERROR: ", err));
	}
	/**
	 * import local json file into fireStore. import * as invoices from "../invoices.json";
	 */
	importInvoices() {
		this.invoices.default.map((invoice, i) =>
			this.db
				.collection("invoices")
				.add(invoice)
				.then(res =>
					console.log(
						`${i === this.invoices.default.length - 1 ? "LAST " : ""}Document ${i + 1}:${
							this.invoices.default.length
						} added`
					)
				)
				.catch(err => console.log("ERROR: ", err))
		);
	}

	/**
	 * convert strikngs to integers / floats etc
	 * id: "1",id:"2" => id:1, id:2 etc
	 * @param {object} types - an object containing field-type-convertfunction mappings to convert string to datatypes:
	 * @returns: void - SETs invoices collection instead
	 * */
	//
	typeInvoices() {
		// import the stringified values in the row array as well
		const convertArray = arr => {
			const objectArray = JSON.parse(arr);
			return objectArray.map(row =>
				Object.keys(row).map(key => !isNaN(parseInt(row[key]) ? parseInt(row[key]) : row[key]))
			);
		};
		const convert = {
			defaultValues: {
				integer: null,
				float: null,
				array: [],
				Date: null
			},
			keys: {
				id: { type: "integer", convert: parseInt },
				// invoiceNr: { type: "float", convert: parseFloat },
				userId: { type: "integer", convert: parseInt },
				// dateTimeCreated: { type: "Date", convert: date => new Date(date) },
				// dateTimePrinted: { type: "Date", convert: date => new Date(date) },
				// dateTimeSent: { type: "Date", convert: date => new Date(date) },
				// dateTimePaid: { type: "Date", convert: date => new Date(date) },
				VatRate: { type: "integer", convert: parseInt }
			}
		};

		const convertInvoices = (querySnapshot, types) => {
			return querySnapshot.forEach(doc => {
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
					return convertedInvoice;
				}, {});
				this.db
					.collection("invoices")
					.doc(doc.id)
					.set(convertedInvoice)
					.then(res => console.log("invoice set => ", res));
			});
		};

		this.db
			.collection("invoices")
			.get()
			.then(querySnapshot => convertInvoices(querySnapshot, convert));
	}
}

export default Firebase;
