import React from "react";
import { compose } from "recompose";
import { withFirebase } from "../../Firebase/index.js";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { SignUpLink } from "./signup.js";
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

	onSubmit = (event) => {
		const { email, password } = this.state;
		this.props.firebase.signInWithEmailAndPassword(email, password).then((res) => {
			this.setState({
				...INITIAL_STATE,
				userid: res.user.uid,
			});

			this.props.history.push({ pathname: ROUTES.INVOICES, state: { userId: res.user.uid } });
		});

		event.preventDefault();
	};

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === "" || email === "";
		return (
			<div>
				<div className={styles.signinContainer}>
					<div className={styles.header}>login ifactuur</div>
					<form name='login' onSubmit={this.onSubmit}>
						<table>
							<tbody>
								<tr>
									<td>
										<label htmlFor='useremail'>E-mail</label>
									</td>
									<td>
										<input
											type='text'
											name='email'
											maxLength='55'
											size='30'
											onChange={this.onChange}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label htmlFor='password'>Wachtwoord</label>
									</td>
									<td>
										<input
											type='password'
											name='password'
											maxLength='55'
											size='30'
											onChange={this.onChange}
										/>
									</td>
								</tr>
								<tr>
									<td colSpan='2' style={{ textAlign: "right" }}>
										<input
											type='submit'
											className={isInvalid ? styles.invalid : ""}
											disabled={isInvalid}
										/>
										{error && <p className={styles.alert}>{error.message}</p>}
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
				<SignUpLink />
				<div style={{ margin: 20 + "px auto", width: 300 + "px" }}>
					<Link to={ROUTES.PASSWORD_FORGET}>wachtwoord vergeten?</Link>
				</div>
			</div>
		);
	}
}

const SignInPage = compose(withRouter, withFirebase)(SignInForm);

export default SignInPage;
