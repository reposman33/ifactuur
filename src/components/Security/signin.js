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
		event.preventDefault();
		const { email, password } = this.state;
		this.props.firebase.signInWithEmailAndPassword(email, password).then((res) => {
			this.setState({
				...INITIAL_STATE,
			});
			this.props.history.push({ pathname: ROUTES.INVOICES });
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
			<div className={styles.signinContainer}>
				<div className={styles.header}>login ifactuur</div>
				<form name='login' onSubmit={this.onSubmit}>
					<table>
						<tbody>
							<tr>
								<td>
									<label className='mx-2' htmlFor='useremail'>
										E-mail
									</label>
								</td>
								<td>
									<input
										type='text'
										className='mr-2'
										name='email'
										maxLength='55'
										size='30'
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label className='mx-2' htmlFor='password'>
										Wachtwoord
									</label>
								</td>
								<td>
									<input
										type='password'
										className='mr-2'
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
										className={isInvalid ? styles.invalid + " mr-2" : ""}
										disabled={isInvalid}
									/>
									{error && <p className={styles.alert}>{error.message}</p>}
								</td>
							</tr>
						</tbody>
					</table>
				</form>
				<SignUpLink />
				<div className='ml-2 mb-2'>
					<Link to={ROUTES.PASSWORD_FORGET}>wachtwoord vergeten?</Link>
				</div>
			</div>
		);
	}
}

const SignInPage = compose(withRouter, withFirebase)(SignInForm);

export default SignInPage;
