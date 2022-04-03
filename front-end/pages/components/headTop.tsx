import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from "next/link";

import Accounts from '../api/Account';

export default function HeaderTop() {
    const [account, setaccount] = useState('');
    const [show, setShow] = useState(false);

    const connectWallet = async () => {
        await Accounts.accountlist().then(data => {
            if (data.type === 'success') {
                setaccount(data.data)
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
