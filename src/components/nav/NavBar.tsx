import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import {logout} from '../../redux/store';
import { useDispatch } from 'react-redux';
import {NavLink} from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const logoutSubmit = (e:any) => {
        e.preventDefault();
        dispatch(logout());
        localStorage.clear();
        navigate('/login');
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="#">My Wallet</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <NavLink className="nav-link"  to="/dashboard">Dashboard</NavLink>
                            
                            <NavDropdown title="Catalogue" id="navbarScrollingDropdown">
                                
                                <NavLink className="dropdown-item" to='/catalogues/expense-types'>
                                    Expense's Types
                                </NavLink>
                                <NavLink className="dropdown-item" to='/catalogues/income-types'>
                                    Income's Types
                                </NavLink>
                            </NavDropdown>
                           
                            <NavDropdown title="Transactions" id="navbarScrollingDropdown2">
                                
                                <NavLink className="dropdown-item" to='/transaction/register-expense'>
                                    Register Expenses
                                </NavLink>
                                <NavLink className="dropdown-item" to='/transaction/register-income'>
                                    Register Incomes
                                </NavLink>

                                <NavLink className="dropdown-item" to='/transaction/history-income'>
                                    History Incomes
                                </NavLink>
                                <NavLink className="dropdown-item" to='/transaction/history-expense'>
                                    History Expenses
                                </NavLink>

                            </NavDropdown>

                            <Nav.Link href="/login" onClick={logoutSubmit}></Nav.Link>
                            
                            <button className="logout nav-link" onClick={logoutSubmit}>
                                Logout
                            </button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );

}

export default NavBar;