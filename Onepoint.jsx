import { useEffect, useState } from "react"
import { evaluate, index, count } from "mathjs";
import { Button, Container, Form, Table} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { CategoryScale,Chart,registerables } from "chart.js";
import "./App.css"
import axios from "axios";

Chart.register(CategoryScale);
Chart.register(...registerables);

const Onepoint = () => {

    const [html, setHtml] = useState(null);
    const [Equation, setEquation] = useState("(x^4)-13")
    const [X, setX] = useState(0);
    const [X0, setX0] = useState(0);
    const data =[];
    const [state, setState] = useState([]);
    const [valueIter, setValueIter] = useState([]);
    const [valueX0, setValueX0] = useState([]);
    const [valueX1, setValueX1] = useState([]);
    const [valuegX0, setValuegX0] = useState([]);
    const [valuegX1, setValuegX1] = useState([]);

    const inputEquation = (event) =>{
        console.log(event.target.value)
        setEquation(event.target.value)
    }

    const inputX0 = (event) =>{
        console.log(event.target.value)
        setX0(event.target.value)
    }

    const[count1, setCount1] = useState()

    const url='http://localhost:5001/mydb'
    const getdata=()=>{
        axios.get(url).then((response)=>{console.log(response.data)
        setCount1(response.data)}).catch((error)=>{console.log(error)})
    }
    useEffect(()=>{getdata()},[])

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;

    const Calonepoint = (x0) => {
        var gx0,gx1,ea,scope;
        var x1 = 0;
        var iter = 0;
        var MAX = 50;
        const e = 0.00001;
        var obj={};
        do
        {
            iter ++;
            scope = {
                x:x0,
            }
            gx0 = evaluate(Equation, scope)
            x1 = evaluate(Equation, scope)
            scope = {
                x:x1,
            }
            gx1 = evaluate(Equation, scope)
            obj = {
                Iteration:iter,
                X0:x0,
                X1:x1,
                gX0:gx0,
                gX1:gx1
            }
            data.push(obj)
            ea = error(x0, x1);
            x0 = x1;
        }while(ea>e && iter<MAX)
        setX(x1)
    }

    const calculateRoot = () =>{
        const x0num = parseFloat(X0)
        Calonepoint(x0num);
        setHtml(print());
        // setEquation(print());
        console.log(valueIter)
        console.log(valueX1)
        setState(data)

    }

    const dataX=[];
    const dataY=[];
    const g = () => {
    {
        data.map((element,index) =>{
        dataX[index]= element.X0;
        dataY[index]= element.gX0;
        })   }
        console.log("dataX"+dataX); 
        console.log("dataY"+dataY); 

    }
    const datagrapgh={
        labels : dataX,
        datasets:[
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
    const print = () =>{
        console.log(data)
        g();
        setValueIter(data.map((x)=>x.iteration));
        setValueX0(data.map((x)=>x.X0));
        setValuegX0(data.map((x)=>x.gX0));
        setValueX1(data.map((x)=>x.X1));
        setValuegX1(data.map((x)=>x.gX1));

        return(
            <Container>
                 <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="20%">Iteration</th>
                            <th width="20%">X0</th>
                            <th width="20%">g(X0)</th>
                            <th width="20%">X1</th>
                            <th width="20%">g(X1)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.Iteration}</td>
                                <td>{element.X0}</td>
                                <td>{element.gX0}</td>
                                <td>{element.X1}</td>
                                <td>{element.gX1}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
                <Line data={datagrapgh}/>
            </Container>
        );
    }

    return(
        <Container className="mb-4">
            {count1?count1.map((data,i)=>{
                    if(data.id == 3){
                        return(<h2>{data.topic}</h2>)
                    } 
                }):<h2>No Data</h2>}
            <Form>
                {/* <h2>One point</h2> */}
                <Form.Group className="mb-4">
                    <Form.Label>Input f(x)</Form.Label>
                    <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0"}} className="form-control"></input>
                    <Form.Label>Input X0</Form.Label>
                    <input type="number" id="X0" onChange={inputX0} style={{width:"20%", margin:"0"}} className="form-control"></input>
                </Form.Group>
                <Button variant="dark" onClick={calculateRoot}>
                    Calculate
                </Button>
            </Form>
            <br></br>
            <h5>Answer = {X.toPrecision(9)}</h5>
            <Container>
                {html}
            </Container>
            
        </Container>

        );
    }

export default Onepoint
