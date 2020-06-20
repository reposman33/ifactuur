import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";

const ModalComponent = (props) => {
	return (
		<Modal show={props.showModal} backdrop={true} onHide={props.closeModal}>
<<<<<<< HEAD
			<Modal.Header closeButton={false}>{props.header}</Modal.Header>
=======
			<Modal.Header closeButton={true}>{props.header}</Modal.Header>
>>>>>>> 65a6ac398d4b1a16745b4fa1f530a3a569ea27f9
			<Modal.Body>{props.body}</Modal.Body>
			<Modal.Footer>{props.footer}</Modal.Footer>
		</Modal>
	);
};

export { ModalComponent };
