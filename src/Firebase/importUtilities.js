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
