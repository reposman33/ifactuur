import React from "react";
import "./index.scss";

import { SignUpLink } from "../SignUp/index.js";

class SignIn extends React.Component {
	render() {
		return (
			<div>
				<div className='loginWindow'>
					<div className='header'>login ifactuur</div>
					<form name='login' method='post'>
						<input
							type='hidden'
							name='token'
							value='3B9CC5E0-0096-4E20-84B258199F745C48'
						/>
						<input
							type='hidden'
							name='userTimeStamp'
							id='userTimeStamp'
							value=''
						/>

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
											id='email'
											name='username'
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
											id='password'
											name='password'
											maxLength='55'
											size='30'
											autoComplete='off'
										/>
									</td>
								</tr>
								<tr>
									<td
										colspan='2'
										style={{ textAlign: "right" }}>
										<input
											type='submit'
											name='register'
											value='Login'
										/>
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

export default SignIn;
