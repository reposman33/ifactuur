import app from "firebase/app";
import { I18n } from "../services/I18n/I18n";
import "firebase/auth";
import "firebase/firestore";
import { config_dev } from "../environments";
import { config_prod } from "../environments";

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

	// INVOICES

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
							return acc;
						}, {})
					);
				});
				return rowData;
			});
	};
	// AUTH API

	createUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

	passwordReset = email => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = password => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

	signOut = () => this.auth.signOut();
}

export default Firebase;
