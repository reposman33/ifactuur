import React, { Component } from "react";
import "./index.scss";

class Admin extends Component {
	render() {
		return (
			<div className='containerAdmin'>
				<div className='address'>address</div>
				<div className='registrations'>registrations</div>
				<div className='deliveryconditions'>deliveryconditions</div>
				<div className='footer'>footer</div>
			</div>
		);
	}
}

export default Admin;
