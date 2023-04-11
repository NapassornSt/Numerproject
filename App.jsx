import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import "./App.css"
import Navbar1 from './Navbar';
import {  BrowserRouter, Route, Routes } from "react-router-dom"
import Bisection from './Bisection';
import Onepoint from './Onepoint';
import FalsePosition from './Falseposition';
import Newton from './Newton';
import Secant from './Secant';
import Regression from './Regression';

function App() {
  const[count, setCount]=useState(0)
  return ( 
    <div>
     <Navbar1/>
     <BrowserRouter>
      <Routes>
        <Route path="/Bisection" element={<Bisection/>}/>
        <Route path="/FalsePosition" element={<FalsePosition/>}/>
        <Route path="/Onepoint" element={<Onepoint/>}/>
        <Route path="/Newton" element={<Newton/>}/>
        <Route path="/Secant" element={<Secant/>}/>
        <Route path="/Regression" element={<Regression/>}/>

      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App;



