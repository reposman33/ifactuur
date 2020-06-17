import React from "react";
import { withFirebase } from "../../Firebase";
import { PersistenceContext } from "../../constants/contexts";
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
	static contextType = PersistenceContext;

	constructor(props) {
		super(props);

		this.I18n = new I18n();
		this.storage = undefined; // to be set in componentDidMount

		this.state = {
			address: undefined,
			title: undefined,
			firstName: undefined,
			lastName: undefined,
			city: undefined,
			zipcode: undefined,
			country: undefined,
			companyId: undefined,
			deliveryConditions: undefined,
			titles: [
				{ title: this.I18n.get("TITLES.MR"), id: 1 },
				{ title: this.I18n.get("TITLES.MRS"), id: 2 },
				{ title: this.I18n.get("TITLES.THEY"), id: 3 },
			],
			companies: [],
			showModal: false,
			settingsStatus: {
				error: false,
				message: "",
			},
			userId: undefined, // the user Id (as defined in user document
			ID: undefined, // the document id (as defined by fireStore)
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
			companyId: parseInt,
			deliveryConditions: (fieldValue) => fieldValue,
			userId: (fieldValue) => fieldValue,
		};
		this.isExistingUserSetting = false;
	}

	componentDidMount = () => {
		const settingsPromise$ = [];
		settingsPromise$.push(this.props.firebase.getUserSettings());
		settingsPromise$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
		Promise.all(settingsPromise$).then((values) => {
			let stateValues;
			if (values[0]) {
				this.isExistingUserSetting = true;
				// populate statekeys (as defined in this.persistFields) with usersettings
				stateValues = Object.keys(this.persistFields).reduce((acc, key) => {
					acc[key] = values[0][key];
					return acc;
				}, {});
				stateValues.ID = values[0].ID;
			} else {
				this.isExistingUserSetting = false;
				// set state keys (as defined in this.persistFields) to undefined
				stateValues = Object.keys(this.persistFields).reduce((acc, key) => {
					acc[key] = undefined;
					return acc;
				}, {});
			}
			this.setState((state) => ({
				...state,
				...stateValues,
				companies: values[1],
			}));
			// retrieve the (session)storage class
			this.storage = this.context;
			// copy stored state from sessionstorage to state
			const storedState = this.storage.get("settingsState");
			if (storedState) {
				this.setState((state) => ({
					...state,
					...storedState,
				}));
			}
		});
	};

	/**
	 * When user clicks 'New company' store current state and switch to Company component
	 */
	handleNewCompany = () => {
		// copy the state values that will be eventually stored to temporary storage. To be picked up when returning from creating a new company
		const persistFields = Object.keys(this.persistFields);
		// store current state under key in (session)Storage
		const storeValues = persistFields.reduce((acc, persistField) => {
			acc[persistField] = this.state[persistField];
			return acc;
		}, {});
		storeValues.ID = this.state.ID;

		this.storage.set("settingsState", storeValues);
		// render Company component
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			params: { prevLocation: this.props.location.pathname, prevLocationName: "ROUTENAME.SETTINGS" },
		});
	};

	/**
	 * submit the invoice
	 */
	onSubmit = () => this.storeSettings(this.checkSettings(this.onCreateSettings()));

	/**
	 * Check is all fields are valid, convert to correct type
	 * @returns{object} settings - the userSettings, optionally with an error key
	 */
	onCreateSettings = () => {
		return Object.keys(this.persistFields).reduce(
			(acc, key) => {
				acc = this.assertFieldOfType[key](this.state[key]) // check if field is valid...
					? Object.assign(acc, { [key]: this.persistFields[key](this.state[key]) }) // if so, convert string to correct type
					: Object.assign(acc, { error: true, keys: [...acc.keys, key] }); // else error
				return acc;
			},
			{ eror: false, keys: [] }
		);
	};

	/**
	 * @param{object} settings - the userSettings. Pass if no error, setState if error
	 * @returns{boolean|object} - false in case of error | userSettings object if no error
	 * @sideEffect - sets this.state.settingsStatus if settings is not valid
	 */
	checkSettings = (settings) => {
		if (settings.error) {
			console.log("ERROR: ", settings);
			this.setState({
				settingsStatus: {
					error: true,
					message:
						this.I18n.get("USERSETTINGS.SUBMIT.ERROR.MISSINGFIELDVALUES") +
						" [ " +
						settings.keys.join(", ") +
						" ]",
				},
			});
			return false;
		} else {
			return settings;
		}
	};

	/**
	 * @param{boolean|object} false|invoice - this param is false if settings is invalid | param is the settings if settings is valid.
	 * @returns void - calls fireStore as an sideEffect
	 */
	storeSettings = (settings) => {
		if (settings) {
			// add the default statustitle
			this.props.firebase
				.addDocumentToCollection("users", settings, settings.ID)
				.then((docRef) => {
					console.log("document ", docRef.id, " added");
					// remove the temporary state
					this.storage.remove("settingsState");
				})
				.catch((e) => console.log("ERROR: ", e));
		}
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
							onButtonClick={this.handleNewCompany}
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
				<div className='row justify-content-end align-items-baseline pr-2 pt-3'>
					<div className='text-white mr-3'>
						{this.state.settingsStatus.error && this.state.settingsStatus.message}
					</div>
					<div>
						<Button
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
