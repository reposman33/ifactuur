import React from "react";
import * as ROUTES from "../../constants/routes.js";
import { compose } from "recompose";
import { firebaseContextConsumer } from "../../Firebase/index.js";
import { withRouter } from "react-router-dom";
import { AuthUserContext } from "./index.js";

const withAuthorization = condition => Component => {
	class WithAuthorization extends React.Component {
		componentDidMount() {
			if (!this.props.authUser) {
				this.props.history.push(ROUTES.SIGN_IN);
			}
	
			// Is listener needed? this.props.authUser is available...
			// this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
			// 	if (!condition(authUser)) {
			// 		this.props.history.push(ROUTES.SIGN_IN);
			// 	}
			// });
		}

		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<AuthUserContext.Consumer>
					{authUser => (condition(authUser) ? <Component {...this.props} /> : null)}
				</AuthUserContext.Consumer>
			);
		}
	}

	return compose(firebaseContextConsumer, withRouter)(WithAuthorization);
};

export default withAuthorization;
