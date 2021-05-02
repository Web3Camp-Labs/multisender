import React, {useState, useEffect} from 'react';
import { Tabs,Tab,Form,Button,Table } from 'react-bootstrap';
import Excel from './excel'

import Accounts from '../api/Account';

export default function Home() {

    const [account, setaccount] = useState('');
    const [token, settoken] = useState('');
    const [decimals, setdecimals] = useState('');
    const [amounts, setamounts] = useState('');
    const [selected, setselected] = useState('');

    const connectWallet = async () => {
        const accoutlist = await Accounts.accountlist();
        setaccount(accoutlist)
    }

    const handleInput = (e) => {
        const {name, value} = e.target;
        switch(name){
            case 'token':
                settoken(e.target.value)
                break;
            case 'decimals':
                setdecimals(e.target.value)
                break;
            case 'amounts':
                setamounts(e.target.value)
                break;
        }
    }
    const handleRadio = (e) => {
        setselected(e.target.value)
    }

    return (
        <div className='homeBrdr'>
            <div className='wallet'>
                {
                    !account && <Button variant="primary"  onClick={connectWallet}>connect Wallet</Button>
                }

                {
                    account && <span>{account}</span>
                }
            </div>
            <Tabs defaultActiveKey="first" >
                <Tab eventKey="first" title="Step1. Prepare">
                    <div className="container ">
                        <div className="row">
                            <div className="col-9">
                                <Form.Group>
                                    <Form.Label>Token</Form.Label>
                                    <Form.Control
                                        name='token'
                                        value={token}
                                        onChange={handleInput}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-3">
                                <Form.Group>
                                    <Form.Label>Decimals</Form.Label>
                                    <Form.Control
                                        name='decimals'
                                        value={decimals}
                                        onChange={handleInput}/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {/*<div>*/}
                                {/*    <Button variant="primary"  onClick={UploadFile}>Upload</Button>*/}
                                {/*</div>*/}
                                <Excel />
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Addresses with Amounts</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={8}
                                        name='amounts'
                                        value={amounts}
                                        onChange={handleInput}/>
                                </Form.Group>
                                <div>
                                    <Button variant="primary">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="second" title="Step2. Confirm">
                    <div className="container">
                        <h5>List of recipients</h5>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Address</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            </tbody>
                        </Table>
                        <h5>Summary</h5>
                        <Table  bordered >
                            <tbody>
                            <tr>
                                <td width="50%">
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Request approve amount</div>
                                </td>
                                <td>
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Your current allowance</div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Total number of addresses</div>
                                </td>
                                <td>
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Total number of tokens to be sent</div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Total number of transaction needed</div>
                                </td>
                                <td>
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Your token balance</div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Approximate cost of operation</div>
                                </td>
                                <td>
                                    <div className='numbers'>200 APN</div>
                                    <div className="tips">Your ETH balance</div>
                                </td>
                            </tr>

                            </tbody>
                        </Table>
                        <h5>Amount to Approve</h5>
                        <Form.Group className='radioGroup'>
                            <Form.Check
                                type="radio"
                                label="Extra amount to sent"
                                name='radioGroup'
                                onChange={handleRadio}
                                value='extra'
                            />
                            <Form.Check
                                type="radio"
                                label="Unlimited amount"
                                name='radioGroup'
                                value='unlimited'
                                onChange={handleRadio}
                            />
                        </Form.Group>
                        <div>
                            <Button variant="primary">
                                Next
                            </Button>
                        </div>
                    </div>
                </Tab>
            </Tabs>


        </div>
    );
}
