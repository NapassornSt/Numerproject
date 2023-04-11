import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar1() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant='dark'>
        <Container>
        <Navbar.Brand href="/home">Numeric Method</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                {/* Root of equations */}
                <NavDropdown title="Root Of Equations" id="root">
                    <NavDropdown.Item href="/Bisection">Bisection</NavDropdown.Item>
                    <NavDropdown.Item href="/FalsePosition">False Position</NavDropdown.Item>
                    <NavDropdown.Item href="/Onepoint">One Point</NavDropdown.Item>
                    <NavDropdown.Item href="/Newton">Newton</NavDropdown.Item>
                    <NavDropdown.Item href="/Secant">Secant</NavDropdown.Item>
                </NavDropdown>

                {/* Linear */}
                <NavDropdown title="Linear Algebraic Equations" id="linear">
                    <NavDropdown.Item href="/Cramer">Cramer</NavDropdown.Item>
                    <NavDropdown.Item href="/GaussElimination">Gauss Elimination</NavDropdown.Item>
                    <NavDropdown.Item href="/GaussJordan">Gauss Jordan</NavDropdown.Item>
                    <NavDropdown.Item href="/LU">LU</NavDropdown.Item>
                    <NavDropdown.Item href="/Cholesky">Cholesky</NavDropdown.Item>
                    {/* เส้นขั้น */}
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/Jacob">Jacobi</NavDropdown.Item>
                    <NavDropdown.Item href="/GaussSeidel">Gauss Seidel</NavDropdown.Item>
                    <NavDropdown.Item href="/Conjugate">Conjugate</NavDropdown.Item>
                </NavDropdown>

                {/* Interpolation */}
                <NavDropdown title="Interpolation And Extrapolation" id="interpolation">
                    <NavDropdown.Item href="/NewtonDivided">Newton Divided</NavDropdown.Item>
                    <NavDropdown.Item href="/Lagrange">Lagrange</NavDropdown.Item>
                    <NavDropdown.Item href="/Spline">Spline</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Regression" id="regression">
                    <NavDropdown.Item href="/Regression">Regression</NavDropdown.Item>
                </NavDropdown>

            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  );
}

export default Navbar1;