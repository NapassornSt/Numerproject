import { useState ,useEffect} from "react"
import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs'
import "./App.css"
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart ,registerables} from "chart.js";
import axios from "axios";

Chart.register(CategoryScale);
Chart.register(...registerables);

const Secant =()=>{
    const print = () =>{
        console.log(data)
        g();
        setValueIter(data.map((x)=>x.iteration));
        setValueX0(data.map((x)=>x.X0));

        return(
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">X</th>
                            <th width="30%">Value</th>
                            <th width="30%">Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>X{element.iteration}</td>
                                <td>{element.X}</td>
                                <td>{element.error}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Line data={datagraph}/>
            </Container>
           
        );
    }

    const[count1, setCount1]=useState()

    const url='http://localhost:5001/mydb'
    const getdata=()=>{
        axios.get(url).then((Response)=>{ console.log( Response)
            setCount1(Response.data)}).catch((error)=>{ console.log(error)})
    }
    useEffect(()=>{getdata()},[])

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
   
    const CalSecant= (x0, x1) => {
        var fX0,fX1,ea,scope,x;
        var iter = 0;
        var MAX = 50;
        const e = 0.000001;
        var obj={};

        const cal=(x) =>{
            scope ={
                x:x,
            }
        return evaluate(Equation,scope)
        }
        do{
            fX0 = cal(x0);
            fX1 = cal(x1);
            x = x1 - ((fX1*(x0-x1))/(fX0-fX1));
            ea = error(x,x1);
            iter++;
            obj = {
                iteration:iter,
                X:x.toFixed(6),
                error:ea.toFixed(6)
            }
            data.push(obj)
            x0 = x1;
            x1 = x;
        }while(ea>e && iter<MAX)
        setX(x1);
    }

    const dataX =[];
    const dataY =[];
    const g = () => {
        {data.map((element, index) =>{
            dataX[index]= element.X;
            dataY[index]= element.iteration;
        }) 
        }
        console.log("data "+dataX);
        console.log("dataY "+dataY);
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
    const [valueX0, setValueX0] = useState([]);
     
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^4)-13")
    const [X,setX] = useState(0)
    const [X0,setX0] = useState(0)
    const [X1,setX1] = useState(0)

    const inputEquation = (event) =>{
        console.log(event.target.value)
        setEquation(event.target.value)
    }

    const inputX0 = (event) =>{
        console.log(event.target.value)
        setX0(event.target.value)
    }

    const inputX1 = (event) =>{
        console.log(event.target.value)
        setX1(event.target.value)
    }

    const calculateRoot = () =>{
        const x0num = parseFloat(X0)
        const x1num = parseFloat(X1)
        CalSecant(x0num,x1num);
        setHtml(print());
           
        console.log(valueIter)
        console.log(valueX0)
    }

    return (
            <Container className="mb-4">
                {count1?count1.map((data,i)=>{
                    if (data.id == 5){
                        return (<h2>{data.topic}</h2>)
                    }   }) :<h2>No Data</h2>}
                <Form >
                    <Form.Group className="mb-4">
                    <Form.Label>Input f(x)</Form.Label>
                        <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0"}} className="form-control"></input>
                        <Form.Label>Input X0</Form.Label>
                        <input type="number" id="X0" onChange={inputX0} style={{width:"20%", margin:"0"}} className="form-control"></input>
                        <Form.Label>Input X1</Form.Label>
                        <input type="number" id="X1" onChange={inputX1} style={{width:"20%", margin:"0"}} className="form-control"></input>
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

export default Secant
