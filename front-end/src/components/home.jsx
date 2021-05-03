import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap';
import Excel from './excel'

import Accounts from '../api/Account';

import tokenAbi from  '../config/ERC20.abi';
import senderAbi from '../config/sender.abi';
import senderAddress from '../config/contracts';

const Web3 = require('web3');

export default function Home() {

    const [account, setaccount] = useState('');
    const [tokenAddress, settokenAddress] = useState('');
    const [decimals, setdecimals] = useState('');
    const [amounts, setamounts] = useState('');
    const [selected, setselected] = useState('');
    const [list, setlist] = useState([]);
    const [defaultTab, setdefaultTab] = useState('first');

    const connectWallet = async () => {
        const accoutlist = await Accounts.accountlist();
        setaccount(accoutlist)
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'token':
                settokenAddress(e.target.value)
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
    const getChildrenMsg = (data) => {
        setlist(data)
        console.log(data)
        let str = '';
        data.map(item => {
            str += `${item.Address},${item.Amount} \n`;
        })
        setamounts(str)
    }
    const nextPage = () => {

        let amountlist = amounts.split('\n');
        let arr = [];
        amountlist.map(item => {
            if (!item) return;
            arr.push({
                address: item.split(',')[0],
                amount: parseFloat(item.split(',')[1]),
            })
        })

        let obj = {
            tokenAddress,
            decimals,
            transaction: arr
        }
        console.log("=====", obj)


        sendToken()
        setdefaultTab('second')

    }
    const sendToken = async () => {
        var web3 = new Web3(Web3.givenProvider);
        const mutliSender = new web3.eth.Contract(senderAbi, senderAddress.sender)
        console.log('mutliSender ', mutliSender);

        const token = new web3.eth.Contract(tokenAbi, tokenAddress);
        console.log('token address: ', tokenAddress);


        if (!account || account == "") {
            await connectWallet();
        }

        console.log('account: ', account);

        console.log('amounts', amounts);

        let lines = amounts.split('\n');
        // console.log('lines: ', lines);

        let addressArray = [];
        let amountArray = [];
        let totalAmount = 0 ;
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length == 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            let amount = web3.utils.toWei(values[1].trim());

            if (!web3.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            addressArray.push(address);
            amountArray.push(amount);

            totalAmount += parseFloat(values[1].trim());
        }

        console.log(`Total address : ${addressArray.length}, Total amount : ${totalAmount}`);

        const res = await token.methods.approve(senderAddress.sender, web3.utils.toWei(totalAmount.toString())).send({ from: account });
        console.log(res);


        const pageSize = 150;
        // let index = 0;
        for (let index = 0; index < addressArray.length; index += pageSize) {
            let addressArr = addressArray.slice(index, index + pageSize);
            let amountArr = amountArray.slice(index, index + pageSize);
            const res = await mutliSender.methods.batchSendToken(tokenAddress, addressArr, amountArr).send({ from: account });
            console.log('batchSendToken', res);

            index += pageSize;
        }

    }

    return (
        <div className='homeBrdr'>
            <div className='wallet'>
                {
                    !account && <Button variant="primary" onClick={connectWallet}>connect Wallet</Button>
                }
                {
                    account && <span>{account}</span>
                }
            </div>
            <Tabs activeKey={defaultTab} onSelect={(k) => setdefaultTab(k)}>
                <Tab eventKey="first" title="Step1. Prepare">
                    <div className="container ">
                        <div className="row">
                            <div className="col-9">
                                <Form.Group>
                                    <Form.Label>Token</Form.Label>
                                    <Form.Control
                                        name='token'
                                        value={tokenAddress}
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
                                        onChange={handleInput} />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Excel getChildrenMsg={getChildrenMsg} />
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Addresses with Amounts</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={8}
                                        name='amounts'
                                        value={amounts}
                                        onChange={handleInput} />
                                </Form.Group>
                                <div>
                                    <Button variant="primary" onClick={nextPage}>Next</Button>
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
                        <Table bordered >
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
