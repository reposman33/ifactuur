import React from "react";

const FirebaseContext = React.createContext(null);

const firebaseContextConsumer = Component => props => (
	<FirebaseContext.Consumer>
		{firebase => <Component {...props} firebase={firebase} />}
	</FirebaseContext.Consumer>
);

export default FirebaseContext;
export { firebaseContextConsumer };
