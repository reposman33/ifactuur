import firebase from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import { Utils } from "../services/Utils";
import "firebase/auth";
import "firebase/firestore";

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
	projectPublicName: process.env.REACT_APP_PROJECTPUBLICNAME,
};

class Firebase {
	constructor(props) {
		this.i18N = new I18n();
		this.Utils = new Utils();
		firebase.initializeApp(config);
		this.auth = firebase.auth();
		this.auth.useDeviceLanguage()
		this.db = firebase.firestore();
		this.user = null;
		this.firebase = firebase
		// configure federated signIn
		this.federatedProviders = {
			Facebook: new firebase.auth.FacebookAuthProvider(),
			Github: new firebase.auth.GithubAuthProvider(),
			Google: new firebase.auth.GoogleAuthProvider()
		};
	}

	// ===============================================================
	// ===============================================================
	// AUTH API
	// ===============================================================
	// ===============================================================

	createUserWithEmailAndPassword = (email, password) => {
		this.auth.createUserWithEmailAndPassword(email, password);
		this.user = this.auth.currentUser;
	}

	passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) =>
		// make this login valid during the browser's session
		this.auth
			.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(() => this.auth.signInWithEmailAndPassword(email, password))
			.then((res) => {
				if (res.user.uid) {
					this.user = res.user;
				}
				return res;
			})
			.catch((error) => {
				return error;
			});

	signOut = () => {
		this.auth.signOut()
		.catch(err => console.log('ERROR signing out: ', err))
	};

	getCurrentUserId = () => this.user ? this.user.uid : null;

	setUser = (user) => this.user = user

	// FEDERATED LOGIN / SIGN IN WITH...
	signInWithProvider = (p) => {
		const provider = this.federatedProviders[p]
		return this.onSignInWithProvider(provider)
	}

	onSignInWithProvider = (provider) => this.firebase
		.auth()
		.signInWithPopup(provider)
		.then((result) => {
			if (result.user) {
				this.setUser(result.user)
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				// var accessToken = credential.accessToken;
		}
	})

	// ===============================================================
	// ===============================================================
	// COMPANIES
	// ===============================================================
	// ===============================================================

	/**
	 * get a company
	 * @param {string} id - the 20 charachter fireStore document Id
	 * @returns {object}  - the document including it's 20 digit fireStore value
	 */
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
	getCollection = (collection, orderByField, columns, convertTimestamp = false) => {
		const result = [];
		return this.db
			.collection(collection)
			.where("userId", "==", this.getCurrentUserId())
			.orderBy(orderByField, "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					result.push(
						columns.reduce(
							(acc, col) => {
								// convert a timestamp to date using fireStore toDate()
								acc[col] =
									data[col] && typeof data[col].toDate === "function" // /date/gi.test(col)
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
	 * Get data from a collection between 2 dates
	 * @param {string} collection - Collection to query
	 * @param {string} compareField - Field to compare with startDate and endDate
	 * @param {array} columns - fields to retrieve from documents in collection
	 * @param {string} dateFrom - retrieve documents with a startdate date equal or greater than this
	 * @param {string} dateTo -retrieve documents with a endDate date smaller or equal than this
	 */
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

	/**
	 * Get a document form a collection where a field has a specified value
	 * @param {string} collection - the collection where to retrieve from
	 * @param {string} field - the field by which to select
	 * @param {string} value - the value the field in the selected document has
	 * @return {Object} document - the searched for document
	 */
	getDocumentFromCollectionByField = (collection, field, value) =>
		this.db
			.collection(collection)
			.where(field, "==", value)
			.get()
			.then((res) => {
				const document = res.docs[0].data();
				Object.keys(document).forEach(
					(field) =>
						(document[field] =
							/date/i.test(field) && document[field]
								? this.Utils.dateFormat.format(document[field].toDate())
								: document[field])
				);
				return document;
			});

	/** Add OR update a document to/in a collection
	 * @param{string} collection - the collection to add to / update
	 * @param{object} doc - the document to add / update
	 * @param{string} docId? - the 20 charachter fireStore document Id to update
	 */
	addDocumentToCollection = (collection, doc, docId) =>
		!!docId
			? this.db
					// there is an id of an existing document, update it
					.collection(collection)
					.doc(docId)
					.update(doc)
			: // this is a new document, add it
			  this.db.collection(collection).add(doc);

	/**
	 * Delete a document from a collection
	 * @param{string} collection - collectin to delete document form
	 * @param{string} id - the 20 charachter fireStore document Id
	 */
	deleteDocument = (collection, id) =>
		this.db
			.collection(collection)
			.doc(id)
			.delete();
	/**
	 * returns a sorted list of unique years from all documents in a collection.Each year occurs once in the result.
	 * @param{string} collection - the collection to get the years from
	 * @returns {array} - the sorted array of unique years in descending order
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
				return years.sort((a, b) => b.value - a.value);
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

	getExpensesInPeriod = (dateFrom, dateTo) =>
		this.getCollectionInPeriod(
			"bills",
			"date",
			["amount", "company", "date", "description", "id", "vatrate"],
			dateFrom,
			dateTo
		);

	/**
	 * this function returns the next higher value of the id field
	 * @param {string} collection - the collection to get the value from
	 * @param {string} fieldName - the name of the field to get the value from
	 * @returns {number}  - the fieldvalue + 1
	 */
	getNewId = () =>
		this.db
			.collection("bills")
			// .where("userId", "==", sessionStorage.getItem("userId"))
			.where("userId", "==", this.getCurrentUserId())
			.orderBy("date", "desc")
			.orderBy("id", "desc")
			.limit(1)
			.get()
			.then((querySnapshot) => (querySnapshot.docs[0] ? querySnapshot.docs[0].data().id + 1 : 1));

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
			.then((doc) => this.convertTimestamps(doc.data()));

	/**
	 * Convert a Firestore Timestamp format to a JS Date object.
	 * @param {object} invoice - the invoice document to convert Timestamp fieldValues from
	 */

	/**
	 * this function returns the next higher value of the invoiceNr field
	 * @param {string} collection - the collection to get the value from
	 * @param {string} fieldName - the name of the field to get the value from
	 * @returns {number}  - the fieldvalue + 1
	 */
	getNewInvoiceNr = () =>
		this.db
			.collection("invoices")
			// .where("userId", "==", sessionStorage.getItem("userId"))
			.where("userId", "==", this.getCurrentUserId())
			.orderBy("dateTimeCreated", "desc")
			.orderBy("invoiceNr", "desc")
			.limit(1)
			.get()
			.then((querySnapshot) => (querySnapshot.docs[0] ? querySnapshot.docs[0].data().invoiceNr + 1 : 1));

	convertTimestamps = (invoice) => {
		// convert fireStore Timestamp to JavaScript Date object for a few fields
		["dateTimeCreated", "dateTimePaid", "dateTimeSent", "dateTimePrinted", "periodFrom", "periodTo"].forEach(
			(fieldName) =>
				(invoice[fieldName] = invoice[fieldName] ?
					this.Utils.dateFormat.format(invoice[fieldName].toDate())
					: invoice[fieldName])
		);
		return invoice;
	};

	/**
	 * get all invoices in specified period
	 * @param {string} dateFrom - startDate
	 * @param {string} dateTo - endDate
	 */
	getInvoicesInPeriod = (dateFrom, dateTo) =>
		this.getCollectionInPeriod(
			"invoices",
			"dateTimeCreated",
			["companyName", "dateTimeCreated", "invoiceNr", "rows", "VATRate"],
			dateFrom,
			dateTo
		);

	// ===============================================================
	// ===============================================================
	// USERSETTINGS
	// ===============================================================
	// ===============================================================

	/**
	 * get all settings of a user. Retrieve the 20 character fireStore generated Id from sessionStorage where it is stored after authentication.
	 * @returns {object} - the user data document
	 */

	getUserSettings = () => {
		return this.db
			.collection("users")
			.where("userId", "==", this.getCurrentUserId())
			.get()
			.then((querySnapshot) => {
				let document;
				querySnapshot.forEach((doc) => {
					document = doc.data();
					document.ID = doc.id;
					return document;
				});
				return document;
			});
	};

	// ===============================================================
	// ===============================================================
	// VATRATES
	// ===============================================================
	// ===============================================================

	/**
	 * getVatRates - retrieve all vatrates. Vatrates are not tied to a specific user therefore getCollection not suitable.
	 */
	getVatRates = () =>
		this.db
			.collection("vatrates")
			.get()
			.then((querySnapshot) => {
				const result = [];
				querySnapshot.forEach((doc) => result.push(doc.data()));
				return result;
			});
}

export default Firebase;
