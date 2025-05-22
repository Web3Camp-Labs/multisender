import { Form, Table, Button, Alert } from 'react-bootstrap';
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { useWeb3 } from "../api/connect";
import { ethers, BigNumber } from 'ethers';
import TokenAbi from '../abi/ERC20.json';

import senderAbi from '../abi/MultiSender.json';

import mainnetConfig from '../config/mainnet.json';
import polygonConfig from '../config/polygon.json';
import bscConfig from '../config/bsc.json';
import bsctestConfig from '../config/bsctest.json';
import { ActionType } from "../api/types";
import UrlJson from "../config/url.json";
import ConfigJson from "../config/config.json";

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
  .flexNumber{
    word-break: break-all;
  }
`
const TableBox = styled.div`
    margin-top: 10px;
  height: 470px;
  padding-bottom: 20px;
  overflow-y: auto;
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

const TipsBox = styled.div`
  margin-bottom: 20px;
`

interface accountObj {
    address: string
    amount: number
}

interface contractAddressObj {
    mainnet: string
    bsc: string
    polygon: string

    bsctest: string
}

const contracts: contractAddressObj = {
    // Mainnet Configs
    mainnet: mainnetConfig.sender,
    bsc: bscConfig.sender,
    polygon: polygonConfig.sender,

    // Testnet Configs
    bsctest: bsctestConfig.sender
}
interface Iprops{
    handleNext:Function;
}


export default function Step2(props:Iprops) {
    const { state, dispatch } = useWeb3();
    const { account, first, web3Provider,importRecord } = state;
    const { handleNext } = props;

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
    const [selected, setselected] = useState<string>('unlimited');
    const [showLoading, setshowLoading] = useState<boolean>(false);
    const [tips, settips] = useState<string>('');
    const [txHashList, setTxHashList] = useState<string[]>([]);
    const [txHash, setTxHash] = useState<string>('');
    const [showApprove, setShowApprove] = useState<boolean>(false);
    const [totalTokenAmount, setTotalTokenAmount] = useState<any>();
    const [tokenAddr, setTokenAddr] = useState<any[]>([]);
    const [amountAddr, setAmountAddr] = useState<any[]>([]);
    const [errorTips, setErrorTips] = useState<string>('');
    const [successArr, setSuccessArr] = useState<string[]>([]);

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

        setTablelist(arr);
        setTotal();


        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            handleETH();
        } else { // ERC20
            handleERC20();
        }

    }, [first])
    const setTotal = async () => {
        if (first == null) return;
        const { amounts } = first;

        let lines = amounts.split('\n');
        let addressArray = [];
        let _amountWeiArray = [];
        let totalAmountInner = BigNumber.from('0');
        let totalAmountAft: string = '';

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index]?.trim();
            if (line.length === 0) {
                console.log('skip empty line');
                continue;
            }
            let values = line.split(',');


            let address = values[0].trim();
            const { decimals } = first;
            let amountWei = ethers.utils.parseUnits(values[1].trim(), decimals);

            let amount = parseFloat(values[1].trim());

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            addressArray.push(address);
            _amountWeiArray.push(amountWei);

            // totalAmount += amountWei;
            totalAmountInner = totalAmountInner.add(BigNumber.from(amountWei));

            totalAmountAft = ethers.utils.formatUnits(totalAmountInner, decimals);
        }

        setTotalAmount(totalAmountAft);
        setAddressArray(addressArray);
        // setAmountWeiArray(_amountWeiArray);
        console.log(`Total address : ${addressArray.length}, Total amount : ${totalAmount}`);
    }

    const initMultiSenderAddress = async () => {

        let url = null;

        // const chainId = await ethers.getChainId();

        const { chainId } = await web3Provider.getNetwork();
        console.log('chainId', chainId);

        let sender;
        const urlArr = UrlJson.filter(item => item.id === chainId);
        url = urlArr[0]?.url;

        const chainArr = ConfigJson.filter(item=>item.chainId === chainId);
        if(chainArr.length){
            sender = chainArr[0].sender;
        }else{
            console.error('Unsupported network!!!!');
            return;
        }
        //
        // if (chainId === 1) {
        //     sender = contracts.mainnet;
        //     // url = 'https://etherscan.io/tx';
        //     // } else if (chainId === 42) {
        //     //     sender = contracts.kovan;
        //     //     url = 'https://kovan.etherscan.io/tx';
        //     // } else if (chainId === 128) {
        //     //     sender = contracts.heco;
        //     //     url = 'https://hecoinfo.com/tx';
        //     // } else if (chainId === 256) {
        //     //     sender = contracts.hecotest;
        //     //     url = 'https://testnet.hecoinfo.com/tx';
        // } else if (chainId === 137) {
        //     sender = contracts.polygon;
        //     // url = 'https://polygonscan.com/tx';
        // } else if (chainId === 56) {
        //     sender = contracts.bsc;
        //     // url = 'https://bscscan.com/tx';
        // } else if (chainId === 97) {
        //     sender = contracts.bsctest;
        //     //     url = 'https://testnet.bscscan.com/tx';
        // } else {
        //     console.error('Unsupported network!!!!');
        //     return;
        // }
        setMultiSenderAddress(sender);
        setTxURL(url);
        console.log("sender address: ", sender);
    };
    useEffect(() => {
        if (!tokenContract || !multiSenderAddress) return;
        getAllowance()

    }, [tokenContract, multiSenderAddress])

    useEffect(() => {
        initMultiSenderAddress()
    }, [])
    useEffect(()=>{
        if (first == null || (!tokenContract && first.tokenAddress !== '0x000000000000000000000000000000000000bEEF')|| !multiSenderAddress) return;
        doBatchSend();
    },[first,tokenContract,multiSenderAddress])

    const getAllowance = async () => {
        if (first == null) return;

        if (!tokenContract || account == null) return;
        const allowance = await tokenContract.allowance(account, multiSenderAddress);
        console.log("My allowance: ", allowance.toString());
        const { decimals } = first;
        setAllowance(ethers.utils.formatUnits(allowance, decimals));

        const symbol = await tokenContract.symbol();
        console.log('Token symbol: ', symbol);
        setSymbol(symbol);

        const mybalance = await tokenContract.balanceOf(account);
        const balanceAfter = ethers.utils.formatUnits(mybalance, decimals);
        console.log("My balance: ", balanceAfter);
        setmybalance(balanceAfter);

        const signer = web3Provider.getSigner(account);
        const ethBalance = await signer.getBalance();

        setethBalance(ethers.utils.formatEther(ethBalance));
    }

    const handleETH = async () => {
        if (first == null) return;
        dispatch({ type: ActionType.TIPS, payload: `Query balance in progress... ` })
        setTokenContract(null);
        setAllowance('0');
        setSymbol("ETH");
        const { decimals } = first;
        const signer = web3Provider.getSigner(account);
        const ethBalance = await signer.getBalance();
        let ethBalanceAfter = ethers.utils.formatUnits(ethBalance, decimals);
        setmybalance(ethBalanceAfter);
        setethBalance(ethBalanceAfter);
    }

    const handleERC20 = async () => {
        if (first == null) return;
        const { tokenAddress } = first;
        const token = new ethers.Contract(tokenAddress, TokenAbi, web3Provider);
        dispatch({ type: ActionType.TIPS, payload: `Query token contract... ` })
        // await token.deployed();
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
            QueryEther();
        } else {
            // Send ERC20 Token
             await QueryToken();
        }
    }


    const sendEther = async () => {

        if (first == null) return;


        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        // await multiSender.deployed();

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
            let addressArr = tokenAddr.slice(index, index + pageSize);
            let amountWeiArr = amountAddr.slice(index, index + pageSize);

            let sendValue = amountWeiArr.reduce((a, b) => a.add(b));

            settips(`Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);
            dispatch({ type: ActionType.TIPS, payload: `Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})` })
            try{
                let res = await multiSender.connect(signer).batchSendEther(addressArr, amountWeiArr, { from: account, value: ethers.utils.hexValue(sendValue) })
                let data = await res.wait();
                console.log('batchSendEther', res);
                txHashArr.push(data.hash || data?.transactionHash);
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    setshowLoading(false);
                    dispatch({ type: ActionType.TIPS, payload: null })
                    dispatch({ type: ActionType.STORE_TXHASHLIST, payload: txHashArr });
                    handleNext(3);

                }
            }catch (err: any){
                console.error('batchSendEther error: ', err);
                setErrorTips(err.data?.message || err.message)
                setshowLoading(false);
                dispatch({ type: ActionType.TIPS, payload: null })
            }


        }
        // setTxHashList(txHashArr);
        // console.log(txHashArr)

    }

    const sendERC20Token = async () => {
        if (first == null || tokenContract == null) return;


        const signer = web3Provider.getSigner(account);
        const { amounts, tokenAddress } = first;
        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        // Step-2: Sending
        let txIndex = 0;
        let txHashArr: string[] = [];

        let mySuccessArr = [...successArr];
        for (let index = 0; index < tokenAddr.length; index += pageSize) {
            txIndex++;
            let addressArr = tokenAddr.slice(index, index + pageSize);
            let amountArr = amountAddr.slice(index, index + pageSize);

            settips(`Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            dispatch({ type: ActionType.TIPS, payload: `Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})` });
            try {
                let rec = await multiSender.connect(signer).batchSendERC20(tokenAddress, addressArr, amountArr)
                let data = await rec.wait();
                console.log('batchSendERC20', data);
                txHashArr.push(data.hash || data.transactionHash);

                mySuccessArr = mySuccessArr.concat(addressArr);
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    setshowLoading(false);
                    dispatch({ type: ActionType.TIPS, payload: null })
                    dispatch({ type: ActionType.STORE_TXHASHLIST, payload: txHashArr });
                    handleNext(3);

                }
            } catch (e:any) {
                setshowLoading(false);
                dispatch({ type: ActionType.TIPS, payload: null })
                setErrorTips(e.data?.message || e.message)
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    console.error(successArr);
                }
            }
        }
        setSuccessArr(mySuccessArr);
        downLoadExcel(mySuccessArr)

    }

    const downLoadExcel =  (data:string[]) => {
        if (importRecord == null  || !data.length) return;
        let amountStr = `Address,Amount\n`;
        let addressStr = "";
        importRecord.map((item)=>{
            const { address, amount} = item;
            let isSuccess = false;
            for(let i = 0 ; i < data.length ; i++ ){
                if(address.toLowerCase() === data[i].toLowerCase()){
                    isSuccess = true;
                }
            }
            if(!isSuccess){
                addressStr += `${address},${amount} \n`;
            }
        });
        amountStr += addressStr;
        console.log(addressStr.split("\n"))
        if(addressStr.split("\n").length === 1) return;


        let uri = `data:text/csv;charset=utf-8,\ufeff ${amountStr}`;

        let link = document.createElement("a");
        link.href = uri;

        link.download = `Failed_address_${new Date().valueOf()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const doApprove = async () =>{
        if (first == null || tokenContract == null) return;
        const signer = web3Provider.getSigner(account);

        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        // await multiSender.deployed();
        const { amounts, tokenAddress ,decimals} = first;

        let _allowance = await tokenContract.allowance(account, multiSenderAddress);
        console.log("My allowance: ", _allowance.toString());

        // Step-2: Approve
        if (_allowance.lt(totalTokenAmount)) {
            if (selected === 'unlimited') {
                // const totalSupply = await tokenContract.totalSupply();
                dispatch({ type: ActionType.TIPS, payload: `Unlimited Approve in progress...` })
                try {
                    let receipt = await tokenContract.connect(signer).approve(multiSenderAddress, ethers.constants.MaxUint256);
                    settips('Unlimited Approve in progress...');

                    let data = await receipt.wait();
                    console.log('txHash', data);
                    setTxHash(data.hash || data.transactionHash);
                    dispatch({ type: ActionType.STORE_TXHASH, payload: data.hash || data.transactionHash });
                    dispatch({ type: ActionType.TIPS, payload: null });
                    setShowApprove(false);
                    let after = await tokenContract.allowance(account, multiSenderAddress);
                    setAllowance(ethers.utils.formatUnits(after, decimals));
                } catch (err:any) {
                    console.error('approve error: ', err);
                    setshowLoading(false);
                    dispatch({ type: ActionType.TIPS, payload: null })
                    setErrorTips(err.data?.message || err.message)
                }

            } else {
                dispatch({ type: ActionType.TIPS, payload: `Approve in progress...` });
                try {
                    let receipt = await tokenContract.connect(signer).approve(multiSenderAddress, totalTokenAmount);
                    settips('Approve in progress...');
                    let data = await receipt.wait();
                    console.log('txHash', data);
                    setTxHash(data.hash || data.transactionHash);
                    dispatch({ type: ActionType.STORE_TXHASH, payload: data.hash || data.transactionHash });
                    dispatch({ type: ActionType.TIPS, payload: null })
                    setShowApprove(false);
                    let after = await tokenContract.allowance(account, multiSenderAddress);
                    setAllowance(ethers.utils.formatUnits(after, decimals));
                } catch (err:any) {
                    console.error('approve error: ', err);
                    setErrorTips(err.data?.message || err.message)
                    setshowLoading(false);
                    dispatch({ type: ActionType.TIPS, payload: null })
                }
            }
        } else {
            console.log('Already have enough allowance!');
        }

    }
    const doSend = () =>{
        if (first == null) return;
        const { tokenAddress } = first;
        if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
            // Send Ether
                sendEther()
        } else {
            // Send ERC20 Token
            sendERC20Token();
        }
    }

    const QueryEther = () =>{
        if (first == null) return;

        const { amounts, decimals } = first;
        setshowLoading(true);
        settips('Waiting...');
        dispatch({ type: ActionType.TIPS, payload: "Waiting..." })


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
            setTotalTokenAmount(_totalAmount)
            setTokenAddr(_addressArray)
            setAmountAddr(_amountWeiArray)
        }
        dispatch({ type: ActionType.TIPS, payload: null })
        console.log("total amount: ", _totalAmount);
        console.log("total amount string: ", ethers.utils.formatUnits(_totalAmount, decimals));
    }

    const QueryToken = async () =>{

        if (first == null || !tokenContract ) return;

        setshowLoading(true);
        settips('Waiting...');
        dispatch({ type: ActionType.TIPS, payload: `Waiting...` })
        const { amounts, tokenAddress } = first;

        const multiSender = new ethers.Contract(multiSenderAddress, senderAbi, web3Provider);
        // await multiSender.deployed();

        const signer = web3Provider.getSigner(account);
        console.log('signer: ', signer);
        console.log('multiSender: ', multiSender);

        console.log(selected);
        const decimals = await tokenContract.decimals();

        console.log('Decimals: ', decimals,amounts);

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
            let amountWei = ethers.utils.parseUnits(values[1].trim(), decimals);

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            _addressArray.push(address);
            _amountWeiArray.push(amountWei);

            _totalAmount = _totalAmount.add(BigNumber.from(amountWei));
            setTotalTokenAmount(_totalAmount)
            setTokenAddr(_addressArray)
            setAmountAddr(_amountWeiArray)
        }
        dispatch({ type: ActionType.TIPS, payload: null })
        let _allowance = await tokenContract.allowance(account, multiSenderAddress);
        console.log("My allowance: ", _allowance.toString());
        if(_allowance.lt(_totalAmount)){
            setShowApprove(true)
        }else{
            setShowApprove(false)
        }
    }


    return <Box>
        <div className="mb-3">
            <h5>List of recipients</h5>
            <TableBox>
                <Table striped borderless hover className="tableStyle">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tablelist.map((i, index) => (<tr key={`${i.address}_${index}`}>
                                <td>{index}</td>
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
                            <div className='numbers flexNumber'>{allowance} {symbol}</div>
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
        {
            showApprove &&<div className="mb-4">
                <H5Box>Amount to Approve</H5Box>
                <Form.Group className="ml2">
                    <div className="mb-2">
                        <Form.Check
                            type="radio"
                            inline
                            label="Extra amount to sent"
                            name='approveAmount'
                            onChange={handleRadio}
                            checked={selected === "extra"}
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
                            checked={selected === "unlimited"}
                            onChange={handleRadio}
                        />
                    </div>
                </Form.Group>
            </div>
        }
        <TipsBox>
            {
                !!errorTips.length &&<Alert  variant='danger'>{errorTips}</Alert>
            }

        </TipsBox>

        {
            showApprove &&<div className="ml2">
                <Button
                    variant="flat"
                    onClick={doApprove}
                >Approve</Button>
            </div>
        }
        {
            !showApprove &&<div className="ml2">
                <Button
                    variant="flat"
                    onClick={doSend}
                >Send</Button>
            </div>
        }





    </Box>
}