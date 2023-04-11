import { useEffect, useState } from "react"
import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs'
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart ,registerables} from "chart.js";
import "./App.css"
import axios from "axios";

Chart.register(CategoryScale);
Chart.register(...registerables);

const Falseposition =()=>{
    const print = () =>{
        console.log(data)
        g();
        setValueIter(data.map((x)=>x.iteration));
        setValueXl(data.map((x)=>x.Xl));
        setValueX1(data.map((x)=>x.X1));
        setValueXr(data.map((x)=>x.Xr));
        return(
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">XL</th>
                            <th width="30%">X1</th>
                            <th width="30%">XR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.Xl}</td>
                                <td>{element.X1}</td>
                                <td>{element.Xr}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Line data={datagraph}/>
            </Container>
           
        );
    }

    const[count1, setCount1] = useState()

    const url='http://localhost:5001/mydb'
    const getdata=()=>{
        axios.get(url).then((response)=>{console.log(response.data)
        setCount1(response.data)}).catch((error)=>{console.log(error)})
    }
    useEffect(()=>{getdata()},[])

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
   
    const CalFalseposition = (xl, xr) => {
        var x1,fXl,fX1,fXr,ea,scope;
        var iter = 0;
        var MAX = 50;
        const e = 0.00001;
        const cal =(X) =>{
            scope ={
                x:X,
            }
            return evaluate(Equation,scope)
        }
        do
        {
            fXl = cal(xl);
            fXr =cal(xr);

            x1 =(xl * fXr -xr *fXl) / (fXr -fXl);

            fX1 = cal(x1);

            iter ++;
            if (fX1*fXr > 0)
            {
                ea = error(xr, x1);
                data.push ({
                    iteration:iter,
                    Xl:xl.toFixed(6),
                    X1:x1.toFixed(6),
                    Xr:xr.toFixed(6),
                    error:ea.toFixed(6)
                })
                xr = x1;
            }
            else if (fX1*fXr < 0)
            {
                ea = error(xl, x1);
                data.push ({
                    iteration:iter,
                    Xl:xl.toFixed(6),
                    X1:x1.toFixed(6),
                    Xr:xr.toFixed(6),
                    error:ea.toFixed(6)
                })
                xl = x1;
            }
        }while(ea>e && iter<MAX)
        setX(x1)
    }

    const dataX =[];
    const dataY =[];
    const g = () => {
        {data.map((element, index) =>{
            dataX[index]= element.iteration;
            dataY[index]= element.X1;
        }) 
        }

    }
    const datagraph = {
        labels: dataX,
        datasets: [
            {
            axis:'y',
            label: 'Answer',
            data: dataY,
            borderColor: '#291d89',
            fill: false,
            tension: 0.1
            }
        ]
    };

    const data =[];
    const [valueIter, setValueIter] = useState([]);
    const [valueXl, setValueXl] = useState([]);
    const [valueX1, setValueX1] = useState([]);
    const [valueXr, setValueXr] = useState([]);
     
   
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^4)-13")
    const [X,setX] = useState(0)
    const [XL,setXL] = useState(0)
    const [XR,setXR] = useState(0)

    const inputEquation = (event) =>{
        console.log(event.target.value)
        setEquation(event.target.value)
    }

    const inputXL = (event) =>{
        console.log(event.target.value)
        setXL(event.target.value)
    }

    const inputXR = (event) =>{
        console.log(event.target.value)
        setXR(event.target.value)
    }

    const calculateRoot = () =>{
        const xlnum = parseFloat(XL)
        const xrnum = parseFloat(XR)
        CalFalseposition(xlnum,xrnum);
     
        setHtml(print());
           
        console.log(valueIter)
        console.log(valueXl)
    }

    return (
            <Container className="mb-4">
                {count1?count1.map((data,i)=>{
                    if(data.id == 2){
                        return(<h2>{data.topic}</h2>)
                    } 
                }):<h2>No Data</h2>}

                <Form >
                    {/* <h2>False Position</h2> */}
                    <Form.Group className="mb-4">
                    <Form.Label>Input f(x)</Form.Label>
                        <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0"}} className="form-control"></input> 
                        <Form.Label>Input XL</Form.Label>
                        <input type="number" id="XL" onChange={inputXL} style={{width:"20%", margin:"0"}} className="form-control"></input>
                        <Form.Label>Input XR</Form.Label>
                        <input type="number" id="XR" onChange={inputXR} style={{width:"20%", margin:"0"}} className="form-control"></input>
                    </Form.Group>
                    <Button variant="outline-danger" onClick={calculateRoot}>
                        Calculate
                    </Button>
                </Form>
                <br></br>
                <h5>Answer = {X.toPrecision(9)}</h5>
                <Container>
                {html}
                </Container>
               
            </Container>
           
    )
}

export default Falseposition