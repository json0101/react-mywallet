import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { apiAxios } from "../../helpers/ApiAxios";
import axios from "axios";
import { IExpenseType } from "../catalogues/interfaces/interfaces";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ActionFormType from "../../enums/ActionFormType";
import { ExpenseModel } from "./models/model";
import moment from 'moment';
import ModalApp from "../commons/ModalApp";
import FormExpenseType from "../catalogues/expense/FormExpenseType";

const MySwal = withReactContent(Swal);

function RegisterExpense(props: any) {

    const [showActiveButton, setShowActiveButton ]= useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    
    const [expenseType, setExpenseType] = useState<number>(0);
    const [textButton, setTextButton] = useState<string>("Save");
    const [expenseTypes, setExpenseTypes] = useState<IExpenseType[]>([]);
    const [money, setMoney] = useState<any>(0.00);
    const [observations, setObservations] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [modalShow, setModalShow] = useState<boolean>(false);

    const buttonCloseModalRef = useRef<any>(null);

    const {action=ActionFormType.New, id, refreshDataFromGrid} = props;

    useEffect(() => {

        if(action === ActionFormType.New)
            setShowActiveButton(false);

        if(action === ActionFormType.Edit){

            setTextButton("Update");
            setShowActiveButton(true);
        }
        
    }, [action]);

    const getTypesExpenses = () => {
        let source = axios.CancelToken.source();
        let unmounted = false;

        apiAxios.getAuth(`/catalogue/expense-types/actives`,source.token)
            .then(x => {
                if (x.status === 200 && !unmounted) {
                    let data: IExpenseType[] = x.data;
                    data = data.sort((a: IExpenseType, b: IExpenseType) => a.description > b.description ? 1 : -1);
                    setExpenseTypes(data);
                }

                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
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

    useEffect(() => {
        getTypesExpenses();
    }, []);

    const onSubmit = (e: any) => {
        e.preventDefault();

        const data: ExpenseModel = new ExpenseModel(+money, observations, expenseType, date);
        
        

        if(expenseType === 0) {
            MySwal.fire({
                title: "Select an expense type",
                icon: "error"
            });

            return;
        }

        if(action === ActionFormType.Edit) {
            data.active = active;
            updateExpense(data);
        }

        if(action === ActionFormType.New) {
            saveExpense(data);
        }
    }

    

    const getData = useCallback(() => {
        apiAxios.getAuth(`/transactions/expenses/${id}`)
            .then(x => {
                if(x.status === 200) {
                    const { expense_type,value, observations, active, date} = x.data;
                    
                    

                    setObservations(observations);
                    setActive(active);
                    setExpenseType(+expense_type.id);
                    setMoney(+value);
                    setDate(new Date(moment(date).format("YYYY-MM-DDTHH:mm:ss.sssZ")));
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

    const updateExpense = (expense: ExpenseModel) => {
        apiAxios.patchAuth(`/transactions/expenses/${id}`, expense)
        .then(x => {
            if(x.status === 200) {
                MySwal.fire({
                    title: 'Updated',
                    icon: "success"
                });

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

    const saveExpense = (newExpense: ExpenseModel) => {

        apiAxios.postAuth(`/transactions/expenses`, newExpense)
            .then(x => {
               
                if (x.status === 201) {
                    MySwal.fire({
                        title: "Guardado",
                        icon: "success",
                    });

                    cleanForm();
                }
            })
            .catch((error) => {
                
                if(error.response.data?.message) {
                    MySwal.fire({
                        title: error.response.data?.message,
                        icon: "error"
                    });
                }
            })
    }


    const cleanForm = () => {
        setObservations("");
        setExpenseType(0);
        setMoney(0);
        setDate(new Date());
    }

    const formIncomeType = (
        <FormExpenseType
            action={ActionFormType.New}
            id={0}
            refreshDataFromGrid={getTypesExpenses}
            onHide={() => setModalShow(false)}
        >

        </FormExpenseType>
    );
    
    return (
        <>
            {
                action === ActionFormType.New? 
                <Row>
                    <h1>Register Expense</h1>
                </Row>: null
            }
            
            <Row>
                <Col className="col-lg-12">
                    <Form onSubmit={onSubmit}>

                        <Row>
                             <Form.Group className="mb-3" controlId="formDate">
                                <Form.Label>Date Expense</Form.Label>
                                <Form.Control type="date" value={moment(date).format("yyyy-MM-DD")} onChange={(e) => { setDate(new Date(moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss.sssZ"))) }} placeholder="Enter Date" />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3" controlId="formIncomes">
                                <Form.Label>Expense Type</Form.Label>
                                <Stack direction="horizontal" style={{alignItems: "stretch"}} gap={1}>
                                
                                
                                    <Form.Select aria-label="Income Type" value={expenseType} onChange={(e) => setExpenseType(+e.target.value)}>
                                        <option value={0}>Select an option</option>

                                        {
                                            expenseTypes.length > 0 ? expenseTypes.map(t => {
                                                return <option key={t.id} value={t.id}>{t.description}</option>;
                                            }) : []
                                        }
                                    </Form.Select>
                                    <Button variant="outline-success" onClick={() => setModalShow(true)}>+</Button>
                                </Stack>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3" controlId="formMoney">
                                <Form.Label>Value</Form.Label>
                                <Form.Control type="number" value={money} onChange={(e) => { setMoney(e.target.value) }} placeholder="Enter Money" />
                            </Form.Group>
                        </Row>
                        
                        
                        <Row>
                            <Form.Group className="mb-3" controlId="observations">
                                <Form.Label>Observations</Form.Label>
                                <Form.Control type="text" maxLength={60} value={observations} onChange={(e) => { setObservations(e.target.value) }} placeholder="Enter Observations" />
                            </Form.Group>
                        </Row>

                        {showActiveButton === true?
                            <Row>
                                <Form.Group className="mb-3" controlId="formActive">
                                    <Form.Check type="checkbox" label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
                                </Form.Group>
                            </Row>: null
                        }

                        <Row className='justify-content-between'>
                            <Col>
                                <Button variant="success" type="submit">
                                    {textButton}
                                </Button>
                            </Col>

                            {
                                action === ActionFormType.Edit? 
                                <Col className="text-end">
                                    <Button variant="outline-primary" onClick={props.onHide} ref={buttonCloseModalRef}>Close</Button>
                                </Col>: null
                            }
                        </Row>
                    </Form>
                </Col>
            </Row>
            <ModalApp
                show={modalShow}
                headingText="New Type of Expense"
                component = {formIncomeType}
                onHide={() => setModalShow(false)}
            >
            </ModalApp>
        </>
    );
}

export default RegisterExpense;