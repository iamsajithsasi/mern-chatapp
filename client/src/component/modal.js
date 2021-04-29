import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalPop(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size={props?.size ? props.size : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className="text-capitalize">{props.modalhead}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.modalcontent}</Modal.Body>
    </Modal>
  );
}
