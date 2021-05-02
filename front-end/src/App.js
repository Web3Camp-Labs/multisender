import './App.css';
import { Tabs,Tab,Form } from 'react-bootstrap';

function App() {
  return (
    <div className="App">

      <Tabs defaultActiveKey="first" >
        <Tab eventKey="first" title="Step1. Prepare">
          <div className="container">
            <div className="row">
              <div className="col-9">
                <Form.Group>
                  <Form.Label>Token</Form.Label>
                  <Form.Control />
                </Form.Group>
              </div>
              <div className="col-3">
                <Form.Group>
                  <Form.Label>Token</Form.Label>
                  <Form.Control />
                </Form.Group>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="second" title="Step2. Confirm">

        </Tab>
      </Tabs>


    </div>
  );
}

export default App;
