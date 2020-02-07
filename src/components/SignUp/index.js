import React, { Component } from "react";
import "../SignIn/index.scss";
import { Link, withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import { withFirebase } from "../Firebase/index.js";
import { compose } from "recompose";

const INITIAL_STATE = {
	username: "",
	email: "",
	password: "",
	passwordRepeat: "",
	error: ""
};

class SignUpForm extends Component {
	constructor(props) {
		super(props);

		this.state = INITIAL_STATE;
	}

	onSubmit = event => {
		const { email, password } = this.state;
		this.props.firebase
			.createUserWithEmailAndPassword(email, password)
			.then(authUser => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.SIGN_IN);
			})
			.catch(error => {
				this.setState({ error });
			});
		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { username, email, password, passwordRepeat, error } = this.state;

		const isInvalid = password !== passwordRepeat || password === "" || username === "" || email === "";

		return (
			<div className='signContainer'>
				<div className='header'>Registreer</div>
				<form onSubmit={this.onSubmit}>
					<table>
						<tbody>
							<tr>
								<td>
									<label htmlFor='username'>userName</label>
								</td>
								<td>
									<input
										type='text'
										name='username'
										maxLength='55'
										size='45'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={username}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label htmlFor='email' style={{ whiteSpace: "nowrap" }}>
										E-mail
									</label>
								</td>
								<td>
									<input
										type='text'
										name='email'
										maxLength='55'
										size='45'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={email}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label htmlFor='password' style={{ whiteSpace: "nowrap" }}>
										Wachtwoord
									</label>
								</td>
								<td>
									<input
										type='password'
										name='password'
										maxLength='55'
										size='45'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={password}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label htmlFor='passwordRepeat' style={{ whiteSpace: "nowrap" }}>
										Herhaal wachtwoord
									</label>
								</td>
								<td>
									<input
										type='password'
										name='passwordRepeat'
										maxLength='55'
										size='45'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={passwordRepeat}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan='2' style={{ textAlign: "right" }}>
									<button type='button' disabled={isInvalid} onClick={this.onSubmit}>
										Registreer
									</button>
									{error && <p className='alert'>{error.message}</p>}
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		);
	}
}

const SignUpLink = () => (
	<div style={{ margin: 20 + "px auto", width: 300 + "px" }}>
		Nog geen account? Klik <Link to={ROUTES.SIGN_UP}>hier</Link> om te registreren.
	</div>
);

export default compose(withRouter, withFirebase)(SignUpForm);
export { SignUpForm, SignUpLink };
