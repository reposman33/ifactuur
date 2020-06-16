import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import styles from "./passwordReset.module.scss";

class PasswordForget extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: undefined, error: undefined, message: undefined };
	}

	componentDidCatch(error, info) {
		this.setState({ error: error });
	}

	onReset = (ev) => {
		this.props.firebase
			.passwordReset(this.state.email)
			.then((res) => {
				this.setState({
					message: "Success! Er is een e-mail met instructies verstuurd naar het opgegeven adres",
				});
			})
			.catch((error) => {
				this.setState({ error: error });
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
		const { error, message } = this.state;
		const isInvalid = this.state.email === null || !this.validateEmail(this.state.email);
		return (
			<div className={styles.passwordResetContainer}>
				<div className={styles.header + " py-1 mb-3"}>Wachtwoord vergeten</div>
				<div className={styles.table + " d-flex flex-column justify-content-between py-2"}>
					<div className={styles.firstRow + " d-flex flex-row"}>
						<label>E-mail</label>
						<input type='text' name='email' onChange={this.onChange} />
					</div>
					<div className='d-flex flex-column justify-content-between'>
						<div className={styles.links + " d-flex flex-row justify-content-between"}>
							<Link to={ROUTES.SIGN_IN}>Login</Link>
							<input type='submit' disabled={isInvalid} onClick={this.onReset} />
						</div>
					</div>
				</div>
				{message && <div className='text-success mx-1'>{message}</div>}
				{error && <div className={styles.alert}>{error}</div>}
			</div>
		);
	}
}

export default withFirebase(PasswordForget);
