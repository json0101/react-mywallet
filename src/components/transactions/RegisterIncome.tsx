import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { apiAxios } from "../../helpers/ApiAxios";
import axios from "axios";
import { IIncomeType } from "../catalogues/interfaces/interfaces";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ActionFormType from "../../enums/ActionFormType";
import { IncomeModel } from "./models/model";
import moment from 'moment';

const MySwal = withReactContent(Swal);

function RegisterIncome(props: any) {

    const [showActiveButton, setShowActiveButton ]= useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    const [incomeType, setIncomeType] = useState<number>(0);
    const [textButton, setTextButton] = useState<string>("Save");
    const [incomeTypes, setIncomeTypes] = useState<IIncomeType[]>([]);
    const [money, setMoney] = useState<any>(0.00);
    const [observations, setObservations] = useState("");
    const buttonCloseModalRef = useRef<any>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const {action=ActionFormType.New, id, refreshDataFromGrid} = props;

    useEffect(() => {

        if(action === ActionFormType.New)
            setShowActiveButton(false);

        if(action === ActionFormType.Edit)
            setShowActiveButton(true);
        
    }, [action]);

    useEffect(() => {
        setTextButton("Save");

        let source = axios.CancelToken.source();
        let unmounted = false;

        apiAxios.getAuth(`/catalogue/income-types`,source.token)
            .then(x => {
                if (x.status === 200 && !unmounted) {
                    let data: IIncomeType[] = x.data;
                    data = data.sort((a: IIncomeType, b: IIncomeType) => a.description > b.description ? 1 : -1);
                    setIncomeTypes(data);
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
    },[setTextButton]);

    const onSubmit = (e: any) => {
        e.preventDefault();

        const data: IncomeModel = new IncomeModel(+money,observations,+incomeType, date);
            

        if(incomeType === 0) {
            MySwal.fire({
                title: "Select an income type",
                icon: "error"
            });

            return;
        }


        if(action === ActionFormType.Edit) {
            data.active = active;
            updateIncome(data);
        }

        if(action === ActionFormType.New) {
            saveIncome(data);
        }
        
    }

    const getData = useCallback(() => {
        apiAxios.getAuth(`/transactions/incomes/${id}`)
            .then(x => {
                if(x.status === 200) {
                    const {income_type ,value, observations, active} = x.data;
                    

                    setObservations(observations);
                    setActive(active);
                    setIncomeType(+income_type.id);
                    setMoney(+value);
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

    const updateIncome = (income: any) => {
        apiAxios.patchAuth(`/transactions/incomes/${id}`, income)
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

    const saveIncome = (newIncome: any) => {

        apiAxios.postAuth(`/transactions/incomes`, newIncome)
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

    useEffect(() => {
        if(action === ActionFormType.Edit)
            getData();
    }, [action, getData]);

    
    
    const cleanForm = () => {
        setObservations("");
        setIncomeType(0);
        setMoney(0);
        setDate(new Date());
    }

    return (
        <>
            {
                action === ActionFormType.New? 
                <Row>
                    <h1>Register Income</h1>
                </Row>: null
            }
            
            <Row>
                <Col className="col-lg-12">
                    <Form onSubmit={onSubmit}>
                        <Row>
                             <Form.Group className="mb-3" controlId="formDate">
                                <Form.Label>Date Income</Form.Label>
                                <Form.Control type="date" value={moment(date).format("yyyy-MM-DD")} onChange={(e) => { setDate(new Date(moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss.sssZ"))) }} placeholder="Enter Date" />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3" controlId="formIncomes">
                                <Form.Label>Income Type</Form.Label>
                                <Form.Select aria-label="Income Type" value={incomeType} onChange={(e) => setIncomeType(+e.target.value)}>
                                    <option value={0}>Select an option</option>

                                    {
                                        incomeTypes.length > 0 ? incomeTypes.map(t => {
                                            return <option key={t.id} value={t.id}>{t.description}</option>;
                                        }) : []
                                    }
                                </Form.Select>
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
        </>
    )
}

export default RegisterIncome;