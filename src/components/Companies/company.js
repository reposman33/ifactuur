import React from "react";
import { Select } from "../Shared/Select/select";
import { Button } from "../Shared/Button/button";
import { Input } from "../Shared/Input/input";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./company.module.scss";

class Company extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();
		this.prevLocation = this.props.location.params && this.props.location.params.prevLocation;
		this.prevLocationName = this.props.location.params && this.props.location.params.prevLocationName;

		// State keys and transform functions to apply.
		this.persistFields = {
			address: (fieldValue) => fieldValue,
			bank: (fieldValue) => fieldValue,
			bankAccountNr: (fieldValue) => fieldValue,
			bankAccountName: (fieldValue) => fieldValue,
			btwnr: (fieldValue) => fieldValue.toUpperCase(),
			salesTaxNr: (fieldValue) => fieldValue.toUpperCase(),
			city: (fieldValue) => fieldValue,
			contact: (fieldValue) => fieldValue,
			contactTelephone: (fieldValue) => fieldValue,
			contactTitle: (fieldValue) => fieldValue,
			country: (fieldValue) => fieldValue,
			email: (fieldValue) => fieldValue,
			kvknr: (fieldValue) => fieldValue,
			name: (fieldValue) => fieldValue,
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
			btwnr: "",
			kvknr: "",
			salesTaxNr: "",
			url: "",
			bank: "",
			bankAccountNr: "",
			bankAccountName: "", // to display messages to user we use this construct. type equals any Bootstrap 4.4.1 color class for text: https://getbootstrap.com/docs/4.4/utilities/colors/
			settingsStatus: {
				type: undefined,
				message: "",
			},
		};

		// To assert the validity of a value use this map with assertions for each field.
		this.assertFieldValid = {
			address: (fieldValue) => fieldValue.length > 0,
			bank: (fieldValue) => fieldValue.length > 0,
			bankAccountNr: (fieldValue) => fieldValue.length > 0,
			bankAccountName: (fieldValue) => fieldValue.length > 0,
			btwnr: (fieldValue) => fieldValue.length > 0,
			salesTaxNr: (fieldValue) => fieldValue.length > 0,
			city: (fieldValue) => fieldValue.length > 0,
			contact: (fieldValue) => fieldValue.length > 0,
			contactTelephone: (fieldValue) => fieldValue.length > 0,
			contactTitle: (fieldValue) => fieldValue.length > 0,
			country: (fieldValue) => fieldValue.length > 0,
			email: (fieldValue) => fieldValue.length > 0,
			id: (fieldValue) => fieldValue.toString().length > 0,
			kvknr: (fieldValue) => fieldValue.length > 0,
			name: (fieldValue) => fieldValue.length > 0,
			url: (fieldValue) => fieldValue.length > 0,
			zipcode: (fieldValue) => fieldValue.length > 0,
		};

		this.isExistingCompany = !!(!!this.props.location.state && this.props.location.state.id);
	}

	componentDidMount = () => {
		if (this.isExistingCompany) {
			// assign all keys of retrieved document to state
			this.props.firebase.getCompany(this.props.location.state.id).then((doc) => {
				const newState = Object.keys(doc).reduce((newState, documentKey) => {
					newState[documentKey] = doc[documentKey];
					return newState;
				}, {});
				this.setState({ ID: doc.ID });
				this.setState(() => newState);
			});
		}
	};

	onGoBack = () =>
		this.props.history.push({
			pathname: this.prevLocation || ROUTES.COMPANIES,
		});

	/**
	 * handle input of most input fields
	 * @param{string} name - name of both the inputfield & stateKey
	 * @param{string} value - value of user input
	 */
	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	/**
	 * submit the invoice
	 */
	onSubmit = () => this.storeCompany(this.checkCompany(this.onCreateCompany()));

	/**
	 * Check if  fields are valid, convert to correct type
	 * @returns{object} company - the company
	 */
	onCreateCompany = () => {
		return Object.keys(this.persistFields).reduce(
			(acc, key) => {
				acc = this.assertFieldValid[key](this.state[key]) // check if field is valid...
					? Object.assign(acc, { [key]: this.persistFields[key](this.state[key]) }) // if so, convert string to correct type
					: Object.assign(acc, { error: { status: true, keys: [...acc.error.keys, key] } }); // else error
				return acc;
			},
			{ error: { status: false, keys: [] } }
		);
	};

	/**
	 * @param{object} company - the invoice.
	 * @returns{object} - company
	 * @sideEffect - calls setStatusMessage if company is not valid
	 */
	checkCompany = (company) => {
		if (company.error.status) {
			this.setStatusMessage(
				"danger",
				this.I18n.get("USERSETTINGS.SUBMIT.ERROR.MISSINGFIELDVALUES") +
					" [ " +
					company.error.keys.join(", ") +
					" ]"
			);
			return company;
		} else {
			return company;
		}
	};

	/**
	 * @param{object} company - the company.
	 * @returns void - calls fireStore as an sideEffect
	 */
	storeCompany = (company) => {
		if (company.error.status === false) {
			// delete the error info
			delete company.error;
			// add the userId
			company.userId = this.props.firebase.auth.currentUser.uid;
			this.props.firebase
				.addDocumentToCollection("companies", company, this.state.ID)
				.then((docRef) => {
					console.log(`document ${docRef ? docRef.id + "added" : "updated"}`);
					// update statusMessage
					this.setStatusMessage(
						"success",
						this.I18n.get(this.state.ID ? "STATUSMESSAGE.DOCUMENTUPDATED" : "STATUSMESSAGE.DOCUMENTADDED")
					);
					this.onGoBack();
				})
				.catch((e) => {
					console.log("ERROR: ", e);
					this.setStatusMessage("danger", e.message);
				});
		}
	};
	/**
	 * display message to user
	 *
	 * @param{string} type - the type of the message error-info-warn
	 * @param{string} message - te message to display
	 */
	setStatusMessage = (type, message) => {
		this.setState({
			settingsStatus: {
				type: type,
				message: message,
			},
		});
	};

	onGoBack = () =>
		this.props.history.push({
			pathname: this.prevLocation || ROUTES.COMPANIES,
		});

	onCancel = (e) => {
		// React-Router has no Refresh functionality. This hack solves it
		this.props.history.push("/temp");
		this.props.history.goBack();
	};

	render() {
		return (
			<>
				<div className='row'>
					<div className={"col d-flex flex-column pt-3 " + styles.noBorderBottom}>
						<div className='d-flex p-3'>
							{/* COMPANY NAME */}
							<Input
								type='text'
								extraClasses='w-50 mr-3'
								container={false}
								displayInput={true}
								displayValue={this.state.name}
								handleOnChange={this.onChange}
								name='name'
								labelText={this.I18n.get("COMPANY.LABEL.NAME")}
							/>
							{/* COMPANY ADDRESS */}
							<Input
								type='text'
								extraClasses='w-50'
								container={false}
								displayInput={true}
								displayValue={this.state.address}
								handleOnChange={this.onChange}
								name='address'
								labelText={this.I18n.get("COMPANY.LABEL.ADDRESS")}
							/>
						</div>
						<div className='d-flex px-3'>
							{/* CITY */}
							<Input
								type='text'
								extraClasses='w-50 mr-3'
								container={false}
								displayInput={true}
								displayValue={this.state.city}
								handleOnChange={this.onChange}
								name='city'
								labelText={this.I18n.get("COMPANY.LABEL.CITY")}
							/>
							{/* ZIPCODE */}
							<Input
								type='text'
								extraClasses={"w-25 mr-3 "}
								container={false}
								displayInput={true}
								displayValue={this.state.zipcode}
								handleOnChange={this.onChange}
								name='zipcode'
								labelText={this.I18n.get("COMPANY.LABEL.ZIPCODE")}
							/>
							{/* COUNTRY */}
							<Input
								type='text'
								extraClasses='w-50'
								container={false}
								displayInput={true}
								displayValue={this.state.country}
								handleOnChange={this.onChange}
								name='country'
								labelText={this.I18n.get("COMPANY.LABEL.COUNTRY")}
							/>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className={"col d-flex flex-column my-1" + styles.noBorderTop}>
						<div className='d-flex justify-content-between pr-3 mr-3'>
							{/* CONTACT TITEL */}
							<div className='d-flex flex-row'>
								<span className='d-flex align-items-center mr-1'>
									<FontAwesomeIcon size='2x' icon='user-tie' />
								</span>
								<Select
									labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TITLE")}
									name='contactTitle'
									displayValue={this.state.contactTitle}
									displayInput={true}
									data={this.state.contactTitles}
									displayKey='title'
									valueKey='id'
									handleOnChange={this.onChange}
								/>
							</div>
							{/* CONTACT */}
							<Input
								type='text'
								extraClasses='w-50 mb-3'
								displayInput={true}
								displayValue={this.state.contact}
								handleOnChange={this.onChange}
								name='contact'
								labelText={this.I18n.get("COMPANY.LABEL.CONTACT")}
							/>

							{/* TELEPHONE */}
							<div className='d-flex flex-row w-25'>
								<span className='d-flex align-items-center align-items-center'>
									<FontAwesomeIcon size='2x' icon='phone-alt' />
								</span>
								<Input
									type='text'
									extraClasses='w-100 mb-3'
									displayInput={true}
									displayValue={this.state.contactTelephone}
									handleOnChange={this.onChange}
									name='contactTelephone'
									labelText={this.I18n.get("COMPANY.LABEL.CONTACT_TELEPHONE")}
								/>
							</div>
						</div>
						<div className='d-flex'>
							{/* URL */}
							<span className='d-flex align-items-center mr-3'>
								<FontAwesomeIcon size='2x' icon='link' />
							</span>
							<Input
								type='text'
								displayInput={true}
								displayValue={this.state.url}
								extraClasses='w-50 mr-3'
								handleOnChange={this.onChange}
								name='url'
								labelText={this.I18n.get("COMPANY.LABEL.URL")}
							/>
							<div className='d-flex flex-column w-50 ml-3'>
								<div className='d-flex flex-row'>
									{/* EMAIL */}
									<span className='d-flex align-items-center mx-2'>
										<FontAwesomeIcon size='2x' icon='envelope' />
									</span>
									<Input
										type='text'
										extraClasses='w-75 w-100'
										displayInput={true}
										displayValue={this.state.email}
										handleOnChange={this.onChange}
										name='email'
										labelText={this.I18n.get("COMPANY.LABEL.EMAIL")}
									/>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-between'>
							<div className='d-flex flex-column w-100 ml-3 align-content-center'></div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className={"col d-flex flex-column justify-content-center p-3 " + styles.noBorderTop}>
						<div className='d-flex justify-content-between'>
							{/* KvK number */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.kvknr}
								extraClasses='ml-3'
								extraStyles={{ textTransform: "uppercase" }}
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.KVKNR")}
								name='kvknr'
								type='text'
							/>
							{/* VAT number */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.btwnr}
								extraClasses='ml-3'
								extraStyles={{ textTransform: "uppercase" }}
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.BTWNR")}
								name='btwnr'
								type='text'
							/>
							{/* Sales tax number */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.salesTaxNr}
								extraClasses='ml-3'
								extraStyles={{ textTransform: "uppercase" }}
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.SALESTAXNR")}
								name='salesTaxNr'
								type='text'
							/>
						</div>
						<div className='d-flex justify-content-between'>
							{/* Bank */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.bank}
								extraClasses='ml-3'
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.BANK")}
								name='bank'
								type='text'
							/>
							{/* IBAN */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.bankAccountNr}
								extraClasses='ml-3'
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.BANKACCOUNTNR")}
								name='bankAccountNr'
								type='text'
							/>
							{/* Sales tax number */}
							<Input
								displayInput={true}
								container={false}
								displayValue={this.state.bankAccountName}
								extraClasses='ml-3'
								handleOnChange={this.onChange}
								labelText={this.I18n.get("COMPANY.LABEL.BANKACCOUNTNAME")}
								name='bankAccountName'
								type='text'
							/>
						</div>
					</div>
				</div>

				<div className='row flex-nowrap mt-3 pr-3'>
					{/* LISTVIEW */}
					<Button
						extraClasses='mr-auto'
						onClick={this.onGoBack}
						text={
							!!this.prevLocation
								? this.I18n.get("COMPANY.BUTTON.BACKTOPREVIOUSLOCATION").replace(
										"{1}",
										this.I18n.get(this.prevLocationName)
								  )
								: this.I18n.get("COMPANY.BUTTON.BACKTOLISTVIEW")
						}
						extraStyles={{ marginLeft: "0.8rem" }}
					/>

					{this.state.settingsStatus.message && (
						<div className='bg-light ml-3 p-1'>
							<span className={"text-" + this.state.settingsStatus.type}>
								{this.state.settingsStatus.message}
							</span>
						</div>
					)}
					{!this.isExistingInvoice && (
						<>
							<div className=' mx-3'>
								{/* CANCEL */}
								<Button
									onClick={this.onCancel}
									text={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TEXT")}
									title={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TITLE")}
								/>
							</div>
							<div>
								{/* UPDATE / SAVE */}
								<Button
									onClick={this.onSubmit}
									text={
										this.isExistingCompany
											? this.I18n.get("COMPANY.BUTTON.UPDATE")
											: !!this.prevLocation
											? this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOPREVIOUSLOCATION").replace(
													"{1}",
													this.I18n.get(this.prevLocationName)
											  )
											: this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOLISTVIEW")
									}
									title={
										this.isExistingCompany
											? this.I18n.get("COMPANY.BUTTON.UPDATE")
											: !!this.prevLocation
											? this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOPREVIOUSLOCATION").replace(
													"{1}",
													this.I18n.get(this.prevLocationName)
											  )
											: this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOLISTVIEW")
									}
								/>
							</div>
						</>
					)}
				</div>
			</>
		);
	}
}

export default withFirebase(Company);
