import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/index.js";
import Firebase, { FirebaseContext } from "./components/Firebase/index.js";
import "./index.scss";

ReactDOM.render(
	<FirebaseContext.Provider value={new Firebase()}>
		<App />
	</FirebaseContext.Provider>,
	document.getElementById("root")
);
