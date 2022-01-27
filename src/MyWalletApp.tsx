import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { AppRouter } from './components/routes/AppRoute';
import {store} from './redux/store';
import { BrowserRouter } from 'react-router-dom';

function MyWalletApp() {
  return (
    <>
      
      <BrowserRouter>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </BrowserRouter>
     
    </>
  );
}

export default MyWalletApp;