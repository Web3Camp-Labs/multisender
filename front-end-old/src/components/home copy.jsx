import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Table, Alert, Modal, Spinner } from 'react-bootstrap';
import styled from "styled-components";

import Excel from './excel'

import Accounts from '../api/Account';

import tokenAbi from '../abi/ERC20.abi';
import senderAbi from '../abi/sender.abi';

import kovanConfig from '../config/kovan.json';
import mainnetConfig from '../config/mainnet.json';

import hecoConfig from '../config/heco.json';
import hecotestConfig from '../config/hecotest.json';

import bscConfig from '../config/bsc.json';
import bsctestConfig from '../config/bsctest.json';

const contracts = {
    mainnet: mainnetConfig.sender,
    kovan: kovanConfig.sender,
    heco: hecoConfig.sender,
    hecotest: hecotestConfig.sender,
    bsc: bscConfig.sender,
    bsctest: bsctestConfig.sender,
}

const Web3 = require('web3');

export default function Home() {

    const [account, setaccount] = useState('');
    // eslint-disable-next-line
    const [tokenAddress, settokenAddress] = useState('0x000000000000000000000000000000000000bEEF'); // 0xbEEF as Ether
    const [decimals, setdecimals] = useState('18');
    const [amounts, setamounts] = useState('');
    const [selected, setselected] = useState('');
    // const [list, setlist] = useState([]);
    const [defaultTab, setdefaultTab] = useState('first');
    const [tablelist, settablelist] = useState([]);
    const [txHash, setTxHash] = useState([]);
    const [txHashList, setTxHashList] = useState([]);
    const [token, settoken] = useState('');

    const [totalAmount, settotalAmount] = useState(0);
    const [addressArray, setaddressArray] = useState([]);
    const [amountWeiArray, setamountWeiArray] = useState([]);
    const [allowance, setallowance] = useState(0);
    const [symbol, setsymbol] = useState('');
    const [mybalance, setmybalance] = useState(0);
    const [btndisabled, setbtndisabled] = useState(true);
    const [pageSize] = useState(200); // Default 200 transfer per tx
    const [ethBalance, setethBalance] = useState('0');
    const [showLoading, setshowLoading] = useState(false);
    const [tips, settips] = useState('');
    const [show, setShow] = useState(false);
    const [showChange, setshowChange] = useState(false);
    const [showNet, setshowNet] = useState(false);
    const [txURL, setTxURL] = useState('');

    const web3 = new Web3(Web3.givenProvider);


    var mutliSender = null;
    var senderAddress = null;

    window.ethereum.on('accountsChanged', function (arr) {
        setaccount(arr[0])
        setshowChange(true)
        setTimeout(() => {
            setshowChange(false)
        }, 3000)
    });

    window.ethereum.on('chainChanged', (chainId) => {
        setshowNet(true)
        setTimeout(() => {
            setshowNet(false)
        }, 3000)
    });

    const onChainIdChanged = async () => {
        initContract();
    }

    const initContract = async () => {

        let url = null;

        const chainId = await web3.eth.getChainId();
        console.log('chainId', chainId);

        if (chainId === 1) {
            senderAddress = contracts.mainnet;
            url = 'https://etherscan.io/tx/';
        } else if (chainId === 42) {
            senderAddress = contracts.kovan;
            url = 'https://kovan.etherscan.io/tx/';
        } else if (chainId === 128) {
            senderAddress = contracts.heco;
            url = 'https://hecoinfo.com/tx/';
        } else if (chainId === 256) {
            senderAddress = contracts.hecotest;
            url = 'https://testnet.hecoinfo.com/tx/';
        } else if (chainId === 56) {
            senderAddress = contracts.bsc;
            url = 'https://bscscan.com/tx/';
        } else if (chainId === 97) {
            senderAddress = contracts.bsctest;
            url = 'https://testnet.bscscan.com/tx/';
        } else {
            console.error('Unsupported network!!!!');
            return;
        }

        setTxURL(url);

        console.log("sender address: ", senderAddress);

        mutliSender = await new web3.eth.Contract(senderAbi, senderAddress);
    };

    const connectWallet = async () => {
        await Accounts.accountlist().then(data => {
            if (data.type === 'success') {
                setaccount(data.data)
            } else {
                setShow(true)
            }
        });
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
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

    const handleRadio = (e) => {
        setselected(e.target.value)
    }

    const getChildrenMsg = (data) => {
        console.log(data)
        let str = '';
        data.map(item => {
            str += `${item.Address},${item.Amount} \n`;
        })
        setamounts(str)
    }

    useEffect(() => {
        if (!account || account === "" || !amounts || !tokenAddress || !decimals) {
            setbtndisabled(true)

        } else {
            setbtndisabled(false)
        }
    }, [account, amounts, tokenAddress, decimals])

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

        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            let obj = {
                tokenAddress,
                decimals,
                transaction: arr
            };
            settablelist(arr);
            console.log("=====", obj);
            setdefaultTab('second')

            console.log("Send Ether ...");

            settoken(null);

            setTotal();

            setallowance(0);
            setsymbol("ETH");

            const ethBalance = await web3.eth.getBalance(account);

            console.log("My balance: ", web3.utils.fromWei(ethBalance));
            setmybalance(web3.utils.fromWei(ethBalance))

            console.log("==============ethBalance", ethBalance,);
            setethBalance(web3.utils.fromWei(ethBalance));

        } else { // ERC20
            let obj = {
                tokenAddress,
                decimals,
                transaction: arr
            }
            settablelist(arr)
            console.log("=====", obj)
            setdefaultTab('second')

            const token = await new web3.eth.Contract(tokenAbi, tokenAddress);
            console.log('Send ERC20 token, token address: ', tokenAddress, token);
            settoken(token);

            setTotal();

            const allowance = await token.methods.allowance(account, senderAddress).call();
            console.log("My allowance: ", web3.utils.fromWei(allowance));
            setallowance(web3.utils.fromWei(allowance))

            const symbol = await token.methods.symbol().call();
            console.log('Token symbol: ', symbol);
            setsymbol(symbol)

            const mybalance = await token.methods.balanceOf(account).call();
            console.log("My balance: ", web3.utils.fromWei(mybalance));
            setmybalance(web3.utils.fromWei(mybalance))

            const ethBalance = await web3.eth.getBalance(account);
            console.log("==============ethBalance", ethBalance,)
            setethBalance(web3.utils.fromWei(ethBalance))
        }
    }


    const setTotal = () => {
        let lines = amounts.split('\n');
        let addressArray = [];
        let _amountWeiArray = [];
        let totalAmount = 0;

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            let amountWei = web3.utils.toWei(values[1].trim());
            let amount = parseFloat(values[1].trim());

            if (!web3.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            addressArray.push(address);
            _amountWeiArray.push(amountWei);

            totalAmount += amount;
        }

        settotalAmount(totalAmount);
        setaddressArray(addressArray);
        setamountWeiArray(_amountWeiArray);
        console.log(`Total address : ${addressArray.length}, Total amount : ${totalAmount}`);
    }

    const doBatchSend = async () => {
        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            // Send Ether
            sendEther();
        } else {
            // Send ERC20 Token
            sendERC20Token();
        }
    }

    const sendEther = async () => {
        setshowLoading(true);
        settips('Waiting...');

        console.log(selected);

        // Step-1: Check balance...
        let lines = amounts.split('\n');
        let _addressArray = [];
        let _amountWeiArray = [];
        // let _totalAmount = 0;
        let _totalAmount = new web3.utils.BN(0);

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            let amountWei = web3.utils.toWei(values[1].trim());

            if (!web3.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            _addressArray.push(address);
            _amountWeiArray.push(amountWei);

            _totalAmount = _totalAmount.add(web3.utils.toBN(amountWei));
        }

        let pageNum = Math.ceil(_addressArray.length / pageSize);
        let addressArr = _addressArray.slice(0, pageSize);
        let amountWeiArr = _amountWeiArray.slice(0, pageSize);

        console.log("total amount: ", _totalAmount);
        console.log("total amount string: ", web3.utils.toWei(_totalAmount));

        let encodedData = await mutliSender.methods.batchSendEther(addressArr, amountWeiArr).encodeABI({ from: account });

        console.log('encodedData: ', encodedData);

        let gas = await web3.eth.estimateGas({
            from: account,
            data: encodedData,
            value: web3.utils.toHex(_totalAmount.toString()),
            to: senderAddress
        });

        let gasPrice = 5;
        let gasWei = gas * gasPrice;

        console.log('gas', gas);
        console.log("gas wei: ", gasWei);

        let totalNeedWei = _totalAmount.add(web3.utils.toBN(pageNum * gasWei));
        console.log("total need: ", totalNeedWei.toString());

        // fixme: need handle error here!
        console.log("balance: ", web3.utils.toBN(web3.utils.toWei(ethBalance)).toString());

        if (totalNeedWei.gt(web3.utils.toBN(web3.utils.toWei(ethBalance)))) {
            console.error("Insufficent fund!");
            return;
        }

        // Step-2: Sending Ether...
        let txIndex = 0;
        let txHashArr = [];
        for (let index = 0; index < addressArray.length; index += pageSize) {
            txIndex++;
            let addressArr = addressArray.slice(index, index + pageSize);
            let amountWeiArr = amountWeiArray.slice(index, index + pageSize);

            let sendValue = amountWeiArr.reduce((a, b) => web3.utils.toBN(a).add(web3.utils.toBN(b)).toString(), 0);

            settips(`Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            await mutliSender.methods.batchSendEther(addressArr, amountWeiArr)
                .send({
                    from: account,
                    value: web3.utils.toHex(sendValue)
                })
                .then(data => {
                    console.log('batchSendEther', data);
                    txHashArr.push(data.transactionHash);
                    if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                        setshowLoading(false);
                    }
                }).catch(err => {
                    setshowLoading(false);
                });
        }
        setTxHashList(txHashArr);
        setdefaultTab('third');
    }

    const sendERC20Token = async () => {
        setshowLoading(true);
        settips('Waiting...');

        console.log(selected)
        const decimals = await token.methods.decimals().call();
        console.log('Decimals: ', decimals);

        // Step-1: Approve
        if (allowance < totalAmount) {
            if (selected === 'unlimited') {
                const totalSupply = await token.methods.totalSupply().call();

                await token.methods.approve(senderAddress, totalSupply).send({ from: account }).then(data => {
                    console.log('txHash', data);
                    settips('Unlimited Approve in progress...')
                    setTxHash(data.transactionHash)
                }).catch(err => {
                    setshowLoading(false)
                });
            } else {
                await token.methods.approve(senderAddress, web3.utils.toWei(totalAmount.toString())).send({ from: account }).then(data => {
                    console.log('txHash', data);
                    settips('Approve in progress...')
                    setTxHash(data.transactionHash)
                }).catch(err => {
                    setshowLoading(false)
                });
            }
        } else {
            console.log('Already have enough allowance!');
        }

        // Step-2: Sending
        let txIndex = 0;
        let txHashArr = [];
        for (let index = 0; index < addressArray.length; index += pageSize) {
            txIndex++;
            let addressArr = addressArray.slice(index, index + pageSize);
            let amountArr = amountWeiArray.slice(index, index + pageSize);

            settips(`Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            await mutliSender.methods.batchSendERC20(tokenAddress, addressArr, amountArr).send({ from: account })
                .then(data => {
                    console.log('batchSendERC20', data);
                    txHashArr.push(data.transactionHash);
                    if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                        setshowLoading(false);
                    }
                }).catch(err => {
                    setshowLoading(false);
                });

        }
        setTxHashList(txHashArr);
        setdefaultTab('third');
    }


    initContract();

    return (
        <div className='homeBrdr'>

            <Modal
                show={showLoading}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => { }}
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
                                    <Button variant="flat" onClick={nextPage} disabled={btndisabled}>Next</Button>
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
                                        tablelist.map((i, index) => (<tr key={`${i.address}_${index}`}>
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
                                        <div className='numbers'>{Math.ceil(addressArray.length / pageSize)}</div>
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
                            <Button variant="primary" onClick={doBatchSend}>Submit</Button>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="third" title="Step3. Result">
                    <div className="container result">
                        <h5>Approval history</h5>
                        <ul className='transaction'>
                            {
                                txHash && <li><a href={`${txURL}/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></li>
                            }
                        </ul>
                        <h5>Transactions history</h5>
                        <ul>
                            {
                                txHashList && txHashList.map(i => (<li key={i}><a href={`${txURL}/${i}`} target="_blank" rel="noopener noreferrer">{i}</a></li>))
                            }
                        </ul>
                    </div>
                </Tab>
            </Tabs>


        </div>
    );
}
