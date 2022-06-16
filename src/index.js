import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@arco-design/web-react/dist/css/arco.css";
import {Provider} from 'react-redux'
import store from './redux/store'
import {BrowserRouter} from "react-router-dom";
import axios from "axios";
import header from "./layout/header";

axios.interceptors.request.use((req) => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            req.headers = {...header, authorization: `Bearer ${JSON.parse(currentUser).accessToken}`}
        }
        return req;
    }
)

axios.interceptors.response.use((response) => {
        return response;
    }, async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && originalRequest.url.indexOf('/api/v1/auth/signup') === -1
            && originalRequest.url.indexOf('/api/v1/auth/signin') === -1) {
            // Swal.fire(
            //     'Session?',
            //     'Session expired,Please sign in again!',
            //     'question'
            // ).then(async (result) => {
            //     localStorage.removeItem("user");
            //     window.location.href = "/login";
            // });

        }
        return Promise.reject(error)
    }
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
    ,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
