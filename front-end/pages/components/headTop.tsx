import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import {ActionType} from "../api/types";

import Accounts from '../api/Account';
import {useWeb3} from "../api/connect";

export default function HeaderTop() {
    const {dispatch} = useWeb3();
    const [account, setaccount] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const connectWallet = async () => {
        await Accounts.accountList().then(data => {
            if (data.type === 'success') {
                setaccount(data.data)
                dispatch({type: ActionType.SET_ACCOUNT,payload:data?.data});
            } else {
                setShow(true)
            }
        });
    }


    useEffect(() => {
        (window as any).ethereum.on('chainChanged', () => {
            window.location.reload()
        });
    }, [])
    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={8} xs={12}>Batch Sender</Col>
                <Col className="headetRht" md={4} xs={12}> <div className='wallet'>
                    {
                        !account && <Button variant="flat" onClick={connectWallet}>connect Wallet</Button>
                    }
                    {
                        account && <span>{account}</span>
                    }
                </div></Col>
            </Row>
        </Container>
    </div>
}
