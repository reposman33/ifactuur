import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "../AppRouter/approuter";
import { withAuthentication } from "../Session";
import Navigation from "../Navigation/";
import { I18n } from "../../services/I18n/I18n";
import "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPrint,
	faEdit,
	faDoorOpen,
	faSignOutAlt,
	faEquals,
	faPlus,
	faTrashAlt,
	faUserTie,
	faLink,
	faPhoneAlt,
	faEnvelope,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const config = {
	projectPublicName: process.env.REACT_APP_PROJECTPUBLICNAME,
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();
		this.state = {
			language: this.I18n.getSelectedLanguage(),
			errorMessage: null,
		};
		library.add(
			faPrint,
			faEdit,
			faDoorOpen,
			faSignOutAlt,
			faEquals,
			faPlus,
			faTrashAlt,
			faUserTie,
			faLink,
			faPhoneAlt,
			faEnvelope,
			faTimesCircle
		);
	}

	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}

	componentDidMount() {
		document.title = process.env.REACT_APP_PROJECTPUBLICNAME;
		// add 'development' when in development mode
		document.title +=  process.env.NODE_ENV === "development" ? " - " +  process.env.NODE_ENV : "";
	}

	setLanguage = (lang) => {
		this.I18n.setLanguage(lang);
		this.setState({ language: lang });
	};

	render() {
		if (this.state.errorMessage) {
			return <div>An error occurred: {this.state.errorMessage}</div>;
		}
		return (
			<Router>
				<React.Fragment>
					<div className='navContainer'>
						<Navigation setLanguage={this.setLanguage} />
					</div>
					<div className='container'>
						<AppRouter />
					</div>
				</React.Fragment>
			</Router>
		);
	}
}

export default withAuthentication(App);
