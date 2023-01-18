import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import {Provider as AlertProvider ,positions,transitions} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { SideBarOpenCloseContextProvider } from './context/SideBarOpenClose';


const options = {
  positions:positions.BOTTOM_CENTER,
  timeout:5000,
  transitions:transitions.SCALE
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <SideBarOpenCloseContextProvider>
         <App />
       </SideBarOpenCloseContextProvider>
      </AlertProvider>
    </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

