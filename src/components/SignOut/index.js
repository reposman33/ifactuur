import React from "react";
import { withFirebase } from "../Firebase/index.js";
import * as styles from "./index.module.scss";

const SignOut = ({ firebase }) => (
	<button onClick={firebase.signOut} className={styles.signOutButton}>
		logout
	</button>
);

export default withFirebase(SignOut);
