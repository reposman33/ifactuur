import app from "firebase/app";

const config_prod = {
	apiKey: process.env.REACT_APP_PROD_API_KEY,
	authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
	projectId: process.env.REACT_APP_PROD_PROJECT_ID,
	storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID
};

const config_dev = {
	apiKey: process.env.REACT_APP_DEV__API_KEY,
	authDomain: process.env.REACT_APP_DEV__AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DEV__DATABASE_URL,
	projectId: process.env.REACT_APP_DEV__PROJECT_ID,
	storageBucket: process.env.REACT_APP_DEV__STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_DEV__MESSAGING_SENDER_ID
};

const config =
	process.env.NODE_ENV == "production" ? "config_prod" : "config_dev";

class AuthenticationAPI {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
	}

	// AUTH API

	createUserWithEmailAndPassword = (email, password) => {
		this.auth.createUserWithEmailAndPassword(email, password);
	};

	passWordForget = () => {
		this.auth.passWordForget();
	};

	passwordReset = () => {
		this.auth.passwordReset();
	};

	signInWithEmailAndPassword = (email, password) => {
		this.auth.signInWithEmailAndPassword(email, password);
	};

	signout = () => {
		this.auth.signOut();
	};
}

export default AuthenticationAPI;
