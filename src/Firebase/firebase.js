import firebase from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import { Utils } from "../services/Utils";
import "firebase/auth";
import "firebase/firestore";

import { config_dev, config_prod } from "../environments";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
		this.i18N = new I18n();
		this.Utils = new Utils();
		firebase.initializeApp(config);
		this.auth = firebase.auth();
		this.db = firebase.firestore();
		this.userId = null;
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
		// make this login valid during the browser's session
		this.auth
			.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(() => this.auth.signInWithEmailAndPassword(email, password))
			.then((res) => {
				this.userId = res.user.uid;
				if (res.user.uid) {
					// store userId in sessionStorage
					sessionStorage.setItem("userId", this.userId);
				}
				return res;
			})
			.catch((error) => {
				return error;
			});

	signOut = () => {
		this.auth.signOut();
		sessionStorage.removeItem("userId");
	};

	// ===============================================================
	// ===============================================================
	// COMPANIES
	// ===============================================================
	// ===============================================================

	getCompany = (id) =>
		this.db
			.collection("companies")
			.doc(id)
			.get()
			.then((doc) => ({ ...doc.data(), ID: doc.id }));

	// ===============================================================
	// ===============================================================
	// GENERIC FUNCTIONS
	// ===============================================================
	// ===============================================================
	/**
	 * Get data from a collection
	 * @param{string} collection - collection to return values from
	 * @param{string} orderByField - field to order the result by
	 * @param{array} columns - array of column values to return
	 * @param{boolean} convertTimestamp - wheter to convert a Firestore timestamp value to a string value or apply the fs toDate function
	 */
	getCollection = (collection, orderByField, columns, convertTimestamp = true) => {
		const result = [];
		return this.db
			.collection(collection)
			.where("userId", "==", sessionStorage.getItem("userId"))
			.orderBy(orderByField, "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					result.push(
						columns.reduce(
							(acc, col) => {
								// convert a timestamp to date using FS toDate()
								acc[col] =
									col.indexOf("date") > -1
										? convertTimestamp
											? this.Utils.dateFormat.format(data[col].toDate())
											: data[col].toDate()
										: data[col];
								return acc;
							}, // always include ID
							{ ID: doc.id }
						)
					);
					return result;
				});
				return result;
			});
	};

	/**
	 * this function returns the next higher value of the given field of type number in a collection
	 * @param {string} collection - the collection to get the value from
	 * @param {string} fieldName - the name of the field to get the value from
	 * @returns {number}  - the fieldvalue + 1
	 */
	getNewFieldValue = (collection, fieldName) =>
		this.db
			.collection(collection)
			.where("userId", "==", sessionStorage.getItem("userId"))
			.orderBy("id", "desc")
			.limit(1)
			.get()
			.then((querySnapshot) => (querySnapshot.docs[0] ? querySnapshot.docs[0].data()[fieldName] + 1 : 1));

	/**
	 * @param{object} expense - the expense to save
	 */
	addDocumentToCollection = (collection, doc, docId) =>
		!!docId
			? this.db
					.collection(collection)
					.doc(docId)
					.update(doc)
			: this.db.collection(collection).add(doc);

	deleteDocument = (collection, id) => {
		console.log(`deleting document ${id} from ${collection}`);
		this.db
			.collection(collection)
			.doc(id)
			.delete();
	};

	/**
	 * returns a sorted list of unique years
	 */
	getUniqueYears = (collection) => {
		const dateKey = collection === "expenses" ? "date" : collection === "invoices" ? "dateTimeCreated" : undefined;
		return this.db
			.collection(collection)
			.get()
			.then((collection) => {
				const years = [];
				collection.forEach((doc, i) => {
					const document = doc.data();
					if (
						document[dateKey] &&
						!years.some((el) => el.value === document[dateKey].toDate().getFullYear())
					) {
						years.push({
							id: document[dateKey].toDate().getFullYear(),
							value: document[dateKey].toDate().getFullYear(),
						});
					}
				});
				return years.sort((a, b) => a.value - b.value);
			});
	};

	// ===============================================================
	// ===============================================================
	// EXPENSES
	// ===============================================================
	// ===============================================================

	/**
	 * @param{string}id - the fireStore generated ID
	 */
	getExpense = (id) =>
		this.db
			.collection("bills")
			.doc(id)
			.get()
			.then((doc) => {
				const expense = doc.data();
				return Object.keys(expense).reduce((acc, key) => {
					acc[key] = key === "date" ? this.Utils.dateFormat.format(expense["date"].toDate()) : expense[key];
					return acc;
				}, {});
			});

	// ===============================================================
	// ===============================================================
	// INVOICES
	// ===============================================================
	// ===============================================================

	getInvoice = (id) =>
		this.db
			.collection("invoices")
			.doc(id)
			.get()
			.then((doc) => {
				const invoice = doc.data();
				// convert fireStore Timestamp to JavaScript Date object for a few fields
				[
					"dateTimeCreated",
					"dateTimePaid",
					"dateTimeSent",
					"dateTimePrinted",
					"periodFrom",
					"periodTo",
				].forEach(
					(fieldName) =>
						(invoice[fieldName] = invoice[fieldName]
							? this.Utils.dateFormat.format(invoice[fieldName].toDate())
							: invoice[fieldName])
				);
				return invoice;
			});

	// ===============================================================
	// ===============================================================
	// SETTINGS
	// ===============================================================
	// ===============================================================

	getUserSettings = () => {
		return this.db
			.collection("users")
			.where("userId", "==", sessionStorage.getItem("userId"))
			.get()
			.then((querySnapshot) => {
				let document;
				querySnapshot.forEach((doc) => (document = doc.data()));
				return document;
			});
	};

	getCollectionInPeriod = (collection, compareField, columns, dateFrom, dateTo) =>
		this.getCollection(collection, compareField, columns, false).then((documents) => {
			const _dateFrom = new Date(dateFrom);
			const _dateTo = new Date(dateTo);
			return documents.reduce((acc, doc) => {
				if (doc[compareField] >= _dateFrom && doc[compareField] <= _dateTo) {
					// convert value of compareField (a Date object) to a string
					doc[compareField] = this.Utils.dateFormat.format(doc[compareField]);
					acc.push(doc);
				}
				return acc;
			}, []);
		});

	getInvoicesInPeriod = (dateFrom, dateTo) =>
		this.getCollectionInPeriod(
			"invoices",
			"dateTimeCreated",
			["companyName", "dateTimeCreated", "invoiceNr", "rows", "VATRate"],
			dateFrom,
			dateTo
		);

	getExpensesInPeriod = (dateFrom, dateTo) =>
		this.getCollectionInPeriod(
			"bills",
			"date",
			["amount", "company", "date", "description", "id", "vatrate"],
			dateFrom,
			dateTo
		);

	// ===============================================================
	// ===============================================================
	// UTILITY FUNCTIONS: IMPORTS - UPDATING INVOICES-SPECIFICATIONS
	// ===============================================================
	// ===============================================================

	/**
	 * ==> steps to import invoice table from MySQL to Firestore
	 * 1 From phpmyadmin run query from "F:\www\ifactuur\MVC\ifactuur\application\model\GateWays\FactuurGateway.cfc"
	 * 2 export as JSON and save as invoices.json;
	 * 3 remove comments and replace '{\"1\": ' with '' and '\"}]}",' with '\"}]",'; !!!IMPORTANT!!!
	 * 4 check invoice.rows for id 10  since it is not valid json anymore; !!!IMPORTANT!!!
	 * 	 * don't forget to import the json in this component:
	 * import * as invoices from "../invoices.json";
	 * create fieldMember in constructor
	 * this.invoices = invoices;
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
	 * convert strings to integers / floats etc
	 * id: "1",id:"2" => id:1, id:2 etc
	 * @param {string} collection - the name of the collection where you want to change key types.
	 * @returns: void
	 * */
	//
	typeCollectionKeys(collection) {
		const defaultValues = {
			integer: null,
			float: null,
			array: [],
			Date: null,
		};

		// define for each collection the keys to convert, the key's type and the conversion function to apply to the keys string value
		const documentKeys = {
			invoices: {
				id: { type: "integer", convert: parseInt },
				userId: { type: "integer", convert: parseInt },
				dateTimeCreated: { type: "Date", convert: (date) => new Date(date) },
				dateTimePrinted: { type: "Date", convert: (date) => new Date(date) },
				dateTimeSent: { type: "Date", convert: (date) => new Date(date) },
				dateTimePaid: { type: "Date", convert: (date) => new Date(date) },
				VATRate: { type: "integer", convert: parseInt },
			},
			bills: {
				amount: { type: "integer", convert: parseInt },
				date: { type: "Date", convert: (date) => new Date(date) },
				id: { type: "integer", convert: parseInt },
				vatrate: { type: "integer", convert: parseInt },
			},
			companies: {
				id: { type: "integer", convert: parseInt },
			},
		}[collection];

		const convertInvoices = (querySnapshot, documentKeys) => {
			return querySnapshot.forEach((doc) => {
				const document = doc.data();

				const convertedDocument = Object.keys(document).reduce((convertedDocument, key) => {
					// if the field's key is listed to be converted _and_ the value exists,
					if (documentKeys[key] && !!document[key]) {
						// apply conversion function to field's value
						convertedDocument[key] = documentKeys[key].convert(document[key]);
					} else if (documentKeys[key]) {
						// field's key should be converted but has no value - use defaultValue for type
						convertedDocument[key] = defaultValues[documentKeys[key].type];
					} else {
						// field's key should not be converted - transfer as is
						convertedDocument[key] = document[key];
					}

					return convertedDocument;
				}, {});
				if (document.id) {
					console.log("SETting document id ", document.id, ": ", convertedDocument);
					dbRef.doc(doc.id).set(convertedDocument);
				}
			});
		};

		const dbRef = this.db.collection(collection);

		dbRef.get().then((querySnapshot) => convertInvoices(querySnapshot, documentKeys));
	}

	/**
	 *
	 * @param {string} collection -  the name of the collection to export
	 */
	exportCollection(collection) {
		this.db
			.collection(collection)
			.get()
			.then((querySnapshot) => {
				const importedData = [];
				querySnapshot.forEach((doc) => {
					console.log("importing ", doc.id);
					importedData.push(doc.data());
				});
				console.log("Exported ", collection, " data:");
				console.log(JSON.stringify(importedData));
			});
	}

	/**
	 * -- import documents into a collection. The <collection>.json file is in the /app/src folder and has to be imported with ES6 import statement in firebase.js.
	 * don't forget to import
	 * import json export from MySQL db
	 * import * as bills from "../bills.json";
	 * add to constructor
	 * this.bills = bills;
	 * @param {string} collectionName - the name of the collection where to add the document to
	 */
	importBills(collectionName) {
		const dbRef = this.db.collection(collectionName);

		this.bills.forEach((doc) => {
			console.log("importing document ", doc.id, ": ", doc);
			dbRef.add(doc).then((docRef) => console.log("added document ", docRef.id, ": ", docRef.id));
		});
	}

	/**
	 *  merge the userId field to all documents of a collection
	 * @param {string} userId - the new userId
	 */
	addUserId(collection, userId) {
		this.db
			.collection(collection)
			.get()
			.then((querySnapshot) =>
				querySnapshot.forEach((doc) => {
					const document = doc.data();
					console.log("added userId to document id ", document.id);
					this.db
						.collection(collection)
						.doc(doc.id)
						.set({ userId: userId }, { merge: true });
				})
			);
	}
}

export default Firebase;
