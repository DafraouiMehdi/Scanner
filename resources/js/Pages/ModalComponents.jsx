import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DwtScanner from './DwtScanner';

const ModalComponents = () => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Scanner une pièce jointe
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <b>Numérisation Bureau d'order</b>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <DwtScanner  close={handleClose}/>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalComponents;
