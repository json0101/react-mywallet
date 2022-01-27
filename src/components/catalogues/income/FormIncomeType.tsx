import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ActionFormType from "../../../enums/ActionFormType";
import { apiAxios } from "../../../helpers/ApiAxios";
import { IncomeTypeModel } from "../models/models";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

function FormIncomeType(props: any) {

    const [showActiveButton, setShowActiveButton ]= useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const {action, id, refreshDataFromGrid} = props;
    const [textButton, setTextButton] = useState<string>("");
    const buttonCloseModalRef = useRef<any>(null);
    
    useEffect(() => {
        if(action === ActionFormType.Edit) {
            setShowActiveButton(true);
            setTextButton("Update");
        }
        if(action === ActionFormType.New) {
            setShowActiveButton(false);
            setActive(true);
            setDescription("");
            setTextButton("Save")
        }

    }, [showActiveButton, action, setDescription, setActive]);

    const getData = useCallback(() => {
        apiAxios.getAuth(`/catalogue/income-types/${id}`)
            .then(x => {
               
                if(x.status === 200) {
                    const {description, active} = x.data;
                    setDescription(description);
                    setActive(active);
                }
            })
            .catch(error => {
                if(error.response.data?.message) {
                    MySwal.fire({
                        title: error.response.data?.message,
                        icon: "error"
                    });
                }
            });
    },[id]);

    useEffect(() => {
        if(action === ActionFormType.Edit)
            getData();
    }, [action, getData]);

    const onSubmit = (e: any) =>
    {
        e.preventDefault();
        let data: IncomeTypeModel = new IncomeTypeModel(description,true);

        if(action === ActionFormType.Edit) {
            data.active = active;
            updateExpenseType(data);
        }

        if(action === ActionFormType.New) {
            saveExpenseType(data);
        }
    }

    const updateExpenseType = (expenseType: IncomeTypeModel) => {
        apiAxios.patchAuth(`/catalogue/income-types/${id}`, expenseType)
        .then(x => {
            if(x.status === 200) {
                MySwal.fire({
                    title: 'Updated',
                    icon: "success"
                });

                setDescription("");
                refreshDataFromGrid();
                buttonCloseModalRef.current.click();
            }
        })
        .catch(error => {
            
            if(error.response.data?.message) {
                MySwal.fire({
                    title: error.response.data?.message,
                    icon: "error"
                });
            }
        })
    }

    const saveExpenseType = (expenseType: IncomeTypeModel) => {
        apiAxios.postAuth('/catalogue/income-types', expenseType)
            .then(x => {
                if(x.status === 201) {
                    MySwal.fire({
                        title: "Created",
                        icon: "success"
                    });

                    setDescription("");
                    refreshDataFromGrid();
                    buttonCloseModalRef.current.click();
                }
            })
            .catch(error => {
                console.log(error);
                if(error.response.data?.message) {
                    MySwal.fire({
                        title: error.response.data?.message,
                        icon: "error"
                    });
                }
            })
        }
    
    return (
        <>
            <Form onSubmit={onSubmit}>
                <Row>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={(e) => { setDescription(e.target.value)}} placeholder="Enter Description" />
                    </Form.Group>
                    {showActiveButton === true?
                        <Form.Group className="mb-3" controlId="formActive">
                            <Form.Check type="checkbox" label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
                        </Form.Group> : null
                    }
                </Row>

                <Row className='justify-content-between'>
                    <Col>
                        <Button variant="success" type="submit">
                            {textButton}
                        </Button>
                    </Col>
                    <Col className="text-end">
                        <Button variant="outline-primary" onClick={props.onHide}  ref={buttonCloseModalRef}>Close</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default FormIncomeType;