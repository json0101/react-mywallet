
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { apiAxios } from "../../helpers/ApiAxios";

const MySwal = withReactContent(Swal);

function Register() {

    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [confirmPassword, confirmSetPassword] = useState<string>("");
    
    const navigation = useNavigate();
    
    const onSubmit = (e: any) => {
        e.preventDefault()

        if(password !== confirmPassword)
        {
            MySwal.fire({
                title: "Please confirm your password, they aren't equals",
                icon: "error"
            });
            return;
        }

        apiAxios.post(`/user`,{
            user_name: user,
            password: password,
            name:name
        }).then(res => {
           // console.log(res);

            if(res.status === 201) {

                MySwal.fire({
                    title: 'Created, now you can login',
                    icon: "success"
                });

                navigation('/login');
                
            }
        }).catch(error => {
            //console.log(error);
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

                                        <Form.Group className="mb-3" controlId="formName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />
                                        
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={confirmPassword} onChange={(e) => confirmSetPassword(e.target.value)}/>
                                        </Form.Group>
                                        <NavLink to='/login'>
                                            Login
                                        </NavLink>

                                        <div className="text-center">
                                            <Button variant="primary" type="submit">
                                                Register
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
    )
}

export default Register;