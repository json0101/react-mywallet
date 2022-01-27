import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { apiAxios } from "../../helpers/ApiAxios";
import { login } from "../../redux/store";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

function Login() {

    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const onSubmit = (e: any) => {
        e.preventDefault();

        apiAxios.post('/auth/login', {
            user: user,
            password
        }).then(res => {
           
            dispatch(login(res.data));
            localStorage.setItem("auth",JSON.stringify(res.data));
            navigation('/dashboard');
        }).catch(error => {
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
            <section className='vh-100'>
                <Container className="py-5 h-100">
                    <Row className="d-flex justify-content-center  h-100">
                        <Col className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <Card className="shadow-2-strong">
                                <Card.Body className="p-5">
                                    <Form onSubmit={onSubmit}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" value={user} onChange={(e) => setUser(e.target.value)} />
                                        
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </Form.Group>
                                        
                                        <NavLink to='/register'>
                                            Register
                                        </NavLink>
                                        <div className="text-center">
                                            <Button variant="primary" type="submit">
                                                Login
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default Login;