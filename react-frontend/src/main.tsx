import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import {CookiesProvider} from 'react-cookie';
import {UserProvider} from './components/authentication/AuthProvider.tsx';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CookiesProvider>
            <BrowserRouter>
                <UserProvider>
                    <App/>
                </UserProvider>
            </BrowserRouter>
        </CookiesProvider>
    </React.StrictMode>
);
