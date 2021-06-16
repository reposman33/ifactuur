import React from "react";
import * as ROUTES from "../../constants/routes.js";
import { compose } from "recompose";
import { firebaseContextConsumer } from "../../Firebase/index.js";
import { withRouter } from "react-router-dom";
import { AuthUserContext } from "./index.js";

const authorizationContextConsumer = (Component) => {
	class WithAuthorization extends React.Component {
		componentDidMount() {	
		 this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
		 	if (!authUser || authUser.authUser === null) {
		 		this.props.history.push(ROUTES.SIGN_IN);
		 	}
		 });
		}

		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<AuthUserContext.Consumer>
					{authUser => ( authUser && authUser.authUser !== null) ? <Component {...this.props} /> : null}
				</AuthUserContext.Consumer>
			);
		}
	}

	return compose(firebaseContextConsumer, withRouter)(WithAuthorization);
};

export default authorizationContextConsumer;
