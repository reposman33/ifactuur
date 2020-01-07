import app from "firebase/app";
import "firebase/auth";
import { config_dev } from "./../../../src/environments";
import { config_prod } from "./../../../src/environments";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class Firebase {
	constructor(props) {
		app.initializeApp(config);

		this.auth = app.auth();
	}

	// AUTH API

	createUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	passwordReset = email => this.auth.sendPasswordResetEmail(email);

	passwordUpdate = password => this.auth.currentUser.updatePassword(password);

	signInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	signOut = () => this.auth.signOut();
}

export default Firebase;
