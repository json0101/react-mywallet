import { Modal } from "react-bootstrap";

function ModalApp(props: any) {

    const {component, headingText, ...others} = props;
    return (
        <>
            <Modal
                {...others}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {headingText}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {component}
                </Modal.Body>
                
            </Modal>
        </>
    );
}

export default ModalApp;