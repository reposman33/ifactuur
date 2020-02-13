import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import "./../App/index.scss";
import "./index.scss";
import Languages from "../I18n";

class Admin extends Component {
	constructor(props) {
		super(props);
		this._Languages = new Languages();
	}

	render() {
		return (
			<div className='container'>
				<div className='row slim'>
					<div className='col-lg-8'>
						<fieldset>
							<legend>
								<h1>{this._Languages.get("ADMIN.ADDRESS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='inputSmall mb-3 ml-3'>
									<InputGroup size='sm'>
										<FormControl placeholder='Initials' aria-label='Initials'></FormControl>
									</InputGroup>
								</div>
								<div className='inputXSmall mx-3'>
									<InputGroup size='sm'>
										<FormControl placeholder='Pre' aria-label='Pre'></FormControl>
									</InputGroup>
								</div>
								<div className='input mb-3 mr-3 surname'>
									<InputGroup size='sm'>
										<FormControl placeholder='Surname' aria-label='Surname'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl placeholder='Address' aria-label='Address'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputSmall'>
									<InputGroup size='sm'>
										<FormControl placeholder='PC' aria-label='PostCode'></FormControl>
									</InputGroup>
								</div>

								<div className='input mb-3 mx-3 inputRest'>
									<InputGroup size='sm'>
										<FormControl placeholder='Stad' aria-label='Stad'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div>
								<div className='row'>
									<div className='input mb-3 mx-3 inputFull'>
										<InputGroup size='sm'>
											<FormControl placeholder='Land' aria-label='Land'></FormControl>
										</InputGroup>
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div className='col-lg-4'>
						<fieldset>
							<legend>
								<h1>{this._Languages.get("ADMIN.REGISTRATIONS.TITLE")}</h1>
							</legend>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl placeholder='KvK' aria-label='KvK'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div className='row'>
								<div className='input mb-3 mx-3 inputFull'>
									<InputGroup size='sm'>
										<FormControl placeholder='BTW' aria-label='BTW'></FormControl>
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
								<h1>{this._Languages.get("ADMIN.DELIVERYCONDITIONS.TITLE")}</h1>
							</legend>
							<div className='form-group'>
								<textarea
									name='deliveryConditions'
									id=''
									cols='30'
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
