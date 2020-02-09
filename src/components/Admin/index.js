import React, { Component } from "react";
import * as index from "./index.module.scss";

class Admin extends Component {
	render() {
		return (
			<div className={index.containerAdmin}>
				<div className={index.address}>address</div>
				<div className={index.registrations}>registrations</div>
				<div className={index.deliveryconditions}>deliveryconditions</div>
				<div className={index.footer}>footer</div>
			</div>
		);
	}
}

export default Admin;
