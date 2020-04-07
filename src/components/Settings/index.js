import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { I18n } from "../../services/I18n/I18n";
import "./../App/index.scss";
import "./index.scss";

class Settings extends Component {
	constructor(props) {
		super(props);
		this.PAGE = "ADMIN";
	}

	handleOnBlur = (event) => {
		if (event.currentTarget.getAttribute("data-input")) {
			this.setState({ [event.currentTarget.name]: event.currentTarget.value });
		}
	};

	handleSubmit = () => {
		// clear the state
		const newState = this.resetObjectValues(this.state, "");
		this.setState({ ...newState });
	};

	handleClear = () => {
		// clear state...
		const newState = this.resetObjectValues(this.state, "");
		this.setState({ ...newState });
		// ...clear input fields
		const dataInputFields = document.querySelectorAll("[data-input]");
		Array.from(dataInputFields).map((field) => (field.value = ""));
	};

	resetObjectValues(ob, resetValue) {
		return Object.keys(ob).reduce((acc, prop) => {
			acc[prop] = resetValue;
			return acc;
		}, {});
	}

	render() {
		return (
			<div>
				<div className='row'>
					<div className='col-lg-8'>
						<fieldset>
							<legend>
								<h1>{I18n.get("ADMIN.ADDRESS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='inputSmall mb-3 ml-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.NAME_INITIALS")}
											aria-label='Initialen'
											name='Initialen'
											data-input='true'
											defaultValue={this.state.Initialen}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
								<div className='inputXSmall mx-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.NAME_INFIX")}
											aria-label='Tussenvoegsel'
											name='Tussenvoegsel'
											data-input
											defaultValue={this.state.Tussenvoegsel}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
								<div className='input mb-3 mr-3 surname'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.NAME_LASTNAME")}
											aria-label='Achternaam'
											name='Achternaam'
											data-input
											defaultValue={this.state.Achternaam}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.ADDRESS")}
											aria-label='Adres'
											name='Adres'
											data-input
											defaultValue={this.state.Adres}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputSmall'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.ZIPCODE")}
											aria-label='PostCode'
											name='PostCode'
											data-input
											defaultValue={this.state.PostCode}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>

								<div className='input mb-3 mx-3 inputRest'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.ADDRESS.CITY")}
											aria-label='Stad'
											name='Stad'
											data-input
											defaultValue={this.state.Stad}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div>
								<div className='row'>
									<div className='input mb-3 mx-3 inputFull'>
										<InputGroup size='sm'>
											<FormControl
												placeholder={I18n.get("ADMIN.ADDRESS.COUNTRY")}
												aria-label='Land'
												name='Land'
												data-input
												defaultValue={this.state.Land}
												onBlur={this.handleOnBlur}></FormControl>
										</InputGroup>
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div className='col-lg-4'>
						<fieldset>
							<legend>
								<h1>{I18n.get("ADMIN.REGISTRATIONS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.REGISTRATIONS.COC_NUMBER")}
											aria-label='KvKNummer'
											name='KvKNummer'
											data-input
											defaultValue={this.state.KvKNummer}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={I18n.get("ADMIN.REGISTRATIONS.VAT_NUMBER")}
											aria-label='BTWNummer'
											name='BTWNummer'
											data-input
											defaultValue={this.state.BTWNummer}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
				<div className='row'>
					<div className='col-lg-12'>
						<fieldset className='mb-0'>
							<legend>
								<h1>{I18n.get("ADMIN.DELIVERYCONDITIONS.TITLE")}</h1>
							</legend>
							<div className='form-group'>
								<textarea
									aria-label='Leveringsvoorwaarden'
									className='form-control'
									cols='30'
									id=''
									name='Leveringsvoorwaarden'
									data-input
									onBlur={this.handleOnBlur}
									placeholder={I18n.get("ADMIN.DELIVERYCONDITIONS.TITLE")}
									rows='3'
									defaultValue={this.state.Leveringsvoorwaarden}></textarea>
							</div>
						</fieldset>
					</div>
					<button className='btn btn-primary mr-3' onClick={this.handleClear}>
						{I18n.get("INVOICES.BUTTONS.CLEAR")}
					</button>
					<button className='btn btn-primary float-right' onClick={this.handleSubmit}>
						{I18n.get("BUTTONS.SAVE")}
					</button>
				</div>
			</div>
		);
	}
}

export default Settings;
