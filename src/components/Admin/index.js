import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import Languages from "../../services/I18n/I18n";
import API from "../../services/API/API";
import "./../App/index.scss";
import "./index.scss";

class Admin extends Component {
	_Languages;
	PAGE;
	inputFields;

	constructor(props, data) {
		super(props);
		this.PAGE = "ADMIN";
		this.state = {};
		this.inputFields = {
			Initialen: "",
			Tussenvoegsel: "",
			Achternaam: "",
			Adres: "",
			PostCode: "",
			Stad: "",
			Land: "",
			KvKNummer: "",
			BTWNummer: "",
			Leveringsvoorwaarden: ""
		};
		this.dataFields = Object.keys(this.inputFields);
		const _data = API.getPage(this.PAGE);
		if (_data) {
			this.inputFields = _data;
		}
	}

	handleOnBlur = event => {
		const field = event.currentTarget.getAttribute("name");
		if (this.dataFields.includes(field)) {
			this.setState({ [field]: event.currentTarget.value });
		}
	};

	handleSubmit = () => {
		API.savePage({ [this.PAGE]: this.state });
		this.setState({ ...this.inputFields });
	};

	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-lg-8'>
						<fieldset>
							<legend>
								<h1>{Languages.get("ADMIN.ADDRESS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='inputSmall mb-3 ml-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.NAME_INITIALS")}
											aria-label='Initialen'
											name='Initialen'
											defaultValue={this.inputFields.Initialen}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
								<div className='inputXSmall mx-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.NAME_INFIX")}
											aria-label='Tussenvoegsel'
											name='Tussenvoegsel'
											defaultValue={this.inputFields.Tussenvoegsel}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
								<div className='input mb-3 mr-3 surname'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.NAME_LASTNAME")}
											aria-label='Achternaam'
											name='Achternaam'
											defaultValue={this.inputFields.Achternaam}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.ADDRESS")}
											aria-label='Adres'
											name='Adres'
											defaultValue={this.inputFields.Adres}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputSmall'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.ZIPCODE")}
											aria-label='PostCode'
											name='PostCode'
											defaultValue={this.inputFields.PostCode}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>

								<div className='input mb-3 mx-3 inputRest'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.ADDRESS.CITY")}
											aria-label='Stad'
											name='Stad'
											defaultValue={this.inputFields.Stad}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div>
								<div className='row'>
									<div className='input mb-3 mx-3 inputFull'>
										<InputGroup size='sm'>
											<FormControl
												placeholder={Languages.get("ADMIN.ADDRESS.COUNTRY")}
												aria-label='Land'
												name='Land'
												defaultValue={this.inputFields.Land}
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
								<h1>{Languages.get("ADMIN.REGISTRATIONS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.REGISTRATIONS.COC_NUMBER")}
											aria-label='KvKNummer'
											name='KvKNummer'
											defaultValue={this.inputFields.KvKNummer}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={Languages.get("ADMIN.REGISTRATIONS.VAT_NUMBER")}
											aria-label='BTWNummer'
											name='BTWNummer'
											defaultValue={this.inputFields.BTWNummer}
											onBlur={this.handleOnBlur}></FormControl>
									</InputGroup>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
				<div className='row mt-8'>
					<div className='col-lg-12'>
						<fieldset className='mb-0'>
							<legend>
								<h1>{Languages.get("ADMIN.DELIVERYCONDITIONS.TITLE")}</h1>
							</legend>
							<div className='form-group'>
								<textarea
									aria-label='Leveringsvoorwaarden'
									className='form-control'
									cols='30'
									id=''
									name='Leveringsvoorwaarden'
									onBlur={this.handleOnBlur}
									placeholder={Languages.get("ADMIN.DELIVERYCONDITIONS.TITLE")}
									rows='3'
									defaultValue={this.inputFields.Leveringsvoorwaarden}></textarea>
							</div>
						</fieldset>
					</div>
					<button className='btn btn-primary' onClick={this.handleSubmit}>
						{Languages.get("BUTTONS.SAVE")}
					</button>
				</div>
			</div>
		);
	}
}

export default Admin;
