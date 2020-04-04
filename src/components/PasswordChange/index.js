import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import "./index.scss";

class PasswordChange extends React.Component {
	constructor(props) {
		super(props);
		this.state = { password1: null, password2: null, errorMessage: null };
	}

	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}

	onSubmit = ev => {
		this.props.firebase
			.passwordUpdate(this.state.password1)
			.then(res => {
				this.setState({
					errorMessage: "Wachtwoord succesvol bijgewerkt"
				});
			})
			.catch(error => {
				this.setState({ errorMessage: error.message });
			});
		ev.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { password1, password2, errorMessage } = this.state;
		const isInvalid = password1 === null || password1 !== password2;

		return (
			<div>
				<div className='signContainer'>
					<div className='header'>Wachtwoord wijzigen</div>
					<form name='login' onSubmit={this.onSubmit}>
						<table id='loginTable'>
							<tbody>
								<tr>
									<td>
										<label htmlFor='password1' style={{ whiteSpace: "nowrap" }}>
											Wachtwoord
										</label>
									</td>
									<td>
										<input
											type='password'
											name='password1'
											maxLength='55'
											size='30'
											placeholder='Wachtwoord'
											onChange={this.onChange}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<label htmlFor='password2' style={{ whiteSpace: "nowrap" }}>
											Herhaal
										</label>
									</td>
									<td>
										<input
											type='password'
											name='password2'
											maxLength='55'
											size='30'
											placeholder='Wachtwoord'
											onChange={this.onChange}
										/>
									</td>
								</tr>
								<tr>
									<td colSpan='2' style={{ textAlign: "right" }}>
										<input type='submit' disabled={isInvalid} value='Ok!' />
										{errorMessage && <p className='alert'>{errorMessage}</p>}
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
			</div>
		);
	}
}

export default withFirebase(PasswordChange);
