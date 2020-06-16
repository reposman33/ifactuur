import React from "react";
import { withFirebase } from "../../Firebase";
import { ModalComponent } from "../Shared/Modal/Modal";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { Select } from "../Shared/Select/select";
import { Input } from "../Shared/Input/input";
import { Textarea } from "../Shared/Textarea/textarea";
import { Button } from "../Shared/Button/button";
import { LanguagePicker } from "../LanguagePicker/languagePicker";
import "./settings.module.scss";

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();
		this.state = {
			titles: [
				{ title: this.I18n.get("TITLES.MR"), id: 1 },
				{ title: this.I18n.get("TITLES.MRS"), id: 2 },
				{ title: this.I18n.get("TITLES.THEY"), id: 3 },
			],
			companies: [],
			showModal: false,
		};
		// State keys and transform functions to apply when persisting to fireStore .
		this.persistFields = {
			title: (fieldValue) => fieldValue,
			firstName: (fieldValue) => fieldValue,
			lastName: (fieldValue) => fieldValue,
			address: (fieldValue) => fieldValue,
			city: (fieldValue) => fieldValue,
			zipcode: (fieldValue) => fieldValue,
			country: (fieldValue) => fieldValue,
			companyId: (fieldValue) => fieldValue,
			lastlogin: (fieldValue) => fieldValue,
			deliveryConditions: (fieldValue) => fieldValue,
			password: (fieldValue) => fieldValue, // hash the password
		};
		this.isExistingUserSetting = false;
	}

	componentDidMount = () => {
		const settingsPromise$ = [];
		settingsPromise$.push(this.props.firebase.getUserSettings());
		settingsPromise$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
		Promise.all(settingsPromise$).then((values) => {
			if (values[0]) {
				this.isExistingUserSetting = true;
				// populate statekeys (as defined in this.persistFields) with usersettings
				Object.keys(this.persistFields).map((key) => this.setState({ [key]: values[0][key] }));
				this.setState({ ID: values[0].ID });
			} else {
				this.isExistingUserSetting = false;
				// set state keys (as defined in this.persistFields) to undefined
				Object.keys(this.persistFields).map((key) => this.setState({ [key]: undefined }));
			}
			this.setState({ companies: values[1], showModal: !this.isExistingUserSetting });
		});
	};

	// onSubmit
	onSubmit = () => {
		const settings = {};
		Object.keys(this.persistFields).map(
			// filter keys and optionally convert state prop values
			(key) => {
				if (this.state[key]) {
					settings[key] = this.persistFields[key](this.state[key]);
				}
				return null;
			}
		);
		// add the current user id!
		settings.userId = this.props.firebase.auth.currentUser.uid;
		console.log("submitting ", settings);
		this.props.firebase.addDocumentToCollection("users", settings, this.state.ID).then((docRef) => {
			console.log(`document ${this.state.ID ? "updated" : "added"}`);
		});
	};

	/**
	 * handle input of most input fields
	 * @param{string} name - name of both the inputfield & stateKey
	 * @param{string} value - value of user input
	 */
	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	/**
	 *  hide the modal
	 */
	hideModal = () => this.setState({ showModal: false });

	setLanguage = (lang) => {
		this.I18n.setLanguage(lang);
		this.setState({ language: lang });
	};
	render() {
		return this.state.showModal ? (
			<ModalComponent
				header={<LanguagePicker setLanguage={this.setLanguage} />}
				body={<div className='text-info'>{this.I18n.get("USERSETTINGS.MODAL.TEXT")}</div>}
				footer={
					<Button
						className='btn btn-info'
						text={this.I18n.get("USERSETTINGS.MODAL.BUTTON.TEXT")}
						onClick={this.hideModal}
					/>
				}
				show={this.state.showModal}
				closeModal={this.hideModal}
			/>
		) : (
			<div>
				<div className='row'>
					<div className='col d-flex flex-column p-3 w-75'>
						<div className='d-flex flex-row w-100'>
							{/* TITLE */}
							<Select
								container={false}
								data={this.state.titles}
								displayInput={true}
								displayKey='title'
								displayValue={this.state.title}
								extraClasses='w-25'
								handleOnChange={this.onChange}
								labelText={this.I18n.get("USERSETTINGS.LABEL.TITLE")}
								name='title'
								valueKey='id'
							/>
							{/* FIRSTNAME */}
							<Input
								container={false}
								type='text'
								extraClasses='w-50 ml-3'
								displayInput={true}
								displayValue={this.state.firstName}
								handleOnChange={this.onChange}
								name='firstName'
								labelText={this.I18n.get("USERSETTINGS.LABEL.FIRSTNAME")}
							/>
							{/* LASTNAME */}
							<Input
								container={false}
								type='text'
								extraClasses='w-50 mx-3'
								displayInput={true}
								displayValue={this.state.lastName}
								handleOnChange={this.onChange}
								name='lastName'
								labelText={this.I18n.get("USERSETTINGS.LABEL.LASTNAME")}
							/>
						</div>
					</div>
					<div className='col d-flex p-3 w-25'>
						{/* COMPANIES */}
						<Select
							buttonText={this.I18n.get("INVOICE.BUTTON.NEW_COMPANY")}
							container={false}
							data={this.state.companies}
							extraClasses='w-100'
							displayInput={true}
							displayKey='name'
							handleOnChange={this.onChange}
							initialSelectedValue={this.state.companies.reduce(
								(acc, c) => (c.id === this.state.companyId ? c.name : acc),
								0
							)}
							labelText={this.I18n.get("USERSETTINGS.LABEL.COMPANY")}
							name='companyId'
							onButtonClick={() => this.props.history.push({ pathname: ROUTES.COMPANY })}
							valueKey='id'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-column w-100'>
						<div className='d-flex flex-row justify-content-center'>
							{/* ADDRESS */}
							<Input
								container={false}
								type='text'
								extraClasses='mx-3 w-100'
								displayInput={true}
								displayValue={this.state.address}
								handleOnChange={this.onChange}
								name='address'
								labelText={this.I18n.get("USERSETTINGS.LABEL.ADDRESS")}
							/>
						</div>
						<div className='d-flex flex-row my-3'>
							{/* ZIPCODE */}
							<Input
								container={false}
								type='text'
								extraClasses='mx-3'
								displayInput={true}
								displayValue={this.state.zipcode}
								handleOnChange={this.onChange}
								name='zipcode'
								labelText={this.I18n.get("USERSETTINGS.LABEL.ZIPCODE")}
							/>
							{/* CITY */}
							<Input
								container={false}
								type='text'
								extraClasses='mr-3'
								displayInput={true}
								displayValue={this.state.city}
								handleOnChange={this.onChange}
								name='city'
								labelText={this.I18n.get("USERSETTINGS.LABEL.CITY")}
							/>
							{/* COUNTRY */}
							<Input
								container={false}
								type='text'
								extraClasses='mr-3'
								displayInput={true}
								displayValue={this.state.country}
								handleOnChange={this.onChange}
								name='country'
								labelText={this.I18n.get("USERSETTINGS.LABEL.COUNTRY")}
							/>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-column w-100 p-3'>
						<Textarea
							cols='90'
							displayInput={true}
							displayValue={this.state.deliveryConditions}
							extraClasses='mx-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("USERSETTINGS.LABEL.DELIVERYCONDITIONS")}
							name='deliveryConditions'
							rows='10'
						/>
					</div>
				</div>
				<div className='row pt-3'>
					<div className='d-flex w-100 mt-3 justify-content-end'>
						<Button
							extraStyles={{ marginRight: "0.8rem", marginTop: "-2rem" }}
							onClick={this.onSubmit}
							text={
								this.isExistingUserSetting
									? this.I18n.get("USERSETTINGS.BUTTON.UPDATE")
									: this.I18n.get("USERSETTINGS.BUTTON.SAVE")
							}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default withFirebase(Settings);
