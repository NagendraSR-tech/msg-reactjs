import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const LoadModal = () => {
  const [modalOpen, setModalOpen] = useState(true);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmitOk = () => {
    toggleModal();
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        size="lg"
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggleModal}>
          <span>i</span> Disclaimer
        </ModalHeader>
        <ModalBody>
          <p>
            Sizing information shown are estimates only and do not constitute a
            quote or an offer by SAP.
            <br />
            Whilst every care is taken to ensure the sizing information is
            correct, no responsibility is accepted by SAP for its accuracy.
          </p>
          <p>
            Contact SAP if you need assistance or additional information on
            sizing.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="btn-sm" onClick={handleSubmitOk}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LoadModal;
