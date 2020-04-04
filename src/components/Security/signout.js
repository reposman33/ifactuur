import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import * as styles from "./index.module.scss";

const SignOut = ({ firebase }) => (
	<div onClick={firebase.signOut} className={styles.signOutButton}>
		&nbsp;
	</div>
);

export default withFirebase(SignOut);
