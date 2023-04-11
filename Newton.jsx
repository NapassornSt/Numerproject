import { useState ,useEffect} from "react"
import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate ,derivative} from 'mathjs'
import "./App.css"
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart ,registerables} from "chart.js";
import axios from "axios";

Chart.register(CategoryScale);
Chart.register(...registerables);

const Newton  = ()=>{
    const print = () =>{
        g();
        console.log(data)
        setValueIter(data.map((x)=>x.iteration));
        setValuex0(data.map((x)=>x.x0));
        setValuefx0(data.map((x)=>x.fx0));

        return(
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">x0</th>
                            <th width="30%">Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
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
        axios.get(url).then((Response)=>{ console.log( Response.data)
        setCount1(Response.data)}).catch((error)=>{ console.log(error)})
    }
    useEffect(()=>{getdata()},[])

    const error = (xold, xnew) => Math.abs((xnew-xold)/xnew)*100;
   
    const calculateNewton = (x0) =>{
        var fX0,dfX0,ea,scope,x;
        var iter = 0;
        var MAX = 50;
        const e = 0.00001;
        var obj={};
        const cal = (x) =>{
            scope = {
                x:x0,
            }
        return evaluate(Equation, scope)
        }
        const diff = (x) =>{
            scope = {
                x:x0,
            }
            const df = derivative(Equation,'x').toString()
            return evaluate(df, scope)
        }
        do {
            fX0 = cal(x0);
            dfX0 = diff(x0);
            x = x0 - fX0/ dfX0;
            ea = error(x, x0)
            iter++;
            obj = {
                iteration:iter,
                X:x.toFixed(6),
                error:ea.toFixed(6)
            }
            data.push(obj)
            x0 = x;
        } while (ea>e && iter<MAX)
        setX(x0)
    }

    const dataX =[];
    const dataY =[];
    const g = () => {
        {data.map((element, index) =>{
            dataX[index]= element.iteration;
            dataY[index]= element.X;
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
            }]
    };

    const data =[];
    const [valueIter, setValueIter] = useState([]);
    const [valuexo, setValuex0] = useState([]);
    const [valuefx0, setValuefx0] = useState([]);
     
    const [html, setHtml] = useState(null);
    const [Equation, setEquation] = useState("(x^4)-13")
    const [X,setX] = useState(0)
    const [x0,setx0] = useState(0)

    const inputEquation = (event) =>{
        console.log(event.target.value)
        setEquation(event.target.value)
    }

    const inputx0 = (event) =>{
        console.log(event.target.value)
        setx0(event.target.value)
    }
    const calculateRoot=() =>{
        const x0num = parseFloat(x0);
        calculateNewton(x0num);

        setHtml(print());
    }

    return (
            <Container className="mb-4">
                {count1?count1.map((data,i)=>{
                    if (data.id == 4){
                        return (<h2>{data.topic}</h2>)
                    }   }) :<h2>No Data</h2>}
                <Form >
                    <Form.Group className="mb-4">
                    <Form.Label>Input f(x)</Form.Label>
                        <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0"}} className="form-control"></input>
                        <Form.Label>Input X0</Form.Label>
                        <input type="number" id="x0" onChange={inputx0} style={{width:"20%", margin:"0"}} className="form-control"></input>
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

export default Newton
