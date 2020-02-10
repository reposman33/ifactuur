import React, { Component } from "react";
import * as index from "./index.module.scss";

class Admin extends Component {
	render() {
		return (
			<div className={index.container}>
				<div className='row high'>
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
