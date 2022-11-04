import {Row, Col, Form,FloatingLabel,Button} from 'react-bootstrap';
import styled from "styled-components";
import {ChangeEvent, useState, useEffect} from "react";
import {useWeb3} from "../api/connect";
import Excel from "./excel";
import {ActionType} from "../api/types";

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
interface Props{
    handleNext: Function
}

interface fileObj{
    address:string
    amount:string
}

export default function Step1(props:Props){

    const { dispatch,state } = useWeb3();
    const { account } = state;

    const [tokenAddress, settokenAddress] = useState<string>('0x000000000000000000000000000000000000bEEF'); // 0xbEEF as Ether
    const [decimals, setdecimals] = useState<string>('18');
    const [amounts, setamounts] = useState<string>('');
    const [btndisabled, setbtndisabled] = useState(true);

    useEffect(() => {
        if (!account || account === "" || !amounts || !tokenAddress || !decimals) {
            setbtndisabled(true)

        } else {
            setbtndisabled(false)
        }
    }, [account, amounts, tokenAddress, decimals])

    const handleInput = (e:ChangeEvent) => {
        const { name, value } = e.target as HTMLInputElement;

        console.log("=name===",name)

        switch (name) {
            case 'token':
                settokenAddress(value)
                break;
            case 'decimals':
                setdecimals(value)
                break;
            case 'amounts':
                setamounts(value)
                break;
            default: break;
        }
    }
    const nextPage = async () => {
        props.handleNext(2)
        const obj = {
             amounts, tokenAddress, decimals
        }
        dispatch({type: ActionType.STORE_FIRST,payload:obj});
    }

    const getChildrenMsg = (data:fileObj[]) => {
        console.log(data)
        let str = '';
        data.map(item => {
            str += `${item.address},${item.amount} \n`;
        })
        setamounts(str)
    }

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
                            value={tokenAddress}
                            onChange={(e)=>handleInput(e)}
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
                            name='decimals'
                            placeholder="Decimals"
                            value={decimals}
                            onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <div className="mb-3">
                <Excel getChildrenMsg={getChildrenMsg} />
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
                            value={amounts}
                             onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>

                </Col>
            </Row>
            <div>
                <Button
                    variant="flat"
                    onClick={()=>nextPage()}
                    disabled={btndisabled}
                >Next</Button>
            </div>



    </Box>
}