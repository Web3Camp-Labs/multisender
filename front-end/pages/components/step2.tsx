import { Form, Table, Button } from 'react-bootstrap';
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { useWeb3 } from "../api/connect";
import { ethers, BigNumber } from 'ethers';
import TokenAbi from '../abi/ERC20.abi.json';

import senderAbi from '../abi/sender.abi.json';

import kovanConfig from '../config/kovan.json';
import mainnetConfig from '../config/mainnet.json';

import hecoConfig from '../config/heco.json';
import hecotestConfig from '../config/hecotest.json';

import bscConfig from '../config/bsc.json';
import bsctestConfig from '../config/bsctest.json';

const Box = styled.div`
  padding: 40px 0;
  .numbers{
    font-size: 20px;
  }
  .tips{
    font-size: 12px;
    color: #999;
  }
  h5{
    padding:10px 0 5px 10px;
    color: #000000;
  }
  .ml2{
    margin-left: 10px;
  }
`
const TableBox = styled.div`
    margin-top: 10px;
  .tableStyle{
    border-top: 1px solid #eee;
    color: #666666;
    th{
      height: 60px;
      line-height: 60px;
    }
    .first{
      display: flex;
      justify-content: center;
      align-items: stretch;
      .form-check-inline{
        margin-right: 0;
        display: flex;
        margin-top: 13px;
      }
    }
    td{
      line-height: 50px;
      word-break: break-all;
      &:nth-child(4){
       width: 30%;
      }
    }
    tr:nth-child(2n+1) td{
      background:rgba(255,255,255,0.3)!important;
      color: #666666!important;
    }
    tr:hover td{
      background:rgba(0,0,0,0.01)!important;
    }
  }
`

const H5Box = styled.h5`
  display: inline-block;
  margin-bottom: 20px;
`
interface accountObj {
    address: string
    amount: number
}

interface contractAddressObj {
    mainnet: string
    kovan: string
    heco: string
    hecotest: string
    bsc: string
    bsctest: string
}

const contracts: contractAddressObj = {
    mainnet: mainnetConfig.sender,
    kovan: kovanConfig.sender,
    heco: hecoConfig.sender,
    hecotest: hecotestConfig.sender,
    bsc: bscConfig.sender,
    bsctest: bsctestConfig.sender,
}


export default function Step2() {
    const { state } = useWeb3();
    const { account, first, web3Provider } = state;

    const [totalAmount, setTotalAmount] = useState<string>('0');
    const [allowance, setAllowance] = useState<string>('0');
    const [amountWeiArray, setAmountWeiArray] = useState<string[]>([]);
    const [mybalance, setmybalance] = useState<string>('0');
    const [ethBalance, setethBalance] = useState<string>('0');

    const [tablelist, setTablelist] = useState<accountObj[]>([])
    const [addressArray, setAddressArray] = useState<string[]>([]);
    const [pageSize] = useState<number>(200); // Default 200 transfer per tx
    const [symbol, setSymbol] = useState<string>('');
    const [tokenContract, setTokenContract] = useState<ethers.Contract | null>();
    const [multiSenderAddress, setMultiSenderAddress] = useState<string>('');
    const [txURL, setTxURL] = useState<string>('');
    const [selected, setselected] = useState<string>('');
    const [showLoading, setshowLoading] = useState<boolean>(false);
    const [tips, settips] = useState<string>('');
    const [txHashList, setTxHashList] = useState<string[]>([]);
    const [txHash, setTxHash] = useState<string>('');

    useEffect(() => {
        if (first == null) return;
        const { amounts, tokenAddress, decimals } = first;

        // Split addresses
        let amountlist = amounts.split('\n');
        let arr: accountObj[] = [];
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
        };
        console.log("=====", obj);

        setTablelist(arr);
        setTotal();

        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            handleETH();
        } else { // ERC20
            handleERC20();
        }
    }, [first])

    const setTotal = () => {
        if (first == null) return;
        const { amounts } = first;

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
            let amountWei = ethers.utils.parseEther(values[1].trim()).toString();
            let amount = parseFloat(values[1].trim());

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            addressArray.push(address);
            _amountWeiArray.push(amountWei);

            totalAmount += amount;
        }

        setTotalAmount(totalAmount.toString());
        setAddressArray(addressArray);
        setAmountWeiArray(_amountWeiArray);
        console.log(`Total address : ${addressArray.length}, Total amount : ${totalAmount}`);
    }

    const initMultiSenderAddress = async () => {

        let url = null;

        // const chainId = await ethers.getChainId();

        const { chainId } = await web3Provider.getNetwork();
        console.log('chainId', chainId);

        let sender
        if (chainId === 1) {
            sender = contracts.mainnet;
            url = 'https://etherscan.io/tx/';
        } else if (chainId === 42) {
            sender = contracts.kovan;
            url = 'https://kovan.etherscan.io/tx/';
        } else if (chainId === 128) {
            sender = contracts.heco;
            url = 'https://hecoinfo.com/tx/';
        } else if (chainId === 256) {
            sender = contracts.hecotest;
            url = 'https://testnet.hecoinfo.com/tx/';
        } else if (chainId === 56) {
            sender = contracts.bsc;
            url = 'https://bscscan.com/tx/';
        } else if (chainId === 97) {
            sender = contracts.bsctest;
            url = 'https://testnet.bscscan.com/tx/';
        } else {
            console.error('Unsupported network!!!!');
            return;
        }
        setMultiSenderAddress(sender)
        setTxURL(url);

        console.log("sender address: ", multiSenderAddress);


    };
    useEffect(() => {
        if (tokenContract == null || !multiSenderAddress) return;
        getAllowance()

    }, [tokenContract, multiSenderAddress])

    useEffect(() => {
        initMultiSenderAddress()
    }, [])

    const getAllowance = async () => {
        if (tokenContract == null || account == null) return;
        const allowance = await tokenContract.allowance(account, multiSenderAddress);
        console.log("My allowance: ", allowance.toString());
        setAllowance(ethers.utils.formatEther(allowance));

        const symbol = await tokenContract.symbol();
        console.log('Token symbol: ', symbol);
        setSymbol(symbol);

        const mybalance = await tokenContract.balanceOf(account);
        const balanceAfter = ethers.utils.formatEther(mybalance);
        console.log("My balance: ", balanceAfter);
        setmybalance(balanceAfter);

        const signer = web3Provider.getSigner(account);
        const ethBalance = await signer.getBalance();

        setethBalance(ethers.utils.formatEther(ethBalance));
    }

    const handleETH = async () => {
        setTokenContract(null);
        setAllowance('0');
        setSymbol("ETH");

        const signer = web3Provider.getSigner(account);
        const ethBalance = await signer.getBalance()
        let ethBalanceAfter = ethers.utils.formatEther(ethBalance);
        setmybalance(ethBalanceAfter);
        setethBalance(ethBalanceAfter);
    }

    const handleERC20 = async () => {
        if (first == null) return;
        const { tokenAddress } = first;
        const token = new ethers.Contract(tokenAddress, TokenAbi, web3Provider);
        await token.deployed();
        console.log('Send ERC20 token, token address: ', tokenAddress, token);
        setTokenContract(token);

    }

    const handleRadio = (e: ChangeEvent) => {
        const { value } = e.target as HTMLInputElement
        setselected(value)
    }

    const doBatchSend = async () => {
        if (first == null) return;
        const { tokenAddress } = first;
        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            // Send Ether
            sendEther();
        } else {
            // Send ERC20 Token
            sendERC20Token();
        }
    }


    const sendEther = async () => {

        if (first == null) return;
        const { amounts, tokenAddress } = first;
        setshowLoading(true);
        settips('Waiting...');

        console.log(selected);


        // Step-1: Check balance...
        let lines = amounts.split('\n');
        let _addressArray = [];
        let _amountWeiArray = [];
        // let _totalAmount = 0;

        let _totalAmount = BigNumber.from('0');

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            let amountWei = ethers.utils.parseEther(values[1].trim());

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            _addressArray.push(address);
            _amountWeiArray.push(amountWei);

            _totalAmount = _totalAmount.add(BigNumber.from(amountWei));
        }

        console.log("total amount: ", _totalAmount);
        console.log("total amount string: ", ethers.utils.formatEther(_totalAmount));

        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        await multiSender.deployed();

        const signer = web3Provider.getSigner(account);
        console.log('signer: ', signer);
        console.log('multiSender: ', multiSender);
        console.log('multiSender estimateGas', multiSender.estimateGas);

        // Estimate gas
        // let pageNum = Math.ceil(_addressArray.length / pageSize);
        // let addressArr = _addressArray.slice(0, pageSize);
        // let amountWeiArr = _amountWeiArray.slice(0, pageSize);
        // let gas = await multiSender.estimateGas.batchSendEther(addressArr, amountWeiArr);

        // // fixme: need handle price and error here!
        // let gasPrice = await web3Provider.getGasPrice();
        // let gasWei = gas.mul(BigNumber.from(gasPrice));
        // console.log('gas', gas);
        // console.log("gas wei: ", gasWei);
        // let totalNeedWei = _totalAmount.add(BigNumber.from(pageNum).mul(gasWei));
        // console.log("total need: ", totalNeedWei.toString());
        // console.log("balance: ", BigNumber.from(ethers.utils.parseEther(ethBalance)).toString());
        // if (totalNeedWei.gt(BigNumber.from(ethers.utils.parseEther(ethBalance)))) {
        //     console.error("Insufficent fund!");
        //     return;
        // }

        // Step-2: Sending Ether...
        let txIndex = 0;
        let txHashArr: string[] = [];
        for (let index = 0; index < addressArray.length; index += pageSize) {
            txIndex++;
            let addressArr = _addressArray.slice(index, index + pageSize);
            let amountWeiArr = _amountWeiArray.slice(index, index + pageSize);

            let sendValue = amountWeiArr.reduce((a, b) => a.add(b));

            settips(`Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            await multiSender.connect(signer).batchSendEther(addressArr, amountWeiArr, { from: account, value: ethers.utils.hexValue(sendValue) }).then((data: { hash: string; }) => {
                console.log('batchSendEther', data);
                txHashArr.push(data.hash);
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    setshowLoading(false);
                }
            }).catch((err: any) => {
                console.error('batchSendEther error: ', err);
                setshowLoading(false);
            });
        }
        setTxHashList(txHashArr);
    }

    const sendERC20Token = async () => {
        if (first == null || tokenContract == null) return;
        setshowLoading(true);
        settips('Waiting...');

        const { amounts, tokenAddress } = first;

        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        await multiSender.deployed();

        const signer = web3Provider.getSigner(account);
        console.log('signer: ', signer);
        console.log('multiSender: ', multiSender);

        console.log(selected);
        const decimals = await tokenContract.decimals();
        console.log('Decimals: ', decimals);

        // Step-1: Check balance...
        let lines = amounts.split('\n');
        let _addressArray = [];
        let _amountWeiArray = [];

        let _totalAmount = BigNumber.from('0');

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            let amountWei = ethers.utils.parseEther(values[1].trim());

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            _addressArray.push(address);
            _amountWeiArray.push(amountWei);

            _totalAmount = _totalAmount.add(BigNumber.from(amountWei));
        }

        let _allowance = await tokenContract.allowance(account, multiSenderAddress);
        console.log("My allowance: ", _allowance.toString());

        // Step-2: Approve
        if (_allowance.lt(_totalAmount)) {
            if (selected === 'unlimited') {
                // const totalSupply = await tokenContract.totalSupply();

                await tokenContract.connect(signer).approve(multiSenderAddress, ethers.constants.MaxUint256).then((data: { hash: string }) => {
                    console.log('txHash', data);
                    settips('Unlimited Approve in progress...')
                    setTxHash(data.hash);
                }).catch((err: any) => {
                    console.error('approve error: ', err);
                    setshowLoading(false);
                });
            } else {
                await tokenContract.connect(signer).approve(multiSenderAddress, _totalAmount).then((data: { hash: string }) => {
                    console.log('txHash', data);
                    settips('Approve in progress...');
                    setTxHash(data.hash);
                }).catch((err: any) => {
                    console.error('approve error: ', err);
                    setshowLoading(false);
                });
            }
        } else {
            console.log('Already have enough allowance!');
        }

        // Step-2: Sending
        let txIndex = 0;
        let txHashArr: string[] = [];

        for (let index = 0; index < _addressArray.length; index += pageSize) {
            txIndex++;
            let addressArr = _addressArray.slice(index, index + pageSize);
            let amountArr = _amountWeiArray.slice(index, index + pageSize);

            settips(`Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            await multiSender.connect(signer).batchSendERC20(tokenAddress, addressArr, amountArr).then((data: { hash: string; }) => {
                console.log('batchSendERC20', data);
                txHashArr.push(data.hash);
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    setshowLoading(false);
                }
            }).catch((err: any) => {
                setshowLoading(false);
            });

        }
        setTxHashList(txHashArr);
    }


    return <Box>
        <div className="mb-3">
            <h5>List of recipients</h5>
            <TableBox>
                <Table striped borderless hover className="tableStyle">
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
            </TableBox>
        </div>
        <div className="mb-3">
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
                            <div className='numbers' >&nbsp; </div>
                            <div className="tips">Approximate cost of operation</div>
                        </td>
                        <td>
                            <div className='numbers'>{ethBalance} ETH</div>
                            <div className="tips">Your ETH balance</div>
                        </td>
                    </tr>

                </tbody>
            </Table>
        </div>

        <div className="mb-4">
            <H5Box>Amount to Approve</H5Box>
            <Form.Group className="ml2">
                <div className="mb-2">
                    <Form.Check
                        type="radio"
                        inline
                        label="Extra amount to sent"
                        name='approveAmount'
                        onChange={handleRadio}
                        value='extra'
                    />
                </div>
                <div>
                    <Form.Check
                        inline
                        type="radio"
                        label="Unlimited amount"
                        name='approveAmount'
                        value='unlimited'
                        onChange={handleRadio}
                    />
                </div>
            </Form.Group>
        </div>

        <div className="ml2">
            <Button
                variant="flat"
                onClick={doBatchSend}
            >Submit</Button>
        </div>




    </Box>
}