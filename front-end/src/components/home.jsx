import React, {useState, useEffect} from 'react';
import { Tabs,Tab,Form,Button,Table } from 'react-bootstrap';
import Excel from './excel'

import Accounts from '../api/Account';

import senderAbi from '../config/sender.abi';
import senderAddress from '../config/contracts';

const Web3 = require('web3');

export default function Home() {

    const [account, setaccount] = useState('');
    const [token, settoken] = useState('');
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
    const getChildrenMsg = (data) => {
        setlist(data)
        console.log(data)
        let str='';
        data.map(item=>{
            str+=`${item.Address},${item.Amount} \n`;
        })
        setamounts(str)
    }
    const nextPage = () =>{

        let amountlist = amounts.split('\n');
        let arr=[];
        amountlist.map(item=>{
            if(!item)return;
            arr.push({
                address:item.split(',')[0],
                amount: parseInt(item.split(',')[1]),
            })
        })

        let obj={
            token,
            decimals,
            transaction:arr
        }
        console.log("=====",obj)


        web3Connect()
        setdefaultTab('second')

    }
    const web3Connect = async () =>{
        var web3 = new Web3(Web3.givenProvider );
        console.log(web3.eth,senderAbi)



        // const acc = await web3.eth.getAccounts();
        // console.log(acc)
        //
        // let abi = web3.eth.abi.encodeFunctionSignature('myMethod(uint256,string)')
        // console.log("===",abi)
        //
        //
        //
        // const Multisend = new web3.eth.Contract(
        //     contract_consts.bulksendContractDetails.ABI,
        //     contract_consts.bulksendContractDetails.contractAddress)
        // console.log(Multisend)
        //
        // // 0x6317f2331ce31ca51b9ed439b62df697d306ca82
        // const address = '0x6317f2331ce31ca51b9ed439b62df697d306ca82'
        // const ethBalance = await web3.eth.getBalance(address);
        // const owner = await Multisend.methods.owner().call();
        // console.log(ethBalance,owner)
        //
        const merkleAirdrop = new web3.eth.Contract(senderAbi, senderAddress.sender)
        console.log('merkleAirdrop',merkleAirdrop)
        const numAirdrop = await merkleAirdrop.methods.batchSendToken().call();
        console.log('numAirdrop',numAirdrop)
        //
        // const uriPromises = []
        // for (let i = 1; i <= numAirdrop; i++) {
        //     uriPromises.push(merkleAirdrop.methods.airdrops(i).call());
        // }
        // const airdrops = await Promise.all(uriPromises);
        // console.log('airdrops', airdrops);
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
            <Tabs activeKey={defaultTab}    onSelect={(k) => setdefaultTab(k)}>
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
                                <Excel getChildrenMsg={getChildrenMsg}/>
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
