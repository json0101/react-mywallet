import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { apiAxios } from "../../helpers/ApiAxios";
import { IExpense, IIncome } from "../transactions/interfaces/interface";
import WalletChart from "./WalletChart";
import { useDispatch, useSelector } from 'react-redux';
import { saveIncome, saveExpense } from "../../redux/store";
import IncomeTypeChart from "./IncomeTypeChart";
import ExpenseTypeChart from "./ExpenseTypeChar";
import TransactionHistory from "./TransactionHistory";
import moment from "moment";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCallback } from "react";

const MySwal = withReactContent(Swal);

function Dashboard() {

    const { incomes, expenses } = useSelector((state: any) => state.transaction);

    const [totalIncome, setTotalIncomes] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);

    const [highestIncome, setHighestIncome] = useState<number>(0);
    const [highestExpense, setHighestExpense] = useState<number>(0);

    const [from, setFrom] = useState<Date>(new Date());
    const [until, setUntil] = useState<Date>(new Date());

    const dispatch = useDispatch();

    const getIncomes = useCallback((from?: Date, until?: Date, source: any = {}) => {
        const fromF = moment(from).format("yyyy-MM-DD");
        const untilF = moment(until).format("yyyy-MM-DD");

        apiAxios.getAuth(`/transactions/incomes/dashboard?from=${fromF}&until=${untilF}`, source.token)
            .then(x => {

                if (x.status === 200) {
                    let data: IIncome[] = x.data;
                    data = data.sort((a: IIncome, b: IIncome) => {
                        return a.description > b.description ? 1 : -1;
                    });
                    dispatch(saveIncome(data));
                }
            })
            .catch(error => {
                if (error.response.data?.message) {
                    MySwal.fire({
                        title: error.response.data?.message,
                        icon: "error"
                    });
                }
            });

    }, [dispatch]);

    useEffect(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30)
        setFrom(d);

        let source = axios.CancelToken.source();

        getIncomes(d, until, source);

        return function () {
            source.cancel("Cancelling in cleanup");
        };
    }, [getIncomes, until]);

    const getExpenses = useCallback((from?: Date, until?: Date, source: any = {}) => {

        const fromF = moment(from).format("yyyy-MM-DD");
        const untilF = moment(until).format("yyyy-MM-DD");
        apiAxios.getAuth(`/transactions/expenses/dashboard?from=${fromF}&until=${untilF}`, source.token)
            .then(x => {

                if (x.status === 200) {
                    let data: IExpense[] = x.data;
                    data = data.sort((a: IExpense, b: IExpense) => {
                        return a.description > b.description ? 1 : -1;
                    });
                    dispatch(saveExpense(data));

                }
            })
            .catch(error => {
                if (error.response.data?.message) {
                    MySwal.fire({
                        title: error.response.data?.message,
                        icon: "error"
                    });
                }
            });

    }, [dispatch]);

    useEffect(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        setFrom(d);

        let source = axios.CancelToken.source();

        getExpenses(d, until, source);

        return function () {
            source.cancel("Cancelling in cleanup");
        };
    }, [getExpenses, until]);

    useEffect(() => {
        //console.log("Incomes",incomes);
        if (incomes.length === 0)
            return;

        const valuesIncome = incomes.map((i: any) => i.value);
        const totalIncome = valuesIncome.reduce((previous: number, current: number) => {
            return +previous + +current;
        });

        const order = valuesIncome.sort((a: number, b: number) => {
            return +a < +b ? 1 : -1;
        });

        const highest = order[0];

        //console.log("Incomes orderrrr", order);

        setTotalIncomes(+totalIncome);
        setHighestIncome(+highest);
    }, [incomes]);

    useEffect(() => {
        //console.log("Expense", expenses);
        if (expenses.length === 0) {
            return;
        }

        const valuesExpense = expenses.map((e: any) => e.value);

        const totalExpense = valuesExpense.reduce((previous: number, current: number) => {
            return +previous + +current;
        });

        const order = valuesExpense.sort((a: number, b: number) => {
            return +a < +b ? 1 : -1;
        });

        //console.log("Orderrrrr",order);
        const highest = order[0];

        setTotalExpense(+totalExpense);
        setHighestExpense(+highest);
    }, [expenses]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        getExpenses(from, until);
        getIncomes(from, until);
    }



    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <h1>Dashboard</h1>
                    </Col>

                </Row>

                <Row>
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
                </Row>

                <Row>
                    <Col>
                        <h2>Balance: {(totalIncome - totalExpense).toFixed(2)} L.</h2>
                    </Col>
                </Row>

                {/* <Row>
                    <Stack direction="horizontal" style={{alignItems: "stretch"}} gap={1}>
                        <Alert variant="primary">
                            Total incomes: {totalIncome.toFixed(2)} L.
                        </Alert>
                        <Alert variant="danger">
                            Total expenses: {totalExpense.toFixed(2)} L.
                        </Alert>
                        <Alert variant="success">
                            Highest income: {+highestIncome.toFixed(2)} L.
                        </Alert>
                        <Alert variant="warning">
                            Highest expense: {+highestExpense.toFixed(2)} L.
                        </Alert>
                    </Stack>
                </Row> */}

                <Row>
                    <Col lg={3} md={12}>
                        <Alert variant="primary">
                            Total incomes: {totalIncome.toFixed(2)} L.
                        </Alert>
                    </Col>
                    <Col lg={3} md={12}>
                        <Alert variant="danger">
                            Total expenses: {totalExpense.toFixed(2)} L.
                        </Alert>
                    </Col>
                    <Col lg={3} md={12}>
                        <Alert variant="success">
                            Highest income: {+highestIncome.toFixed(2)} L.
                        </Alert>
                    </Col>
                    <Col lg={3} md={12}>
                        <Alert variant="warning">
                            Highest expense: {+highestExpense.toFixed(2)} L.
                        </Alert>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Wallet</Card.Title>
                                <WalletChart></WalletChart>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-2">
                    <Col lg={6} md={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Incomes by type</Card.Title>
                                <IncomeTypeChart />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} md={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Expenses by type</Card.Title>
                                <ExpenseTypeChart />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-2" >
                    <Col>
                        <Card>
                            <Card.Body style={{ maxHeight: "500px", overflow: "scroll" }} >
                                <Card.Title>Transactions history</Card.Title>
                                <TransactionHistory></TransactionHistory>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Dashboard;