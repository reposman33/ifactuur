import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import "./../App/index.scss";
import "./index.scss";

class Admin extends Component {
	render() {
		return (
			<div className='container'>
				<div className='row slim'>
					<div className='col-lg-8'>
						<fieldset>
							<legend>
								<h1>Address</h1>
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
								<div className='input mb-3 mx-3'>
									<InputGroup size='sm'>
										<FormControl placeholder='Address' aria-label='Address'></FormControl>
									</InputGroup>
								</div>
							</div>
							<div>
								<label htmlFor=''>Naam</label>
								<input type='text' />
							</div>
							<div>
								<label htmlFor=''>Naam</label>
								<input type='text' />
							</div>
						</fieldset>
					</div>
					<div className='col-lg-4'>
						<fieldset>
							<legend>
								<h1>Registrations</h1>
							</legend>
						</fieldset>
					</div>
				</div>
			</div>
		);
	}
}

export default Admin;
