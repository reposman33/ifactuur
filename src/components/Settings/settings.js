import React from "react";
import { firebaseContextConsumer } from "../../Firebase";
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
		// to temporarily save the state when switching between pages we use services/API/storage.js via contextAPI
		this.storage = undefined; // this.storage to be set in componentDidMount

		this.state = {
			address: "",
			title: "",
			firstName: "",
			lastName: "",
			city: "",
			zipcode: "",
			country: "",
			companyName: "",
			deliveryConditions: "",
			// quick hack to set the (I18n) titles here, not in fireStore
			titles: [
				{ title: this.I18n.get("TITLES.MR"), id: 1 },
				{ title: this.I18n.get("TITLES.MRS"), id: 2 },
				{ title: this.I18n.get("TITLES.THEY"), id: 3 },
			],
			companies: [],
			showModal: this.props.location.state && this.props.location.state.showModal,
			// to display messages to user we use this construct. type equals any Bootstrap 4.4.1 color class for text: https://getbootstrap.com/docs/4.4/utilities/colors/
			settingsStatus: {
				type: undefined,
				message: "",
			},
			ID: undefined, // Document id (20 character fireStore generated Id)
		};
		// state values to persist and their transform functions to apply when persisting.
		this.persistFields = {
			title: (fieldValue) => fieldValue,
			firstName: (fieldValue) => fieldValue,
			lastName: (fieldValue) => fieldValue,
			address: (fieldValue) => fieldValue,
			city: (fieldValue) => fieldValue,
			zipcode: (fieldValue) => fieldValue,
			country: (fieldValue) => fieldValue,
			companyName: (fieldValue) => fieldValue,
			deliveryConditions: (fieldValue) => fieldValue,
		};
		this.isExistingUserSetting = false;

		// we don't use fancy validation - uase this to determine validity of fields
		this.assertFieldValid = {
			title: (fieldValue) => fieldValue.length > 0,
			firstName: (fieldValue) => fieldValue.length > 0,
			lastName: (fieldValue) => fieldValue.length > 0,
			address: (fieldValue) => fieldValue.length > 0,
			city: (fieldValue) => fieldValue.length > 0,
			zipcode: (fieldValue) => fieldValue.length > 0,
			country: (fieldValue) => fieldValue.length > 0,
			companyName: (fieldValue) => fieldValue.length > 0,
			deliveryConditions: (fieldValue) => fieldValue.length > 0,
		};
	}

	componentDidMount = () => {
		const settingsPromise$ = [];
		// retrieve values
		settingsPromise$.push(this.props.firebase.getUserSettings());
		settingsPromise$.push(this.props.firebase.getCollection("companies", "name", ["name"]));
		Promise.all(settingsPromise$).then((values) => {
			let stateValues;
			if (values[0]) {
				this.isExistingUserSetting = true;
				// populate object with retrieve usersettings (as defined in this.persistFields)
				stateValues = Object.keys(this.persistFields).reduce((acc, key) => {
					acc[key] = values[0][key];
					return acc;
				}, {});
				// add the 20 character fireStore generated Id
				stateValues.ID = values[0].ID;
			} else {
				this.isExistingUserSetting = false;
				// set state keys (as defined in this.persistFields) to undefined since there is nothing retrieved
				stateValues = Object.keys(this.persistFields).reduce((acc, key) => {
					acc[key] = "";
					return acc;
				}, {});
			}
			this.setState((state) => ({
				...state,
				...stateValues,
				companies: values[1],
			}));

			// There might be stored session from an earlier visit. Retrieve the (session)storage
			this.storage = this.context;
			// copy stored statevalues to state
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
	 * When user clicks 'New company' store the current state so (s)he can continue when returning and switch to Company component
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
		// render Company component. prevLocation: return to this location when clicking Back / Save button; prevLocationName: display this text in Back / Save Button
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			params: {
				prevLocation: this.props.location.pathname,
				prevLocationName: "ROUTENAME.SETTINGS",
			},
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
				acc = this.assertFieldValid[key](this.state[key]) // check if field is valid...
					? Object.assign(acc, { [key]: this.persistFields[key](this.state[key]) }) // if so, convert string to correct type
					: Object.assign(acc, { error: { status: true, keys: [...acc.error.keys, key] } }); // else error
				return acc;
			},
			{ error: { status: false, keys: [] } }
		);
	};

	/**
	 * @param{object} settings - the userSettings. Pass if no error, setState if error
	 * @returns{boolean|object} - false in case of error | userSettings object if no error
	 * @sideEffect - sets this.state.settingsStatus if settings is not valid
	 */
	checkSettings = (settings) => {
		if (settings.error.status) {
			this.setStatusMessage(
				"danger",
				this.I18n.get("USERSETTINGS.SUBMIT.ERROR.MISSINGFIELDVALUES") +
					" [ " +
					settings.error.keys.join(", ") +
					" ]"
			);
			return settings;
		} else {
			return settings;
		}
	};

	/**
	 * @param{boolean|object} false|invoice - this param is false if settings is invalid | param is the settings if settings is valid.
	 * @returns void - calls fireStore as an sideEffect
	 */
	storeSettings = (settings) => {
		if (settings.error.status === false) {
			// We don't want to store the error info...
			delete settings.error;
			// add the userId
			settings.userId = this.props.firebase.auth.currentUser.uid;
			this.props.firebase
				// ... don't forget to add the default statustitle
				.addDocumentToCollection("users", settings, this.state.ID)
				.then((docRef) => {
					console.log(`document ${docRef ? docRef.id + " added" : "updated"}`);
					// remove the temporary state
					this.storage.remove("settingsState");
					// update statusMessage
					this.setStatusMessage(
						"success",
						this.state.ID
							? this.I18n.get("STATUSMESSAGE.DOCUMENTUPDATED")
							: this.I18n.get("STATUSMESSAGE.DOCUMENTADDED")
					);
				})
				.catch((e) => {
					console.log("ERROR: ", e);
					this.setStatusMessage("danger", e.message);
				});
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

	/**
	 * After an action, display message to user
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

	onCancel = (e) => {
		this.storage.remove("settingsState");
		// React-Router has no Refresh functionality. This hack solves it
		this.props.history.push("/temp");
		this.props.history.goBack();
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
				showModal={this.state.showModal}
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
							displayValue={this.state.companyName}
							labelText={this.I18n.get("USERSETTINGS.LABEL.COMPANY")}
							name='companyName'
							onButtonClick={this.handleNewCompany}
							valueKey='ID'
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
				<div className='row justify-content-end align-items-baseline flex-nowrap pr-2 pt-3'>
					<div className='bg-light'>
						{this.state.settingsStatus.message ? (
							<span className={"text-" + this.state.settingsStatus.type}>
								{this.state.settingsStatus.message}
							</span>
						) : null}
					</div>
					<div className=' mx-3'>
						<Button
							onClick={this.onCancel}
							text={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TEXT")}
							title={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TITLE")}
						/>
					</div>
					<div>
						<Button
							onClick={this.onSubmit}
							text={
								this.isExistingUserSetting
									? this.I18n.get("USERSETTINGS.BUTTON.UPDATE.TEXT")
									: this.I18n.get("USERSETTINGS.BUTTON.SAVE.TEXT")
							}
							title={this.I18n.get("USERSETTINGS.BUTTON.UPDATE.TITLE")}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default firebaseContextConsumer(Settings);
