import { useState, useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import ActionFormType from "../../../enums/ActionFormType";
import { apiAxios } from "../../../helpers/ApiAxios";
import ModalApp from "../../commons/ModalApp";
import { IIncomeType } from "../interfaces/interfaces";
import FormIncomeType from "./FormIncomeType";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";

const MySwal = withReactContent(Swal);

function IncomeType() {

    const [incomeTypes, setIncomeTypes] = useState<IIncomeType[]>([]);
    const [action, setAction] = useState<ActionFormType>(ActionFormType.New);
    const [idIncomeType, setIdIncomeType] = useState<number>(0);
    const [refreshFields, setRefreshFields] = useState<boolean>(false);
    const [modalShow, setModalShow] = useState<boolean>(false);
    
    
    
    useEffect(() => {
        let source = axios.CancelToken.source();

        refreshData(source);

        return function () {
            source.cancel("Cancelling in cleanup");
        };
        
    }, []);

    const paramsModal = (action: ActionFormType, idIncomeType: number) => {
        setAction(action);
        setIdIncomeType(idIncomeType);

        if(action === ActionFormType.Edit)
            setRefreshFields(!refreshFields);

        setModalShow(true);
    }

    const refreshData = (source:any={}) => {
        apiAxios.getAuth(`/catalogue/income-types`,source.token)
        .then(x => {
            if(x.status === 200) {
                let data: IIncomeType[] = x.data;
                data = data.sort((a: IIncomeType,b: IIncomeType) => {
                    return a.description > b.description? 1:-1; 
                });
                setIncomeTypes(data);
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

    const formIncomeType = (
        <FormIncomeType
            action={action}
            id={idIncomeType}
            refreshFields={refreshFields}
            refreshDataFromGrid={refreshData}
            onHide={() => setModalShow(false)}
        >

        </FormIncomeType>
    );

    const deleteIncomeType = (id: number) => {
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

                apiAxios.deleteAuth(`/catalogue/income-types/${id}`)
                    .then(x => {
                        if(x.status === 200) {
                            MySwal.fire({title: 'Deleted',icon: 'success'});
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
            <h1>Types of Income</h1>
            <Row>
                <Col>
                    <Button variant='success' onClick={() => paramsModal(ActionFormType.New,0)}>New</Button>
                </Col>
            </Row>
            <br></br>
            <Row style={{ maxHeight: "500px", overflow: "scroll" }}>
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
                            {incomeTypes.map(ti => {
                                return (
                                    <tr key={ti.id}>
                                        <td>{ti.id}</td>
                                        <td>{ti.description}</td>
                                        <td><input type="checkbox" checked={ti.active} readOnly={true} />{ti.active}</td>
                                        <td><button className="btn btn-info" onClick={() => paramsModal(ActionFormType.Edit, ti.id)}  data-toggle="modal" data-target="#exampleModalCenter">Edit</button></td>
                                    <td><button className="btn btn-danger" onClick={() => deleteIncomeType(ti.id)}>Delete</button></td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </Table>
                </Col>
            </Row>
            <ModalApp
                show={modalShow}
                headingText="New Type of Income"
                component = {formIncomeType}
                onHide={() => setModalShow(false)}
            >
            </ModalApp>
        </>
    )
}

export default IncomeType;