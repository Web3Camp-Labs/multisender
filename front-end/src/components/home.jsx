import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Table, Alert,Modal,Spinner } from 'react-bootstrap';
import Excel from './excel'

import Accounts from '../api/Account';

import tokenAbi from  '../config/ERC20.abi';
import senderAbi from '../config/sender.abi';
import senderAddress from '../config/contracts';

const Web3 = require('web3');

export default function Home() {

    const [account, setaccount] = useState('');
    const [tokenAddress, settokenAddress] = useState('0xd4342a57ecf2fe7ffa37c33cb8f63b1500e575e6');
    const [decimals, setdecimals] = useState('18');
    const [amounts, setamounts] = useState('');
    const [selected, setselected] = useState('');
    // const [list, setlist] = useState([]);
    const [defaultTab, setdefaultTab] = useState('first');
    const [tablelist, settablelist] = useState([]);
    const [transactionHash, settransactionHash] = useState([]);
    const [batchSendToken, setbatchSendToken] = useState([]);
    const [token, settoken] = useState('');

    const [totalAmount, settotalAmount] = useState(0);
    const [addressArray, setaddressArray] = useState([]);
    const [amountArray, setamountArray] = useState([]);
    const [allowance, setallowance] = useState(0);
    const [symbol, setsymbol] = useState('');
    const [mybalance, setmybalance] = useState(0);
    const [btndisabled,setbtndisabled] = useState(true)
    const [pageSize] = useState(200)
    const [ethBalance,setethBalance] = useState(0)
    const [showLoading, setshowLoading] = useState(false);
    const [tips, settips] = useState('');
    const [show, setShow] = useState(false);
    const [showChange, setshowChange] = useState(false);
    const [showNet, setshowNet] = useState(false);

    const web3 = new Web3(Web3.givenProvider);
    const mutliSender = new web3.eth.Contract(senderAbi, senderAddress.sender)



    window.ethereum.on('accountsChanged', function (arr) {
        setaccount(arr[0])
        setshowChange(true)
        setTimeout(()=>{
            setshowChange(false)
        },3000)
    });
    window.ethereum.on('chainChanged', (chainId) => {
        setshowNet(true)
        setTimeout(()=>{
            setshowNet(false)
        },3000)
    });

    const connectWallet = async () => {
        const accoutlist = await Accounts.accountlist().then(data=>{
            if(data.type === 'success'){
                setaccount(data.data)
            } else{
                setShow(true)
            }
        });
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
        // setlist(data)
        console.log(data)
        let str = '';
        data.map(item => {
            str += `${item.Address},${item.Amount} \n`;
        })
        setamounts(str)
    }
    useEffect(()=>{
        if (!account || account === "" || !amounts || !tokenAddress || !decimals) {
            setbtndisabled(true)

        }else{
            setbtndisabled(false)
        }
    },[account,amounts,tokenAddress,decimals])
    const nextPage = async () => {

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
        settablelist(arr)
        console.log("=====", obj)
        setdefaultTab('second')

        const token = await new web3.eth.Contract(tokenAbi, tokenAddress);
        console.log('token address: ', tokenAddress,token);
        settoken(token)

        setTotal()
        getAllowance(token)
        getSymbol(token)
        getBalanceOf(token)

        const ethBalance = await web3.eth.getBalance(account);
        console.log("==============ethBalance",ethBalance,)
        setethBalance(web3.utils.fromWei(ethBalance))

    }
    const setTotal =()=>{
        let lines = amounts.split('\n');
        let addressArray = [];
        let amountArray = [];
        let totalAmount = 0 ;
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
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
        settotalAmount(totalAmount)
        setaddressArray(addressArray)
        setamountArray(amountArray)
        console.log(`Total address : ${addressArray.length}, Total amount : ${totalAmount}`);

    }
    const getAllowance = async (token) => {
        const allowance = await token.methods.allowance(account, senderAddress.sender).call();
        console.log("My allowance: ", web3.utils.fromWei(allowance));
        setallowance(web3.utils.fromWei(allowance))
    }
    const getSymbol= async (token) => {
        const symbol = await token.methods.symbol().call();
        console.log('Token symbol: ', symbol);
        setsymbol(symbol)
    }
    const getBalanceOf= async (token) => {
        const mybalance = await token.methods.balanceOf(account).call();
        console.log("My balance: ", web3.utils.fromWei(mybalance));
        setmybalance(web3.utils.fromWei(mybalance))
    }

    const sendToken = async () => {
        setshowLoading(true)
        settips('waiting....')

        console.log(selected)
        const decimals = await token.methods.decimals().call();
        console.log('Decimals: ', decimals);

        // Step-1: Approve
        if(true) {
            const totalSupply = await token.methods.totalSupply().call();

            await token.methods.approve(senderAddress.sender, totalSupply).send({ from: account }).then(data=>{
                console.log('transactionHash',data);
                settips('transactionHash')
                settransactionHash(data.transactionHash)
            }).catch(err=>{
                setshowLoading(false)
            });
        } else {

            await token.methods.approve(senderAddress.sender, web3.utils.toWei(totalAmount.toString())).send({ from: account }).then(data=>{
                console.log('transactionHash',data);
                settips('transactionHash')
                settransactionHash(data.transactionHash)
            }).catch(err=>{
                setshowLoading(false)
            });
        }
        
        // Step-2: Sending
        let transIndex = 0;
        let batchSendTokenArr = [];
        for (let index = 0; index < addressArray.length; index += pageSize) {
            transIndex++;
            let addressArr = addressArray.slice(index, index + pageSize);
            let amountArr = amountArray.slice(index, index + pageSize);
            await mutliSender.methods.batchSendToken(tokenAddress, addressArr, amountArr).send({ from: account })
                .then(data=>{
                    console.log('batchSendToken', data);
                    batchSendTokenArr.push(data.transactionHash)
                    settips(`batchSendToken (${transIndex}/${Math.ceil(addressArray.length/pageSize)})`)
                    if(transIndex >= Math.ceil(addressArray.length/pageSize)){
                        setshowLoading(false)
                    }
                }).catch(err=>{
                    setshowLoading(false)
                });

        }
        setbatchSendToken(batchSendTokenArr)
        setdefaultTab('third')
    }

    return (
        <div className='homeBrdr'>

            <Modal
                show={showLoading}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => {}}
            >
                <Modal.Body className='loading'>
                    <div className="spinner">
                        <Spinner animation="border" variant="primary" />
                    </div>
                    <h4 className="waiting">{tips}</h4>
                </Modal.Body>
            </Modal>

            {show && <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Please install MetaMask!</Alert.Heading>
            </Alert>}
            {
                showChange && <Alert variant="success">Account was changed</Alert>
            }
            {
                showNet && <Alert variant="success">Chain was changed</Alert>
            }

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
                                    <Button variant="primary" onClick={nextPage} disabled={btndisabled}>Next</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="second" title="Step2. Confirm">
                    <div className="container">
                        <h5>List of recipients</h5>
                        <div className='tableBrdr'>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tablelist.map((i,index)=>(<tr key={`${i.address}_${index}`}>
                                        <td>{i.address}</td>
                                        <td>{i.amount}</td>
                                    </tr>))
                                }
                                </tbody>
                            </Table>
                        </div>

                        <h5>Summary</h5>
                        <Table bordered >
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        <div className='numbers'>{totalAmount} {symbol}</div>
                                        <div className="tips">Request approve amount</div>
                                    </td>
                                    <td>
                                        <div className='numbers'>{allowance} {symbol}</div>
                                        <div className="tips">Your current allowance</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%">
                                        <div className='numbers'>{addressArray.length}</div>
                                        <div className="tips">Total number of addresses</div>
                                    </td>
                                    <td>
                                        <div className='numbers'>{totalAmount} {symbol}</div>
                                        <div className="tips">Total number of tokens to be sent</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%">
                                        <div className='numbers'>{ Math.ceil(addressArray.length/pageSize)}</div>
                                        <div className="tips">Total number of transaction needed</div>
                                    </td>
                                    <td>
                                        <div className='numbers'>{mybalance} {symbol}</div>
                                        <div className="tips">Your token balance</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%">
                                        <div className='numbers' />
                                        <div className="tips">Approximate cost of operation</div>
                                    </td>
                                    <td>
                                        <div className='numbers'>{ethBalance} ETH</div>
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
                                name='approveAmount'
                                onChange={handleRadio}
                                value='extra'
                            />
                            <Form.Check
                                type="radio"
                                label="Unlimited amount"
                                name='approveAmount'
                                value='unlimited'
                                onChange={handleRadio}
                            />
                        </Form.Group>
                        <div>
                            <Button variant="primary"  onClick={sendToken}>Submit</Button>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="third" title="Step3. Result">
                    <div className="container result">
                        <h5>transactionHash</h5>
                        <ul className='transaction'>
                            {
                                transactionHash &&<li><a href={`https://kovan.etherscan.io/tx/${transactionHash}`}  target="_blank"  rel="noopener noreferrer">{transactionHash}</a></li>
                            }
                        </ul>
                        <h5>batchSendToken</h5>
                        <ul>
                            {
                                batchSendToken && batchSendToken.map(i=>(<li key={i}><a href={`https://kovan.etherscan.io/tx/${i}`}  target="_blank"  rel="noopener noreferrer">{i}</a></li> ))
                            }
                        </ul>
                    </div>
                </Tab>
            </Tabs>


        </div>
    );
}
