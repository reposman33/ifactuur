import React, { Component } from "react";
import "./index.scss";
import "../SignIn/index.scss";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import AuthenticationAPI from "../Firebase/firebase.js";

const INITIAL_STATE = {
	username: "",
	email: "",
	password1: "",
	password2: "",
	error: ""
};

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { username, email, password1 } = this.state;
		AuthenticationAPI.createUserWithEmailAndPassword(email, password)
			.then(authUser => {
				this.setState(...this.INITIAL_STATE);
			})
			.catch(error => this.setState({ error }));
		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { username, email, password1, password2, error } = this.state;

		const isInvalid =
			password1 !== password2 ||
			password1 === "" ||
			username === "" ||
			email === "";

		return (
			<div class='loginWindow'>
				<div class='header'>Registreer</div>
				<form name='register' method='post' onSubmit={this.onSubmit}>
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
										id='userName'
										maxlength='55'
										size='45'
										autocomplete='off'
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
									<label
										htmlFor='email'
										style={{ whiteSpace: "nowrap" }}>
										E-mail
									</label>
								</td>
								<td>
									<input
										type='text'
										name='email'
										id='email'
										maxlength='55'
										size='45'
										autocomplete='off'
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
									<label
										htmlFor='password1'
										style={{ whiteSpace: "nowrap" }}>
										Wachtwoord
									</label>
								</td>
								<td>
									<input
										type='password'
										name='password1'
										id='password1'
										maxlength='55'
										size='45'
										autocomplete='off'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={password1}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label
										htmlFor='password2'
										style={{ whiteSpace: "nowrap" }}>
										Herhaal wachtwoord
									</label>
								</td>
								<td>
									<input
										type='password'
										name='password2'
										id='password2'
										maxlength='55'
										size='45'
										autocomplete='off'
										style={{
											backgroundRepeat: "no-repeat",
											backgroundAttachment: "scroll",
											backgroundSize: "16px 18px",
											backgroundPosition: "98% 50%",
											cursor: "auto"
										}}
										value={password2}
										onChange={this.onChange}
									/>
								</td>
							</tr>
							<tr>
								<td colspan='2' style={{ textAlign: "right" }}>
									<input
										type='submit'
										name='register'
										value='Registreer'
									/>
									{error && <p>{error.message}</p>}
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
		Nog geen account? Klik <Link to={ROUTES.SIGN_UP}>hier</Link> om te
		registreren.
	</div>
);

export default SignUp;
export { SignUpLink };
