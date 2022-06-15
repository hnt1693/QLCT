import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@arco-design/web-react/dist/css/arco.css";
import { ConfigProvider } from '@arco-design/web-react';
import vn from '@arco-design/web-react/es/locale/vi-VN';
import en from '@arco-design/web-react/es/locale/en-US';
import jp from '@arco-design/web-react/es/locale/ja-JP';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={vn}>
        <App />
    </ConfigProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
