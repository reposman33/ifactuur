import React, { Component } from "react";

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
							<div>
								<label htmlFor=''>Naam</label>
								<input type='text' />
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
