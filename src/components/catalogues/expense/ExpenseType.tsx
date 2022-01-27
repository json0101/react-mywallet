import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import ActionFormType from "../../../enums/ActionFormType";
import { apiAxios } from "../../../helpers/ApiAxios";
import axios from "axios";
import ModalApp from "../../commons/ModalApp";
import {IExpenseType} from "../interfaces/interfaces";
import FormExpenseType from "./FormExpenseType";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ExpenseType() {

    const [expensesType, setExpensesType] = useState<IExpenseType[]>([]);
    const [action, setAction] = useState<ActionFormType>(ActionFormType.New);
    const [idExpenseType, setIdExpenseType] = useState<number>(0);
    const [refreshFields, setRefreshFields] = useState<boolean>(false);
    const [modalShow, setModalShow] = useState<boolean>(false);
    

    useEffect(() => {
        let source = axios.CancelToken.source();

        refreshData();

        return function () {
            source.cancel("Cancelling in cleanup");
        };
    }, []);

    const paramsModal = (action: ActionFormType, idExpenseType: number) => {
        setAction(action);
        setIdExpenseType(idExpenseType);

        if(action === ActionFormType.Edit)
            setRefreshFields(!refreshFields);

        setModalShow(true);
    }

    const refreshData = (source:any={}) => {
        
        apiAxios.getAuth(`/catalogue/expense-types`,source.token)
        .then(x => {
            if(x.status === 200) {
                let data: IExpenseType[] = x.data;
                data = data.sort((a:IExpenseType,b:IExpenseType) => {
                    return a.description > b.description? 1:-1; 
                });
                setExpensesType(data);
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
    }

    const formExpenseType = (
        <FormExpenseType
            action={action}
            id={idExpenseType}
            refreshFields={refreshFields}
            refreshDataFromGrid={refreshData}
            onHide={() => setModalShow(false)}
        >

        </FormExpenseType>
    );

    const deleteExpenseType = (id: number) => {
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

                apiAxios.deleteAuth(`/catalogue/expense-types/${id}`)
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

    return (
        <>
            <h1>Types of Expense</h1>
            <Row>
                <Col>
                    <Button variant='success' onClick={() => paramsModal(ActionFormType.New,0)}>New</Button>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Active</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expensesType.map(ti => {
                                return (
                                    <tr key={ti.id}>
                                        <td>{ti.id}</td>
                                        <td>{ti.description}</td>
                                        <td><input type="checkbox" checked={ti.active} readOnly={true} />{ti.active}</td>
                                        <td><button className="btn btn-info" onClick={() => paramsModal(ActionFormType.Edit, ti.id)}  data-toggle="modal" data-target="#exampleModalCenter">Edit</button></td>
                                        <td><button className="btn btn-danger" onClick={() => deleteExpenseType(ti.id)}>Delete</button></td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </Table>
                </Col>
            </Row>
            <ModalApp
                show={modalShow}
                headingText="New Type of Expense"
                component = {formExpenseType}
                onHide={() => setModalShow(false)}
            >
            </ModalApp>
        </>
    );
}

export default ExpenseType;

