import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import ReactDOM from 'react-dom/client'

const router = createBrowserRouter([{path: "/*", element:<App/>}]);
ReactDOM.createRoot(document.getElementById('root')).render(
 
 
    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  
    
);

