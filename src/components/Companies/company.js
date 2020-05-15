import React from "react";
import { Textarea } from "../Shared/Textarea/textarea";
import { Select } from "../Shared/Select/select";
import { Button } from "../Shared/Button/button";
import { TextInput } from "../Shared/TextInput/textInput";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./company.module.scss";

class Company extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();

		// State keys and transform functions to apply.
		this.persistFields = {
			address: (fieldValue) => fieldValue,
			bank: (fieldValue) => fieldValue,
			bankAccountNr: (fieldValue) => fieldValue,
			bankAccountNameHolder: (fieldValue) => fieldValue,
			btwnr: (fieldValue) => fieldValue,
			city: (fieldValue) => fieldValue,
			contact: (fieldValue) => fieldValue,
			contactTelephone: (fieldValue) => fieldValue,
			contactTitle: (fieldValue) => fieldValue,
			country: (fieldValue) => fieldValue,
			email: (fieldValue) => fieldValue,
			fax: (fieldValue) => fieldValue,
			id: (fieldValue) => fieldValue,
			kvknr: (fieldValue) => fieldValue,
			name: (fieldValue) => fieldValue,
			notes: (fieldValue) => fieldValue,
			url: (fieldValue) => fieldValue,
			zipcode: (fieldValue) => fieldValue,
		};

		// initialize state
		this.state = {
			id: undefined,
			name: "",
			address: "",
			zipcode: "",
			city: "",
			contact: "",
			contactTelephone: "",
			contactTitles: [
				{ title: this.I18n.get("TITLES.MR"), id: 1 },
				{ title: this.I18n.get("TITLES.MRS"), id: 2 },
				{ title: this.I18n.get("TITLES.THEY"), id: 3 },
			],
			contactTitle: "",
			country: "",
			email: "",
			fax: "",
			btwnr: "",
			kvknr: "",
			notes: "",
			url: "",
			bank: "",
			bankAccountNr: "",
			bankAccountNameHolder: "",
		};

		this.newCompanyPromises$ = [];
		this.isExistingCompany = !!(!!this.props.location.state && this.props.location.state.id);

		// retrieve existing Company from db
		this.company$ = this.isExistingCompany
			? this.props.firebase.getCompany(this.props.location.state.id)
			: undefined;
		// new invoice!
		if (!this.isExistingCompany) {
			this.newCompanyPromises$ = [];
			// retrieve last invoiceNr
			this.newCompanyPromises$.push(this.props.firebase.getNewFieldValue("companies", "id"));
		}
	}

	componentDidMount = () => {
		if (!this.isExistingCompany) {
			// new company, assign new id
			Promise.all(this.newCompanyPromises$).then((value) =>
				this.setState({
					id: value[0],
				})
			);
		} else {
			// assign keys of retrieved document to state
			this.company$.then((doc) => {
				Object.keys(doc).map((documentKey) => this.setState({ [documentKey]: doc[documentKey] }));
			});
		}
	};

	// onListview
	onListview = () =>
		this.props.history.push({
			pathname: ROUTES.COMPANIES,
		});

	/**
	 * handle input of most input fields
	 * @param{string} name - name of both the inputfield & stateKey
	 * @param{string} value - value of user input
	 */
	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	// onSubmit
	onSubmit = () => {
		const company = {};
		Object.keys(this.persistFields).map(
			// filter keys and optionally convert state prop values
			(key) => {
				if (this.state[key]) {
					company[key] = this.persistFields[key](this.state[key]);
				}
				return null;
			}
		);
		// add the current user id!
		company.userId = this.props.firebase.auth.currentUser.uid;
		console.log(company);
		this.props.firebase.addDocumentToCollection("companies", company).then((docRef) => {
			console.log("document ", docRef.id, " added");
			this.onListview();
		});
	};

	render() {
		return (
			<>
				<div className='row'>
					<div className={"col d-flex flex-column " + styles.noBorderBottom}>
						<div className='d-flex flex-row w-100 mb-3'>
							{/* COMPANY NAME */}
							<TextInput
								type='text'
								extraClasses='w-50 mr-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.name}
								handleOnChange={this.onChange}
								name='name'
								labelText={this.I18n.get("COMPANY.LABEL.NAME")}
							/>
							{/* COMPANY ADDRESS */}
							<TextInput
								type='text'
								extraClasses='w-50'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.address}
								handleOnChange={this.onChange}
								name='address'
								labelText={this.I18n.get("COMPANY.LABEL.ADDRESS")}
							/>
						</div>
						<div className='d-flex flex-row w-100'>
							{/* CITY */}
							<TextInput
								type='text'
								extraClasses='w-50 mr-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.city}
								handleOnChange={this.onChange}
								name='city'
								labelText={this.I18n.get("COMPANY.LABEL.CITY")}
							/>
							{/* ZIPCODE */}
							<TextInput
								type='text'
								extraClasses={"w-25 mr-3 "}
								displayInput={!this.isExistingCompany}
								displayValue={this.state.zipcode}
								handleOnChange={this.onChange}
								name='zipcode'
								labelText={this.I18n.get("COMPANY.LABEL.ZIPCODE")}
							/>
							{/* COUNTRY */}
							<TextInput
								type='text'
								extraClasses='w-50'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.country}
								handleOnChange={this.onChange}
								name='country'
								labelText={this.I18n.get("COMPANY.LABEL.COUNTRY")}
							/>
						</div>
					</div>
				</div>
				<div className='row mb-3'>
					<div className={"col d-flex flex-column " + styles.noBorderTop}>
						<div className='d-flex justify-content-between'>
							<span className='d-flex align-items-center mr-3'>
								<FontAwesomeIcon size='2x' icon='user-tie' />
							</span>
							{/* CONTACT TITEL */}
							{/* only show title in new company */}
							{!this.isExistingCompany && (
								<Select
									labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TITLE")}
									name='contactTitle'
									displayValue={this.state.contactTitle}
									displayInput={!this.isExistingCompany}
									data={this.state.contactTitles}
									displayKey='title'
									valueKey='id'
									handleOnChange={this.onChange}
								/>
							)}
							{/* CONTACT */}
							<TextInput
								type='text'
								extraClasses='w-100 mb-3 ml-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.contact}
								handleOnChange={this.onChange}
								name='contact'
								labelText={this.I18n.get("COMPANY.LABEL.CONTACT")}
							/>
						</div>
						<div className='d-flex'>
							{/* URL */}
							<span className='d-flex align-items-center mr-3'>
								<FontAwesomeIcon size='2x' icon='link' />
							</span>
							<TextInput
								type='text'
								extraClasses='w-100 mb-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.url}
								handleOnChange={this.onChange}
								name='url'
								labelText={this.I18n.get("COMPANY.LABEL.URL")}
							/>
						</div>
						<div className='d-flex flex-row justify-content-between'>
							<div className='d-flex flex-column w-50'>
								<div className='d-flex flex-row w-100'>
									{/* TELEPHONE */}
									<span className='d-flex align-items-center mr-3 mt-3'>
										<FontAwesomeIcon size='2x' icon='phone-alt' />
									</span>
									<TextInput
										type='text'
										extraClasses='w-100 mb-3'
										displayInput={!this.isExistingCompany}
										displayValue={this.state.contactTelephone}
										handleOnChange={this.onChange}
										name='contactTelephone'
										labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TELEPHONE")}
									/>
								</div>
								<div className='d-flex flex-row'>
									{/* EMAIL */}
									<span className='d-flex align-items-center mx-2'>
										<FontAwesomeIcon size='2x' icon='envelope' />
									</span>
									<TextInput
										type='text'
										extraClasses='w-100 mb-3'
										displayInput={!this.isExistingCompany}
										displayValue={this.state.email}
										handleOnChange={this.onChange}
										name='email'
										labelText={this.I18n.get("COMPANY.LABEL.EMAIL")}
									/>
								</div>
								<div className='d-flex justify-content-around'>
									<Button
										onClick={this.onListview}
										text={this.I18n.get("BUTTON.OVERVIEW")}
										styles={{ marginLeft: "0.8rem" }}
										classes='btn-primary float-left'
									/>
									<Button
										disabled={this.isExistingCompany}
										onClick={this.onSubmit}
										text={this.I18n.get("BUTTON.SAVE")}
										styles={{ marginRight: "0.8rem" }}
										classes='btn-primary float-right'
									/>
								</div>
							</div>
							{/* NOTES */}
							<Textarea
								cols='50'
								displayInput={!this.isExistingExpense}
								displayValue={this.state.notes}
								extraClasses=''
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.NOTES")}
								name='notes'
								rows='8'
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default withFirebase(Company);
