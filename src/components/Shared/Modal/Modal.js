import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";

const ModalComponent = (props) => {
	return (
		<Modal centered show={props.show} backdrop={true} onHide={props.closeModal}>
			<Modal.Header closeButton>{props.header}</Modal.Header>
			<Modal.Body>{props.body}</Modal.Body>
			<Modal.Footer>{props.footer}</Modal.Footer>
		</Modal>
	);
};

export { ModalComponent };
