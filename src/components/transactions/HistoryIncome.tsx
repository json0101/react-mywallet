import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { apiAxios } from "../../helpers/ApiAxios";
import { IIncome } from "./interfaces/interface";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegisterIncome from "./RegisterIncome";
import ActionFormType from "../../enums/ActionFormType";
import ModalApp from "../commons/ModalApp";
import moment from "moment";

const MySwal = withReactContent(Swal);

function HistoryIncome() {

    const [incomes, setIncomes] = useState<IIncome[]>([]);
    const [action, setAction] = useState<ActionFormType>(ActionFormType.New);
    const [idIncome, setIdIncome] = useState<number>(0);
    const [refreshFields, setRefreshFields] = useState<boolean>(false);
    const [modalShow, setModalShow] = useState<boolean>(false);

    const [from, setFrom] = useState<Date | undefined>(new Date());
    const [until, setUntil] = useState<Date | undefined>(new Date());

    

    const paramsModal = (action: ActionFormType, idIncome: number) => {
        setAction(action);
        setIdIncome(idIncome);

        if(action === ActionFormType.Edit)
            setRefreshFields(!refreshFields);

        setModalShow(true);
    }

    

    const refreshData =  useCallback((source:any={}) => {
        const fromF = moment(from).format("yyyy-MM-DD");
        const untilF = moment(until).format("yyyy-MM-DD");

        apiAxios.getAuth(`/transactions/incomes/?from=${fromF}&until=${untilF}`,source.token)
        .then(x => {
           
            if(x.status === 200) {
                let data: IIncome[] = x.data;
                data = data.sort((a:IIncome,b:IIncome) => {
                    return a.date < b.date? 1:-1; 
                });
                setIncomes(data);
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
    },[from, until]);
    
    
    useEffect(() => {
        let source = axios.CancelToken.source();
        
        refreshData(source);

        return function () {
            source.cancel("Cancelling in cleanup");
        };
    },[refreshData]);

    const deleteIncome = (id: number) => {
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

                apiAxios.deleteAuth(`/transactions/incomes/${id}`)
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

    const formIncome = (
        <RegisterIncome
            action={action}
            id={idIncome}
            refreshFields={refreshFields}
            refreshDataFromGrid={refreshData}
            onHide={() => setModalShow(false)}
        >

        </RegisterIncome>
    );

    const onSubmit = (e:any) => {
        e.preventDefault();
        refreshData();
    }

    return (
        <>
            <h1>History Income</h1>
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
            <Row>
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
                                incomes.map(ex => {
                                    return (
                                        <tr key={ex.id}>
                                            <td>{ex.id}</td>
                                            <td>{ex.income_type.description}</td>
                                            <td>{ex.value}</td>
                                            <td>{moment(ex.date).format("yyyy-MM-DD")}</td>
                                            <td><input type="checkbox" checked={ex.active} readOnly={true} />{ex.active}</td>
                                            <td><button className="btn btn-info" onClick={() => paramsModal(ActionFormType.Edit, ex.id)}>Edit</button></td>
                                            <td><button className="btn btn-danger" onClick={() => deleteIncome(ex.id)}>Delete</button></td>
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
                headingText="Edit Income"
                component = {formIncome}
                onHide={() => setModalShow(false)}
            >
            </ModalApp>
        </>
    );
}

export default HistoryIncome;
