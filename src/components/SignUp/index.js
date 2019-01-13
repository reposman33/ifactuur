import React, { Component } from "react";
import "../SignIn/index.scss";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { WithFirebase } from "../Firebase/index.js";

const INITIAL_STATE = {
	username: "",
	email: "",
	password1: "",
	password2: "",
	error: ""
};

const SignUpPage = () => <SignUpForm />;
class SignUpFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { username, email, password1 } = this.state;
		this.props.firebase
			.createUserWithEmailAndPassword(email, password1)
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
		const { username, email, password1, password2, error } = this.state;

		const isInvalid =
			password1 !== password2 ||
			password1 === "" ||
			username === "" ||
			email === "";

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
										maxLength='55'
										size='45'
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
										maxLength='55'
										size='45'
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
								<td colSpan='2' style={{ textAlign: "right" }}>
									<button
										type='button'
										disabled={isInvalid}
										onClick={this.onSubmit}>
										Registreer
									</button>
									{error && (
										<p className='alert'>{error.message}</p>
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		);
	}
}

const SignUpForm = compose(
	withRouter,
	WithFirebase
)(SignUpFormBase);

const SignUpLink = () => (
	<div style={{ margin: 20 + "px auto", width: 300 + "px" }}>
		Nog geen account? Klik <Link to={ROUTES.SIGN_UP}>hier</Link> om te
		registreren.
	</div>
);

export default SignUpPage;
export { SignUpForm, SignUpLink };
