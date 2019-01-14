import React from "react";
import { withFirebase } from "../Firebase/index.js";
const AuthUserContext = React.createContext(null);

const WithAuthentication = Component => {
	class WithAuthentication extends React.Component {
		constructor(props) {
			super(props);
			this.state = { authenticatedUser: null };
		}

		componentDidMount() {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				authUser => {
					authUser
						? this.setState({
								authData: {
									authenticatedUser: authUser,
									lastSignInTime:
										authUser.mestadata.lastSignInTime
								}
						  })
						: this.setState({
								authData: {
									authenticatedUser: "null",
									lastSignInTime: "null"
								}
						  });
				}
			);
		}

		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state.authData}>
					<Component {...this.props} />
				</AuthUserContext.Provider>
			);
		}
	}

	return withFirebase(WithAuthentication);
};

const withAuthentication = Component => props => (
	<AuthUserContext.Consumer>
		{authData => <Component {...props} authData={authData} />}
	</AuthUserContext.Consumer>
);

export default withAuthentication;
