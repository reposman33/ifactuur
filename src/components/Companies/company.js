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
		// State keys and transform functions to apply.
		this.persistFields = {
			address: (fieldValue) => fieldValue,
			bank: (fieldValue) => fieldValue,
			bankAccountNr: (fieldValue) => fieldValue,
			bankAccountNameHolder: (fieldValue) => fieldValue,
			btwnr: (fieldValue) => fieldValue.toUpperCase(),
			salesTaxNr: (fieldValue) => fieldValue.toUpperCase(),
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
		this.isExistingCompany = !!(!!this.props.location.state && this.props.location.state.id);
	}

	componentDidMount = () => {
		if (!this.isExistingCompany) {
			// new company, assign new id
			this.props.firebase.getNewFieldValue("companies", "id").then((value) =>
				this.setState({
					id: value[0],
				})
			);
		} else {
			// assign all keys of retrieved document to state
			this.props.firebase.getCompany(this.props.location.state.id).then((doc) => {
				Object.keys(doc).map((documentKey) => this.setState({ [documentKey]: doc[documentKey] }));
				this.setState({ ID: doc.ID });
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

		this.props.firebase.addDocumentToCollection("companies", company, this.state.ID).then((docRef) => {
			console.log(`document ${this.state.ID ? "updated" : "added"}`);
			this.onGoBack();
		});
	};

	render() {
		return (
			<>
				<div className='row'>
					<div className={"col d-flex flex-column " + styles.noBorderBottom}>
						<div className='d-flex flex-row w-100 mb-3'>
							{/* COMPANY NAME */}
							<Input
								type='text'
								extraClasses='w-50 mr-3'
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
								displayInput={true}
								displayValue={this.state.address}
								handleOnChange={this.onChange}
								name='address'
								labelText={this.I18n.get("COMPANY.LABEL.ADDRESS")}
							/>
						</div>
						<div className='d-flex flex-row w-100'>
							{/* CITY */}
							<Input
								type='text'
								extraClasses='w-50 mr-3'
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
								displayInput={true}
								displayValue={this.state.country}
								handleOnChange={this.onChange}
								name='country'
								labelText={this.I18n.get("COMPANY.LABEL.COUNTRY")}
							/>
						</div>
					</div>
				</div>
				<div className='mb-3'>
					<div className={"col d-flex flex-column " + styles.noBorderTop}>
						<div className='d-flex justify-content-between pr-3 mr-3'>
							<span className='d-flex align-items-center'>
								<FontAwesomeIcon size='2x' icon='user-tie' />
							</span>
							{/* CONTACT TITEL */}
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

							<div className='d-flex flex-row w-25'>
								{/* TELEPHONE */}
								<span className='d-flex align-items-center mt-3'>
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
						<div className='d-flex flex-row'>
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
										extraClasses='w-75'
										displayInput={true}
										displayValue={this.state.email}
										handleOnChange={this.onChange}
										name='email'
										labelText={this.I18n.get("COMPANY.LABEL.EMAIL")}
									/>
								</div>
							</div>
						</div>
						<div className='d-flex flex-row justify-content-between'>
							<div className='d-flex flex-column w-100 ml-3 align-content-center'>
								<div className='d-flex justify-content-between'>
									{/* KvK number */}
									<Input
										displayInput={true}
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
										displayValue={this.state.salesTaxNr}
										extraClasses='ml-3'
										extraStyles={{ textTransform: "uppercase" }}
										handleOnChange={this.onChange}
										labelText={this.I18n.get("COMPANY.LABEL.SALESTAXNR")}
										name='salesTaxNr'
										type='text'
									/>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-between'>
							{/* Button Overview */}
							<Button
								onClick={this.onGoBack}
								text={
									!!this.prevLocation
										? this.I18n.get("COMPANY.BUTTON.BACKTOPREVIOUSLOCATION").replace(
												"{1}",
												this.I18n.get(this.prevLocation)
										  )
										: this.I18n.get("COMPANY.BUTTON.BACKTOLISTVIEW")
								}
							/>
							{/* Button Save */}
							<Button
								onClick={this.onSubmit}
								text={
									this.isExistingCompany
										? this.I18n.get("COMPANY.BUTTON.UPDATE")
										: !!this.prevLocation
										? this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOPREVIOUSLOCATION").replace(
												"{1}",
												this.I18n.get(this.prevLocation)
										  )
										: this.I18n.get("COMPANY.BUTTON.SAVEANDBACKTOLISTVIEW")
								}
								extraClasses='float-right'
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default withFirebase(Company);
