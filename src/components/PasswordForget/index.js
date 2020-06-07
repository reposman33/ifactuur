import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import "./index.scss";

class PasswordForget extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: null, errorMessage: null };
	}

	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}

	onSubmit = (ev) => {
		this.props.firebase
			.passwordReset(this.state.email)
			.then((res) => {
				this.setState({
					message: "Success! An email with instructions is sent to the address you provided",
				});
			})
			.catch((error) => {
				this.setState({ errorMessage: error.message });
			});
		ev.preventDefault();
	};

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	validateEmail = (email) => {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};

	render() {
		const isInvalid = this.state.email === null || !this.validateEmail(this.state.email);

		return (
			<div>
				<div className='passwordResetContainer'>
					<div className='header'>Wachtwoord vergeten</div>
					<form name='login' onSubmit={this.onSubmit}>
						<table>
							<tbody>
								<tr>
									<td>
										<label htmlFor='useremail' style={{ whiteSpace: "nowrap" }}>
											E-mail
										</label>
									</td>
									<td>
										<input
											type='text'
											name='email'
											maxLength='55'
											size='30'
											placeholder='E-mail address'
											onChange={this.onChange}
										/>
									</td>
								</tr>
								<tr>
									<td colSpan='2' style={{ textAlign: "right" }}>
										<input type='submit' disabled={isInvalid} value='Go!' />
										{this.state.message && (
											<React.Fragment>
												<p className='alert'>{this.state.message}</p>
												<Link to={ROUTES.SIGN_IN}>Login</Link>{" "}
											</React.Fragment>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</form>
					<div className='ml-2 mb-2'>
						<Link to={ROUTES.SIGN_IN}>Login</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default withFirebase(PasswordForget);
