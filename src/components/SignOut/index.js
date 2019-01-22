import React from "react";
import { withFirebase } from "../Firebase/index.js";
import "./index.scss";

const SignOut = ({ firebase }) => (
	<button type='button' onClick={firebase.signOut}>
		logout
	</button>
);

export default withFirebase(SignOut);
