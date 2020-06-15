import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import styles from "./passwordReset.module.scss";

class PasswordForget extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: null, errorMessage: null };
	}

	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}

	// check and see an error text...
	// componentDidMount() {
	// 	this.setState({
	// 		error:
	// 			"Die kentering gaat niet zonder slag of stoot. Institutioneel racisme zit ook in onze taal gebakken, maar wie dat benoemt kan rekenen op een aantal voorspelbare reacties: ‘",
	// 	});
	// }

	onReset = (ev) => {
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
			<div className={styles.passwordResetContainer}>
				<div className={styles.header + " py-1 mb-3"}>Wachtwoord vergeten</div>
				<div className={styles.table + " d-flex flex-column justify-content-between py-2"}>
					<div className={styles.firstRow + " d-flex flex-row"}>
						<label>E-mail</label>
						<input type='text' name='email' onChange={this.onChange} />
					</div>
					<div className='d-flex flex-column justify-content-between'>
						{this.state.error && <div className={styles.alert + " mb-2"}>{this.state.error}</div>}
						<div className={styles.links + " d-flex flex-row justify-content-between"}>
							<Link to={ROUTES.SIGN_IN}>Login</Link>
							<input type='submit' disabled={isInvalid} onClick={this.onReset} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withFirebase(PasswordForget);
