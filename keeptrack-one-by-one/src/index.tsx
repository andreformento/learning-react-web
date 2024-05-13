import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
// import DropdownMenu from './DropdownMenu';
// import Parent from './Parent';
// import FunctionComponentExample from './FunctionComponentExample';
// import ExampleForm from './ExampleForm';
// import SigninForm from './SigninForm';
// import ContactUsForm from './ContactUsForm';
// import Container from './Container';
// // import axios from 'axios';
// import PhotoList from './PhotoList';
// import CrudWithApi from './CrudWithApi';
import ContextExample from './ContextExample';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// const okUrl = 'http://localhost:4000/photos?_page=1&_limit=100';
// const notFoundErrorUrl = 'https://httpstat.us/404';
// const forbiddenErrorUrl = 'https://httpstat.us/403';
// const serverErrorUrl = 'https://httpstat.us/500';

// axios
//   .get(okUrl)
//   .then((response) => response.data)
//   .then((data) => console.log(data))
//   .catch(error => console.log(error));


// function handleErrors(response:any) {
//   if (!response.ok) throw new Error(response.statusText);
//   return response;
// }

// function parseJSON(response:any) {
//   return response.json();
// }

// fetch(okUrl)
//   .then(handleErrors)
//   .then(parseJSON)
//   .then((data) => console.log(data))
//   .catch(error => console.log(error));;

// root.render(
//   <React.StrictMode>
//     <CrudWithApi />
//     {/* <PhotoList />
//     <Container />
//     <ContactUsForm />
//     <SigninForm />
//     <ExampleForm />
//     <FunctionComponentExample />
//     <Parent />
//     <DropdownMenu />
//     <App /> */}
//   </React.StrictMode>
// );

root.render(
  <React.StrictMode>
    <ContextExample />
  </React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
