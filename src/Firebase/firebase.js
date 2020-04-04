import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { config_dev } from "../environments";
import { config_prod } from "../environments";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
		app.initializeApp(config);
		this.auth = app.auth();
		this.db = app.firestore();
	}

	// INVOICES

	getInvoices = columns => {
		const rowData = [];
		return this.db
			.collection("invoices")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					const data = doc.data();
					rowData.push(
						columns.reduce((acc, col) => {
							acc[col.dataField] = data[col.dataField];
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
