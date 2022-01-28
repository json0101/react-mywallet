import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import ActionFormType from "../../enums/ActionFormType";
import { apiAxios } from "../../helpers/ApiAxios";
import { IExpense } from "./interfaces/interface";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegisterExpense from "./RegisterExpense";
import ModalApp from "../commons/ModalApp";
import moment from "moment";
import { useCallback } from "react";

const MySwal = withReactContent(Swal);

function HistoryExpense() {

    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [action, setAction] = useState<ActionFormType>(ActionFormType.New);
    const [idExpense, setIdExpense] = useState<number>(0);
    const [refreshFields, setRefreshFields] = useState<boolean>(false);
    const [modalShow, setModalShow] = useState<boolean>(false);

    const [from, setFrom] = useState<Date | undefined>(new Date());
    const [until, setUntil] = useState<Date | undefined>(new Date());
    
    

    const paramsModal = (action: ActionFormType, idExpense: number) => {
        setAction(action);
        setIdExpense(idExpense);

        if(action === ActionFormType.Edit)
            setRefreshFields(!refreshFields);

        setModalShow(true);
    }

    const refreshData = useCallback((source:any={}) => {
        const fromF = moment(from).format("yyyy-MM-DD");
        const untilF = moment(until).format("yyyy-MM-DD");

        apiAxios.getAuth(`/transactions/expenses/?from=${fromF}&until=${untilF}`,source.token)
        .then(x => {
            
            if(x.status === 200) {
                let data: IExpense[] = x.data;
                data = data.sort((a:IExpense,b:IExpense) => {
                    return a.date < b.date? 1:-1; 
                });
                setExpenses(data);
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
    }, [from, until]);

    useEffect(() => {
        let source = axios.CancelToken.source();

        refreshData();

        return function () {
            source.cancel("Cancelling in cleanup");
        };
    },[refreshData]);

    const deleteExpense = (id: number) => {
        MySwal.fire({
            title: 'Are you sure to delete this information?',
            text: `You won't be able to recover this information`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if(result.isConfirmed) {

                apiAxios.deleteAuth(`/transactions/expenses/${id}`)
                    .then(x => {
                        if(x.status === 200) {
                            Swal.fire('Deleted');
                            refreshData();
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
        })
    }

    const formExpense = (
        <RegisterExpense
            action={action}
            id={idExpense}
            refreshFields={refreshFields}
            refreshDataFromGrid={refreshData}
            onHide={() => setModalShow(false)}
        >

        </RegisterExpense>
    );

    const onSubmit = (e:any) => {
        e.preventDefault();
        refreshData();
    }

    return (
        <>
            <h1>History Expenses</h1>
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="date" value={moment(from).format("yyyy-MM-DD")} onChange={(e) => { setFrom(new Date(moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss.sssZ"))) }} placeholder="Enter Date" />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>Until</Form.Label>
                            <Form.Control type="date" value={moment(until).format("yyyy-MM-DD")} onChange={(e) => { setUntil(new Date(moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss.sssZ"))) }} placeholder="Enter Date" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="success" type="submit">
                            Filter
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row style={{ maxHeight: "500px", overflow: "scroll" }}>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Expense Type</th>
                                <th>Value</th>
                                <th>Date</th>
                                <th>Active</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                expenses.map(ex => {
                                    return (
                                        <tr key={ex.id}>
                                            <td>{ex.id}</td>
                                            <td>{ex.expense_type.description}</td>
                                            <td>{ex.value}</td>
                                            <td>{moment(ex.date).format("yyyy-MM-DD")}</td>
                                            <td><input type="checkbox" checked={ex.active} readOnly={true} />{ex.active}</td>
                                            <td><button className="btn btn-info" onClick={() => paramsModal(ActionFormType.Edit, ex.id)}>Edit</button></td>
                                            <td><button className="btn btn-danger" onClick={() => deleteExpense(ex.id)}>Delete</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <ModalApp
                show={modalShow}
                headingText="Edit Expense"
                component = {formExpense}
                onHide={() => setModalShow(false)}
            >
            </ModalApp>
        </>
    );
}

export default HistoryExpense;