import React, { Fragment, useEffect, useState } from 'react';
import { Routes, Navigate, Route, Outlet, useLocation } from 'react-router-dom';
import Login from '../login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/store';
import NavBar from "../nav/NavBar";

import ExpenseType from '../catalogues/expense/ExpenseType';
import IncomeType from '../catalogues/income/IncomeType';
import Income from '../transactions/RegisterIncome';
import Expense from '../transactions/RegisterExpense';
import Dashboard from "../dashboard/Dashboard";
import HistoryIncome from '../transactions/HistoryIncome';
import HistoryExpense from '../transactions/HistoryExpense';
import Register from '../login/Register';

export const AppRouter = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const auth = useSelector((state:any) => state.auth);
    

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const authString = localStorage.getItem("auth");
        const authLocal = JSON.parse(authString+"");
        if(authLocal?.access_token){
            dispatch(login(authLocal));
        }
    },[dispatch]);

    useEffect(() => {

        setIsLoggedIn(auth?.access_token? true: false);
    },[auth]);

    

    return (
        <>
                <Fragment>
                {isLoggedIn && location.pathname!=="/login" ? <NavBar/> : null}

                    <div className='container'>
                        <Routes>
                            
                            <Route path='/' element={isLoggedIn? <Outlet /> : <Navigate to="/login"/>}>
                                <Route path='/transaction/register-income' element={<Income />}></Route>
                                <Route path='/transaction/register-expense' element={<Expense />}></Route>
                                <Route path='/transaction/history-income' element={<HistoryIncome />}></Route>
                                <Route path='/transaction/history-expense' element={<HistoryExpense />}></Route>
                                <Route path='/catalogues/income-types' element={<IncomeType />}></Route>
                                <Route path='/catalogues/expense-types' element={<ExpenseType />}></Route>
                                
                                <Route path='/dashboard' element={<Dashboard />}></Route>
                            </Route>

                            <Route path='/login' element={isLoggedIn?<Navigate to={"/dashboard"}/> :<Login />} />
                            <Route path='/register' element={isLoggedIn?<Navigate to={"/dashboard"}/> :<Register />}></Route>
                        </Routes>
                    </div>
                </Fragment>
        </>
    )
}
