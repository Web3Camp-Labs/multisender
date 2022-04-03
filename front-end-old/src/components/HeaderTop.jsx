import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Accounts from '../api/Account';

export default function HeaderTop() {

    const [account, setaccount] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        window.ethereum.on('chainChanged', () => {
            window.location.reload()
        });
    }, [])

    const connectWallet = async () => {
        await Accounts.accountlist().then(data => {
            if (data.type === 'success') {
                setaccount(data.data)
            } else {
                setShow(true)
            }
        });
    }

    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={8} xs={12}>Batch Sender.</Col>
                <Col className="headetRht" md={4} xs={12}> <a href="https://web3camp.us">&copy; Web3Camp.us</a></Col>
            </Row>
            <div className='wallet'>
                {
                    !account && <Button variant="primary" onClick={connectWallet}>connect Wallet</Button>
                }
                {
                    account && <span>{account}</span>
                }
            </div>
        </Container>
    </div>
}
