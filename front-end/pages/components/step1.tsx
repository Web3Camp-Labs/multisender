import {Row, Col, Form,FloatingLabel,Button} from 'react-bootstrap';
import styled from "styled-components";
import {BoxArrowUp} from "react-bootstrap-icons";

const Box = styled.div`
    .height50{
      height: 200px;
    }
  .upload{
    svg{
      margin-right: 10px;
    }
  }
`

export default function Step1(){
    return <Box>
            <Row>
                <Col md={9}>
                    <FloatingLabel
                        controlId="Token"
                        label="Token"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            name='token'
                            placeholder="Token"
                            // value={tokenAddress}
                            // onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>
                </Col>
                <Col md={3}>

                    <FloatingLabel
                        controlId="Decimals"
                        label="Decimals"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            name='token'
                            placeholder="Decimals"
                            // value={decimals}
                            // onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <div className="mb-3">
                <Button variant="flat" className="upload" >
                    <BoxArrowUp />
                    <span>Import Addresses</span>
                </Button>
            </div>
            <Row>
                <Col md={12}>
                    <FloatingLabel
                        controlId="Addresses"
                        label="Addresses with Amounts"
                        className="mb-3"
                    >
                        <Form.Control
                            placeholder="Addresses with Amounts"
                            as="textarea"
                            name='amounts'
                            className="height50"
                            // value={amounts}
                            //  onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>

                </Col>
            </Row>
            <div>
                <Button
                    variant="flat"
                    // onClick={nextPage}
                    // disabled={btndisabled}
                >Next</Button>
            </div>



    </Box>
}