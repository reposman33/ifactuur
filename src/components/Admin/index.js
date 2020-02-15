import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import "./../App/index.scss";
import "./index.scss";

class Admin extends Component {
	constructor(props, data) {
		super(props);
		this.getLanguageString = this.props.getLanguageString;
	}

	render() {
		return (
			<div className='container'>
				<div className='row slim'>
					<div className='col-lg-8'>
						<fieldset>
							<legend>
								<h1>{this.getLanguageString("ADMIN.ADDRESS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='inputSmall mb-3 ml-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.NAME_INITIALS")}
											aria-label='Initials'></FormControl>
									</InputGroup>
								</div>
								<div className='inputXSmall mx-3'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.NAME_PREFIX")}
											aria-label='Pre'></FormControl>
									</InputGroup>
								</div>
								<div className='input mb-3 mr-3 surname'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.NAME_LASTNAME")}
											aria-label='Surname'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.ADDRESS")}
											aria-label='Address'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputSmall'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.ZIPCODE")}
											aria-label='PostCode'></FormControl>
									</InputGroup>
								</div>

								<div className='input mb-3 mx-3 inputRest'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.ADDRESS.CITY")}
											aria-label='Stad'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div>
								<div className='row'>
									<div className='input mb-3 mx-3 inputFull'>
										<InputGroup size='sm'>
											<FormControl
												placeholder={this.getLanguageString("ADMIN.ADDRESS.COUNTRY")}
												aria-label='Land'></FormControl>
										</InputGroup>
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div className='col-lg-4'>
						<fieldset>
							<legend>
								<h1>{this.getLanguageString("ADMIN.REGISTRATIONS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.REGISTRATIONS.COC_NUMBER")}
											aria-label='KvK'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl
											placeholder={this.getLanguageString("ADMIN.REGISTRATIONS.VAT_NUMBER")}
											aria-label='BTW'></FormControl>
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
								<h1>{this.getLanguageString("ADMIN.DELIVERYCONDITIONS.TITLE")}</h1>
							</legend>
							<div className='form-group'>
								<textarea
									name='deliveryConditions'
									id=''
									cols='30'
									placeholder={this.getLanguageString("ADMIN.DELIVERYCONDITIONS.TITLE")}
									rows='3'
									className='form-control'></textarea>
							</div>
						</fieldset>
					</div>
					<button className='btn btn-primary float-right'>Save</button>
				</div>
			</div>
		);
	}
}

export default Admin;
