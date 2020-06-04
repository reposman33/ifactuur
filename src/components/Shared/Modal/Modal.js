import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";

const ModalComponent = (props) => {
	return (
		<Modal centered show={props.show} backdrop={true} onHide={props.closeModal}>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body>{props.content}</Modal.Body>
			<Modal.Footer>{props.printButton}</Modal.Footer>
		</Modal>
	);
};

export { ModalComponent };
