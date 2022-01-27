import { configureStore, createSlice } from "@reduxjs/toolkit";
import {combineReducers} from 'redux';

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: {
        
            id:0,
            name: '',
            user_name: '',
            access_token: ''
        
    },
    reducers: {
        login: (state,action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.user_name = action.payload.user_name;
            state.access_token = action.payload.access_token;
        },
        logout: (state) => {
            state.id = 0
            state.name = '';
            state.user_name = '';
            state.access_token = undefined;
        }
    }
});

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        incomes:[],
        expenses: []
    },
    reducers: {
        saveIncome: (state,action) => {
            state.incomes = action.payload;
        },
        saveExpense: (state,action) => {
            state.expenses = action.payload;
        },
        clear: (state) => {
            state.incomes =[];
            state.expenses = [];
        }
    }
});

const reducer = combineReducers({
    auth: usuarioSlice.reducer,
    transaction: transactionsSlice.reducer
  })

const store = configureStore({
    reducer: reducer
});

const {login,logout} = usuarioSlice.actions;
const {saveIncome,saveExpense, clear} = transactionsSlice.actions;

export  {store,login, logout, saveIncome,saveExpense, clear};