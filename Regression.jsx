// import React, { useState, useEffect  } from "react";
// import { Button, Container, Table , Form} from "react-bootstrap";
// import axios from "axios";

// const regression=()=>{
//   let numgen = 0;
//   const [Answer,setAnswer] = useState();

//   const url='http://localhost:5005/podpoi'

//   const api=()=>{
//     axios.get(url).then((response)=>{
//       console.log(response.data[0].x)
//       console.log(response.data[0].n)
//       document.getElementById("x").value = response.data[0].x
//       document.getElementById("n").value = response.data[0].n
//     }).catch((error)=>{console.log(error)})
//   }

//   const calpow=()=>{
//     let X=parseInt(document.getElementById("x").value);
//     let N=parseInt(document.getElementById("n").value);
//     let result = Math.pow(X,N)
//     setAnswer(result);
//   }

//   return(
  
//     <Container className="mb-4">
//       <Form.Label>input X</Form.Label>
//       <input type="number" id="x" className="form-control"/> <br/> 
//       <Form.Label>input N</Form.Label>
//       <input type="number" id="n" className="form-control"/> <br/>
//       <Form.Label >result</Form.Label>
//       <input value={Answer} className="form-control"/>
//       <br/><Button onClick={calpow} className="form-control">Calculate</Button>
//       <br/><br/><Button onClick={api} className="form-control">API</Button>
//     </Container>
//     );
// };

// export default regression;

import { useEffect, useState } from "react"
import { count, i, inv, multiply, number } from "mathjs";
import { Scatter,Line } from "react-chartjs-2";
import { CategoryScale, Chart ,registerables } from "chart.js";
import { Button, Container, Form, Table } from "react-bootstrap";
import axios from "axios";
import "./App.css";

Chart.register(CategoryScale);
Chart.register(...registerables);

const LinearRegression = () => {
  let numgen=0;
  let answer = 0;
  const giventable = [];
  const [table, setTable] = useState();
  const [answerall, setAnswerall] = useState();
  const [dataX,setdataX] = useState([]);
  const [dataY,setdataY] = useState([]);
  const [calfx,setcalfx] = useState([]);
  const [count1, setCount1] = useState()

  const url='http://localhost:5004/database2'

  let gdata;
  const getdata = () => {
    console.log(numgen);
    axios.post(url, { numgen: numgen })
      .then((response) => {
        gdata = response.data;
        console.log("get Data API", gdata);
        let n = Math.floor(Math.random() * gdata.length);
        console.log(typeof response.data[n]);
        let jsons = JSON.parse(gdata);
        console.log(jsons[0].x);
        let jsons2 = JSON.parse(jsons[0].x);

        for (let i = 0; i < numgen; i++) {
          document.getElementById("rowx" + i).value = jsons2.x[i];
          document.getElementById("rowy" + i).value = jsons2.y[i];
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let X = 0;
  let arr_x = [];
  let arr_y = [];
  let cal_y = [];

  const createtable = (numgen) => {
    let tablex = [];
    let tabley = [];
    for (let i = 0; i < numgen; i++) {
      tablex.push(  
        <div>
          <input type="number" style={{width:"80px" }} placeholder={"x" + (i + 1)} id={"rowx" + i} className="form-control"/>
        </div>
      );
      tabley.push(
        <div>
        
          <input type="number" style={{width:"80px" }} placeholder={"f(x)" + (i + 1)} id={"rowy" + i} className="form-control"/>
        </div>
      );
    }
    giventable.push({ x: tablex, y: tabley });
  };

  const Cal = () => {
    answer = 0;
    arr_x = [];
    arr_y = [];
    cal_y = [];
    let sumx = [0, 0];
    let sumy = [0, 0];
    let m = 1;
    let matrix_x = new Array(m + 1);
    let matrix_y = new Array(m + 1);
    let solution = [];

    for (let i = 0; i < numgen; i++) {
      arr_x.push(parseFloat(document.getElementById("rowx" + i).value));
      arr_y.push(parseFloat(document.getElementById("rowy" + i).value));
      for (let j = 1; j <= sumx.length; j++) {
        sumx[j - 1] += Math.pow(arr_x[i], j);
      }
      for (let k = 0; k < sumy.length; k++) {
        sumy[k] += arr_y[i] * Math.pow(arr_x[i], k);
      }
      dataX.push(arr_x[i])
      dataY.push(arr_y[i])
    }

    for (let i = 0; i < m + 1; i++) {
      matrix_x[i] = new Array(m + 1);
    }

    for (let i = 0; i < m + 1; i++) {
      if (i === 0) {
        matrix_x[i][i] = numgen;
      }
      for (let j = 0; j < i + 1; j++) {
        if (i === 0) {
          continue;
        } else {
          matrix_x[i][j] = sumx[j + i - 1];
          matrix_x[j][i] = sumx[j + i - 1];
        }
      }
      matrix_y[i] = sumy[i];
    }
    console.log(matrix_x);
    console.log(matrix_y);

    matrix_x = inv(matrix_x);
    solution = multiply(matrix_x, matrix_y);
    console.log(solution);

    X = parseFloat(document.getElementById("X").value);
    console.log(X);
    for (let i = 0; i < solution.length; i++) {
      answer += solution[i] * Math.pow(X, i);
    }
  
    for(let i=0;i<numgen;i++){
      cal_y[i] = 0;
      for(let j=0;j<solution.length;j++){
        cal_y[i] += solution[j] * Math.pow(arr_x[i],j);
      }
      calfx.push(cal_y[i]);
    }

    console.log("cal_y = ",cal_y)
  };

  const resulttable = () => {
    console.log(giventable);
    return (
      <Container className="mb-4">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>
            {giventable.map((data) => {
              return <div>{data.x}</div>; 
            })}
          </div>
          <div>
            {giventable.map((data) => {
              return <div id="myInput">{data.y}</div>;
            })}
          </div>
        </div>
        <br/><center>
          <Button variant="dark" onClick={gotoCal} value={"Calculate"}>Calculate</Button>
        </center>
      </Container>
    );
  };

  const datagraph = {
    labels: dataX,
      datasets: [
      {
        type: 'scatter',
        axis:'y',
        label: '(x,y)',
        data: dataY,
        borderColor: '#291d89',
        fill: false,
        tension: 0.1
        }
        ,{
          type: 'line',
          axis:'y',
          label: 'a0+a1X',
          data: calfx,
          borderColor: '#cef002',
          fill: false,
          tension: 0.1
        }
      ]  
    }

  const result = () => {
    console.log(arr_x);
    console.log(cal_y);
    let actual_value = {
      x: arr_x,
      y: arr_y  
    };

    let cal_value = {
      x: arr_x,
      y: cal_y 
    };

    let X_value = {
      x: [X],
      y: [answer]  
    };

    let data = [actual_value, cal_value, X_value];
    return (
      <div className="mb-4">
        <center>Answer = {answer.toPrecision(9)}</center>
      </div>
    );
  };

  const inputnumtable = (event) => {
    numgen = parseInt(event.target.value);
    console.log("numgen = ", numgen);
    createtable(numgen);
    setTable(resulttable());
  };

  const gotoCal = () => {
    Cal();
    setAnswerall(result());
  };

  const handleButtonClick = () => {
    let i = 0;
    numgen = parseInt(document.getElementById("N").value);
    console.log(numgen);
    getdata();
  };


  return (
    <Container className="mb-4">
      <div><h2>Linear Regression</h2></div>
      <div>
        <center>
        <Form.Label>Input X</Form.Label>
        <input type="number" id="X" style={{width:"150px"}} className="form-control"/>
        </center>
      </div>
      <center>
      <div>
        <Form.Label>Input N</Form.Label>
        <input type="number" id="N" onChange={inputnumtable} style={{width:"150px" }} className="form-control"/><br/>
      </div>
      </center>
      
      {table}
      {answerall}
      <center><Button variant="light" onClick={handleButtonClick} className="form-control" style={{width:"150px" }}>Random</Button></center><br/>
      <Scatter data={datagraph}/>
      </Container>
  );
};

export default LinearRegression;

