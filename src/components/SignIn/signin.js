import React from "react";
import { compose } from "recompose";
import { withFirebase } from "../../Firebase/index.js";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { SignUpLink } from "../SignUp/signup.js";
import * as ROUTES from "../../constants/routes.js";
import * as styles from "./signin.module.scss";

const INITIAL_STATE = {
	email: "",
	password: "",
	lastSignInTime: "",
	error: null,
	userId: null,
};

class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onLogin = (event) => {
		event.preventDefault();
		const { email, password } = this.state;
		this.props.firebase
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				if (res.user) {
					this.setState({
						...INITIAL_STATE,
					});
					this.props.history.push({ pathname: ROUTES.INVOICES });
				} else {
					this.setState({ error: res.message });
				}
			})
			.catch((e) => console.log("ERROR ", e));
	};

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === "" || email === "";
		return (
			<div className={styles.signinContainer}>
				<div className={styles.header + " py-1 mb-3"}>Eerst even inloggen...</div>
				<div className='my-3'>
					<table>
						<tbody>
							<tr>
								<td>
									<label>E-mail</label>
								</td>
								<td>
									<input type='text' name='email' onChange={this.onChange} />
								</td>
							</tr>
							<tr>
								<td>
									<label>Wachtwoord</label>
								</td>
								<td>
									<input type='password' name='password' onChange={this.onChange} />
								</td>
							</tr>

							<tr>
								<td colSpan='2'>
									<input
										type='button'
										className={styles.button + isInvalid ? styles.invalid : ""}
										disabled={isInvalid}
										onClick={this.onLogin}
										value='Login'
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='links d-flex flex-row justify-content-between m-3 pb-3'>
					<SignUpLink />
					<Link to={ROUTES.PASSWORD_FORGET}>wachtwoord vergeten?</Link>
				</div>
				{!!error && <div className={styles.alert}>{error}</div>}
			</div>
		);
	}
}

const SignInPage = compose(withRouter, withFirebase)(SignInForm);

export default SignInPage;
