import React from "react";
import { compose } from "recompose";
import { WithFirebase } from "../Firebase/index.js";
import { withRouter, Link } from "react-router-dom";
import "./index.scss";
import { SignUpLink } from "../SignUp/index.js";
import * as ROUTES from "../../constants/routes.js";

const INITIAL_STATE = {
	email: "",
	password: "",
	error: null
};

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.setState({ ...INITIAL_STATE });
	}
	onSubmit = event => {
		const { email, password } = this.state;
		this.props.fireBase
			.signInWithEmailAndPassword(email, password)
			.then(res => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.INVOICES);
			})
			.catch(error => this.setState({ error }));

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		return (
			<div>
				<div className='signContainer'>
					<div className='header'>login ifactuur</div>
					<form name='login' onSubmit={this.onSubmit}>
						<table id='loginTable'>
							<tbody>
								<tr>
									<td>
										<label htmlFor='useremail'>
											E-mail
										</label>
									</td>
									<td>
										<input
											type='text'
											name='email'
											maxLength='55'
											size='30'
											autoComplete='off'
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label htmlFor='password'>
											Wachtwoord
										</label>
									</td>
									<td>
										<input
											type='password'
											name='password'
											maxLength='55'
											size='30'
											autoComplete='off'
										/>
									</td>
								</tr>
								<tr>
									<td
										colSpan='2'
										style={{ textAlign: "right" }}>
										<input
											type='submit'
											name='register'
											value='Login'
										/>
										{error && (
											<p className='alert'>
												{error.message}
											</p>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
				<SignUpLink />
			</div>
		);
	}
}

export default compose(
	WithFirebase,
	withRouter
)(SignIn);
