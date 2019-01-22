import React from "react";
import AuthUserContext from "./context.js";
import { withFirebase } from "../Firebase/index.js";

const withAuthentication = Component => {
	class WithAuthentication extends React.Component {
		constructor(props) {
			super(props);
			this.state = { authUser: null };
		}

		componentDidMount() {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				authUser => {
					authUser
						? this.setState({
								authUser: {
									authUser: authUser,
									lastSignInTime:
										authUser.metadata.lastSignInTime
								}
						  })
						: this.setState({
								authUser: {
									authUser: null,
									lastSignInTime: null
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
				<div>
					<AuthUserContext.Provider value={this.state.authUser}>
						<Component {...this.props} />
					</AuthUserContext.Provider>
				</div>
			);
		}
	}
	return withFirebase(WithAuthentication);
};
export default withAuthentication;
