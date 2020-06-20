import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";

const ModalComponent = (props) => {
	return (
		<Modal show={props.showModal} backdrop={true} onHide={props.closeModal}>
			<Modal.Header closeButton={true}>{props.header}</Modal.Header>
			<Modal.Body>{props.body}</Modal.Body>
			<Modal.Footer>{props.footer}</Modal.Footer>
		</Modal>
	);
};

export { ModalComponent };
