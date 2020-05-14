import React from "react";
import { DateComponent } from "../Shared/Date/date";
import { Textarea } from "../Shared/Textarea/textarea";
import { Select } from "../Shared/Select/select";
import { Button } from "../Shared/Button/button";
import { TextInput } from "../Shared/TextInput/textInput";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./company.module.scss";

class Company extends React.Component {
	constructor(props) {
		super(props);

		// When storing data all state values are strings. They have to be xformed to their respective types.
		// Below the state keys and their transform functions to apply.
		this.persistFields = {
			name: "",
			address: "",
			zipcode: "",
			city: "",
			contact: "",
			contactTitle: "",
			contactTelephone: "",
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

		// initialize state
		this.state = {
			id: undefined,
			name: "",
			address: "",
			zipcode: "",
			city: "",
			contact: "",
			contactTelephone: "",
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
			this.newCompanyPromises$.push(this.props.firebase.getNewFieldValue("company", "id"));
		}
		this.I18n = new I18n();
	}

	componentDidMount = () => {
		if (!this.isExistingCompany) {
			// new company, assign new id
			Promise.all(this.newCompanyPromises$).then((value) =>
				this.setState({
					id: value[0],
				})
			);
		}
		this.company$.then((doc) => {
			this.setState(
				{
					id: doc.id,
					name: doc.name,
					address: doc.address,
					zipcode: doc.zipcode,
					city: doc.city,
					contact: doc.contact,
					contactTelephone: doc.contactTelephone,
					country: doc.country,
					email: doc.email,
					fax: doc.fax,
					btwnr: doc.btwnr,
					kvknr: doc.kvknr,
					notes: doc.notes,
					url: doc.url,
					bank: doc.bank,
					bankAccountNr: doc.bankAccountNr,
					bankAccountNameHolder: doc.bankAccountNameHolder,
				},
				() => console.log(this.state)
			);
		});
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

	render() {
		return (
			<>
				<div className='row'>
					<div className='col d-flex flex-column'>
						<div className='d-flex flex-row w-100 mb-3'>
							{/* COMPANY NAME */}
							<TextInput
								type='text'
								extraClasses='w-25 mr-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.name}
								handleOnChange={this.onChange}
								name='name'
								labelText={this.I18n.get("COMPANY.LABEL.NAME")}
							/>
							{/* COMPANY ADDRESS */}
							<TextInput
								type='text'
								extraClasses='w-75'
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
								extraClasses='w-25 mr-3'
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
					<div className='col d-flex flex-column'>
						<div className='d-flex my-3 justify-content-between'>
							<span className='d-flex align-items-center mr-3'>
								<FontAwesomeIcon size='2x' icon='user-tie' />
							</span>
							{/* CONTACT TITEL */}
							<Select
								labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TITLE")}
								name='title'
								displayValue={this.state.contactTitle}
								displayInput={!this.isExistingCompany}
								data={this.state.titles}
								displayKey='title'
								valueKey='id'
								handleOnChange={this.onChange}
							/>
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
								extraClasses='w-50 mb-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.url}
								handleOnChange={this.onChange}
								name='url'
								labelText={this.I18n.get("COMPANY.LABEL.URL")}
							/>
							{/* EMAIL */}
							<span className='d-flex align-items-center mx-2'>
								<FontAwesomeIcon size='2x' icon='envelope' />
							</span>
							<TextInput
								type='text'
								extraClasses='w-50 mb-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.email}
								handleOnChange={this.onChange}
								name='email'
								labelText={this.I18n.get("COMPANY.LABEL.EMAIL")}
							/>
						</div>
						{/* TELEPHONE */}
						<div className='d-flex'>
							<span className='d-flex align-items-center mr-3'>
								<FontAwesomeIcon size='2x' icon='phone-alt' />
							</span>
							<TextInput
								type='text'
								extraClasses='w-50 mb-3'
								displayInput={!this.isExistingCompany}
								displayValue={this.state.contactTelephone}
								handleOnChange={this.onChange}
								name='contactTelephone'
								labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TELEPHONE")}
							/>
							{/* NOTES */}
							<Textarea
								cols='50'
								displayInput={!this.isExistingExpense}
								displayValue={this.state.notes}
								extraClasses=''
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.NOTES")}
								name='notes'
								rows='4'
							/>
						</div>
					</div>
				</div>
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
			</>
		);
	}
}

export default withFirebase(Company);
