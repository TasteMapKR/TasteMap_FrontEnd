import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MapComponent from './mono/component/MapComponent';
const addressList = [
  "서울특별시 중구 명동",
  "서울특별시 중구 을지로",
  "서울특별시 종로구 종로"
];
// Create the root and render the App component without React.StrictMode
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MapComponent addressList={addressList} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
