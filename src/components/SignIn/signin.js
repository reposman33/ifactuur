import React from 'react';
import { compose } from 'recompose';
import { firebaseContextConsumer } from '../../Firebase';
import {I18n} from '../../services/I18n/I18n';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from '../SignUp/signup';
import * as ROUTES from '../../constants/routes';
import * as styles from './signin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

const INITIAL_STATE = {
	email: '',
	password: '',
	lastSignInTime: '',
	error: null,
	userId: null,
};

class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.I18n = new I18n();
	}

	signInWithProvider = (p) => 
		this.props.firebase.signInWithProvider(p)
			.then(() => this.continueLogin())
			.catch((error) => {
				this.setState({ error: error.message });
			});

	continueLogin = () => {
		this.setState({
			...INITIAL_STATE,
		});
		this.props.firebase.getUserSettings()
			.then((userSettings) => {
			// redirect to userSettings if first time and nothing filled in yet.
				const routeOb =
				userSettings && userSettings.companyName
					? { pathname: ROUTES.INVOICES }
					: { pathname: ROUTES.SETTINGS, state: { showModal: true } };
				this.props.history.push(routeOb);
			});
	}

	onLogin = (event) => {
		event.preventDefault();
		const { email, password } = this.state;
		this.props.firebase
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				if (res.user) {
					this.continueLogin();
				} else {
					this.setState({ error: res.message });
				}
			})
			.catch((e) => this.setState({ error: e.message }));
	}

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === '' || email === '';
		return (
			<div>
				<div className={styles.signinContainer}>
					<div className={styles.header + ' py-1 mb-3'}>Eerst even inloggen...</div>
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
											className={styles.button + isInvalid ? styles.invalid : ''}
											disabled={isInvalid}
											onClick={this.onLogin}
											value='Login'
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='links d-flex flex-column justify-content-between m-3 pb-3'>
						<div className='d-flex flex-row justify-content-around'>
							<SignUpLink />
							<Link to={ROUTES.PASSWORD_FORGET}>wachtwoord vergeten?</Link>
						</div>
						<div className={styles.alert}>{error}</div>
					</div>
				</div>
				<div className={styles.socialMediaButtons}>
					<button onClick={() => this.signInWithProvider('Facebook')} >
						<FontAwesomeIcon size='2x' icon={faFacebook} />
						{this.I18n.get('SIGNIN.BUTTONS.SIGNIN_FACEBOOK')}
					</button>
					<button onClick={() => this.signInWithProvider('Github')}>
						<FontAwesomeIcon size='2x' icon={faGithub} />
						{this.I18n.get('SIGNIN.BUTTONS.SIGNIN_GITHUB')}
					</button>
					<button onClick={() => this.signInWithProvider('Google')}>
						<FontAwesomeIcon size='2x' icon={faGoogle} />
						{this.I18n.get('SIGNIN.BUTTONS.SIGNIN_GOOGLE')}
					</button>
				</div>
			</div>	
		);
	}
}

const SignInPage = compose(withRouter, firebaseContextConsumer)(SignInForm);

export default SignInPage;
