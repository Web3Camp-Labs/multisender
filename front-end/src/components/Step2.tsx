import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { Form, Table, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import { ethers, BigNumber } from 'ethers';
import TokenAbi from '../abi/ERC20.json';
import SenderAbi from '../abi/MultiSender.json';
import { ActionType } from '../context/types';
import UrlJson from '../config/url.json';
import ConfigJson from '../config/config.json';

const Box = styled.div`
  padding: 40px 0;
  
  .numbers {
    font-size: 20px;
  }
  
  .tips {
    font-size: 12px;
    color: #999;
  }
  
  h5 {
    padding: 10px 0 5px 10px;
    color: #000000;
  }
  
  .ml2 {
    margin-left: 10px;
  }
  
  .flexNumber {
    word-break: break-all;
  }
`;

const TableBox = styled.div`
  margin-top: 10px;
  height: 470px;
  padding-bottom: 20px;
  overflow-y: auto;
  
  .tableStyle {
    border-top: 1px solid #eee;
    color: #666666;
    
    th {
      height: 60px;
      line-height: 60px;
    }
    
    .first {
      display: flex;
      justify-content: center;
      align-items: stretch;
      
      .form-check-inline {
        margin-right: 0;
        display: flex;
        margin-top: 13px;
      }
    }
    
    td {
      line-height: 50px;
      word-break: break-all;
      
      &:nth-child(4) {
        width: 30%;
      }
    }
    
    tr:nth-child(2n+1) td {
      background: rgba(255, 255, 255, 0.3) !important;
      color: #666666 !important;
    }
    
    tr:hover td {
      background: rgba(0, 0, 0, 0.01) !important;
    }
  }
`;

const H5Box = styled.h5`
  display: inline-block;
  margin-bottom: 20px;
`;

const TipsBox = styled.div`
  margin-bottom: 20px;
`;

interface AccountObj {
  address: string;
  amount: number;
}

interface Props {
  handleNext: () => void;
  handlePrev: () => void;
}

const Step2: React.FC<Props> = ({ handleNext, handlePrev }) => {
  const { state, dispatch } = useWeb3();
  const { account, first, web3Provider, importRecord } = state;

  // UI and transaction state
  const [totalAmount, setTotalAmount] = useState<string>('0');
  const [allowance, setAllowance] = useState<string>('0');
  const [amountWeiArray, setAmountWeiArray] = useState<BigNumber[]>([]);
  const [mybalance, setMyBalance] = useState<string>('0');
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [tableList, setTableList] = useState<AccountObj[]>([]);
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [pageSize] = useState<number>(200); // Default 200 transfer per tx
  const [symbol, setSymbol] = useState<string>('');
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [multiSenderAddress, setMultiSenderAddress] = useState<string>('');
  const [txURL, setTxURL] = useState<string>('');
  const [selected, setSelected] = useState<string>('unlimited');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [tips, setTips] = useState<string>('');
  const [txHashList, setTxHashList] = useState<string[]>([]);
  const [txHash, setTxHash] = useState<string>('');
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [totalTokenAmount, setTotalTokenAmount] = useState<BigNumber>(BigNumber.from(0));
  const [tokenAddr, setTokenAddr] = useState<string[]>([]);
  const [amountAddr, setAmountAddr] = useState<BigNumber[]>([]);
  const [errorTips, setErrorTips] = useState<string>('');
  const [successArr, setSuccessArr] = useState<string[]>([]);
  // Gas estimation state
  const [estimatedGas, setEstimatedGas] = useState<string>('');
  const [estimatedFee, setEstimatedFee] = useState<string>('');

  // Validate received data from Step1
  useEffect(() => {
    if (!first || !first.amounts) {
      setErrorTips('No valid data received from Step1. Please check your input.');
      return;
    }
    const lines = first.amounts.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    if (lines.length === 0) {
      setErrorTips('No valid address/amount lines found. Please check your input in Step1.');
    }
  }, [first]);

  // Utility: Estimate gas and fee for the next transaction
  const estimateGasAndFee = useCallback(async () => {
    if (!web3Provider || !account || !multiSenderAddress || !first) return;
    try {
      setEstimatedGas('');
      setEstimatedFee('');
      let gas = null;
      let fee = null;
      const signer = web3Provider.getSigner(account);
      const { tokenAddress } = first;
      if (tokenAddress === '0x000000000000000000000000000000000000bEEF') {
        // Estimate gas for ETH multisend
        const multiSender = new ethers.Contract(multiSenderAddress, SenderAbi, signer);
        if (tokenAddr.length && amountAddr.length) {
          gas = await multiSender.estimateGas.batchSendEther(tokenAddr, amountAddr, {
            value: totalTokenAmount,
          });
        }
      } else if (tokenContract) {
        // Estimate gas for ERC20 multisend
        const multiSender = new ethers.Contract(multiSenderAddress, SenderAbi, signer);
        if (tokenAddr.length && amountAddr.length) {
          gas = await multiSender.estimateGas.batchSendERC20(tokenContract.address, tokenAddr, amountAddr);
        }
      }
      if (gas) {
        setEstimatedGas(gas.toString());
        // Get current gas price
        const gasPrice = await web3Provider.getGasPrice();
        fee = gas.mul(gasPrice);
        setEstimatedFee(ethers.utils.formatEther(fee));
      }
    } catch (error) {
      setEstimatedGas('');
      setEstimatedFee('');
      // Don't block UI on estimation error, but log it
      console.error('Error estimating gas:', error);
    }
  }, [web3Provider, account, multiSenderAddress, first, tokenAddr, amountAddr, totalTokenAmount, tokenContract]);

  // Run estimation when relevant data changes
  useEffect(() => {
    estimateGasAndFee();
  }, [estimateGasAndFee]);

  useEffect(() => {
    if (first == null) return;
    const { amounts, tokenAddress, decimals } = first;
    // Split addresses
    let amountlist = amounts.split('\n');
    let arr: AccountObj[] = [];
    amountlist.forEach(item => {
      if (!item.trim()) return;
      
      const parts = item.split(',');
      if (parts.length < 2) return;
      
      arr.push({
        address: parts[0].trim(),
        amount: parseFloat(parts[1].trim()),
      });
    });

    setTableList(arr);
    setTotal();

    if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
      handleETH();
    } else { // ERC20
      handleERC20();
    }
  }, [first, web3Provider]);

  // (rest of the code continues)

  const setTotal = async () => {
    if (first == null) return;
    let { amounts, decimals } = first;

    if (isNaN(decimals) || decimals < 0) {
      setErrorTips('Invalid decimals value received from Step1.');
      return;
    }

    let lines = amounts.split('\n');
    let addressArray = [];
    let _amountWeiArray = [];
    let totalAmountInner = BigNumber.from('0');
    let totalAmountAft: string = '';

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]?.trim();
      if (!line) {
        continue;
      }
      let values = line.split(',');
      if (values.length < 2) continue;
      let address = values[0].trim();
      let amountStr = values[1].trim();
      let amountWei;
      if (isNaN(Number(amountStr))) {
        setErrorTips(`Invalid amount: '${amountStr}' on line ${index+1}`);
        continue;
      }
      try {
        amountWei = ethers.utils.parseUnits(amountStr, decimals);
      } catch (error) {
        console.error('Error parsing amount:', error, 'amount:', amountStr, 'decimals:', decimals);
        setErrorTips(`Error parsing amount '${amountStr}' with decimals ${decimals} on line ${index+1}`);
        continue;
      }
      if (!ethers.utils.isAddress(address)) {
        setErrorTips(`Invalid address: '${address}' on line ${index+1}`);
        continue;
      }
      addressArray.push(address);
      _amountWeiArray.push(amountWei);
      totalAmountInner = totalAmountInner.add(BigNumber.from(amountWei));
      totalAmountAft = ethers.utils.formatUnits(totalAmountInner, decimals);
    }
    setTotalAmount(totalAmountAft);
    setAddressArray(addressArray);
    setAmountWeiArray(_amountWeiArray);
  };

  const initMultiSenderAddress = async () => {
    if (!web3Provider) return;
    
    try {
      let url = null;
      const { chainId } = await web3Provider.getNetwork();
      
      let sender;
      const urlArr = UrlJson.filter(item => item.id === chainId);
      url = urlArr[0]?.url;

      const chainArr = ConfigJson.networks.filter(item => item.chainId === chainId);
      if (chainArr.length) {
        sender = chainArr[0].multiSenderAddress;
      } else {
        console.error('Unsupported network!');
        setErrorTips('Unsupported network!');
        return;
      }
      
      setMultiSenderAddress(sender);
      setTxURL(url || '');
    } catch (error) {
      console.error('Error initializing multisender address:', error);
      setErrorTips('Error connecting to network');
    }
  };

  useEffect(() => {
    if (!tokenContract || !multiSenderAddress) return;
    getAllowance();
  }, [tokenContract, multiSenderAddress]);

  useEffect(() => {
    initMultiSenderAddress();
  }, [web3Provider]);

  useEffect(() => {
    if (first == null || (!tokenContract && first?.tokenAddress !== '0x000000000000000000000000000000000000bEEF') || !multiSenderAddress) return;
    doBatchSend();
  }, [first, tokenContract, multiSenderAddress]);

  const getAllowance = async () => {
    if (first == null || !tokenContract || account == null) return;
    
    try {
      const allowance = await tokenContract.allowance(account, multiSenderAddress);
      const { decimals } = first;
      setAllowance(ethers.utils.formatUnits(allowance, decimals));

      const symbol = await tokenContract.symbol();
      setSymbol(symbol);

      const mybalance = await tokenContract.balanceOf(account);
      const balanceAfter = ethers.utils.formatUnits(mybalance, decimals);
      setMyBalance(balanceAfter);

      const signer = web3Provider.getSigner(account);
      const ethBalance = await signer.getBalance();
      setEthBalance(ethers.utils.formatEther(ethBalance));
    } catch (error) {
      console.error('Error getting allowance:', error);
      setErrorTips('Error getting token information');
    }
  };

  const handleETH = async () => {
    if (first == null || !web3Provider || !account) return;
    
    dispatch({ type: ActionType.TIPS, payload: `Query balance in progress... ` });
    setTokenContract(null);
    setAllowance('0');
    setSymbol("ETH");
    
    try {
      const { decimals } = first;
      const signer = web3Provider.getSigner(account);
      const ethBalance = await signer.getBalance();
      let ethBalanceAfter = ethers.utils.formatUnits(ethBalance, decimals);
      setMyBalance(ethBalanceAfter);
      setEthBalance(ethBalanceAfter);
      dispatch({ type: ActionType.TIPS, payload: null });
    } catch (error) {
      console.error('Error handling ETH:', error);
      setErrorTips('Error getting ETH balance');
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const handleERC20 = async () => {
    if (first == null || !web3Provider) return;
    
    try {
      const { tokenAddress } = first;
      const token = new ethers.Contract(tokenAddress, TokenAbi, web3Provider);
      dispatch({ type: ActionType.TIPS, payload: `Query token contract... ` });
      setTokenContract(token);
    } catch (error) {
      console.error('Error handling ERC20:', error);
      setErrorTips('Error connecting to token contract');
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const handleRadio = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setSelected(value);
  };

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
  };

  const sendEther = async () => {
    if (first == null || !web3Provider || !account || !multiSenderAddress) return;

    try {
      // Validate balance before sending
      const totalEth = ethers.utils.formatEther(totalTokenAmount);
      if (parseFloat(ethBalance) < parseFloat(totalEth)) {
        setErrorTips(`Insufficient balance. You have ${ethBalance} ETH but need ${totalEth} ETH`);
        setShowLoading(false);
        return;
      }

      const multiSender = new ethers.Contract(multiSenderAddress, SenderAbi, web3Provider);
      const signer = web3Provider.getSigner(account);

      // Step-2: Sending Ether...
      let txIndex = 0;
      let txHashArr: string[] = [];
      
      for (let index = 0; index < addressArray.length; index += pageSize) {
        txIndex++;
        let addressArr = tokenAddr.slice(index, index + pageSize);
        let amountWeiArr = amountAddr.slice(index, index + pageSize);

        let sendValue = amountWeiArr.reduce((a, b) => a.add(b), BigNumber.from(0));

        setTips(`Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);
        dispatch({ type: ActionType.TIPS, payload: `Sending Ether in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})` });
        
        try {
          let res = await multiSender.connect(signer).batchSendEther(addressArr, amountWeiArr, { 
            from: account, 
            value: ethers.utils.hexValue(sendValue) 
          });
          
          let data = await res.wait();
          txHashArr.push(data.hash || data?.transactionHash);
          
          if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
            setShowLoading(false);
            dispatch({ type: ActionType.TIPS, payload: null });
            dispatch({ type: ActionType.STORE_TXHASHLIST, payload: txHashArr });
            handleNext();
          }
        } catch (err: any) {
          console.error('batchSendEther error: ', err);
          setErrorTips(err.data?.message || err.message);
          setShowLoading(false);
          dispatch({ type: ActionType.TIPS, payload: null });
        }
      }
    } catch (error) {
      console.error('Error in sendEther:', error);
      setErrorTips('Error sending ETH');
      setShowLoading(false);
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const sendERC20Token = async () => {
    if (first == null || tokenContract == null || !web3Provider || !account || !multiSenderAddress) return;

    try {
      // Validate token balance before sending
      if (parseFloat(mybalance) < parseFloat(totalAmount)) {
        setErrorTips(`Insufficient balance. You have ${mybalance} ${symbol} but need ${totalAmount} ${symbol}`);
        setShowLoading(false);
        return;
      }

      const signer = web3Provider.getSigner(account);
      const { tokenAddress } = first;
      const multiSender = new ethers.Contract(multiSenderAddress, SenderAbi, web3Provider);

      // Step-2: Sending
      let txIndex = 0;
      let txHashArr: string[] = [];
      let mySuccessArr = [...successArr];
      
      for (let index = 0; index < tokenAddr.length; index += pageSize) {
        txIndex++;
        let addressArr = tokenAddr.slice(index, index + pageSize);
        let amountArr = amountAddr.slice(index, index + pageSize);

        setTips(`Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);
        dispatch({ type: ActionType.TIPS, payload: `Sending ERC20 token in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})` });
        
        try {
          let rec = await multiSender.connect(signer).batchSendERC20(tokenAddress, addressArr, amountArr);
          let data = await rec.wait();
          txHashArr.push(data.hash || data.transactionHash);

          mySuccessArr = mySuccessArr.concat(addressArr);
          
          if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
            setShowLoading(false);
            dispatch({ type: ActionType.TIPS, payload: null });
            dispatch({ type: ActionType.STORE_TXHASHLIST, payload: txHashArr });
            handleNext();
          }
        } catch (e: any) {
          setShowLoading(false);
          dispatch({ type: ActionType.TIPS, payload: null });
          setErrorTips(e.data?.message || e.message);
        }
      }
      
      setSuccessArr(mySuccessArr);
      downloadExcel(mySuccessArr);
    } catch (error) {
      console.error('Error in sendERC20Token:', error);
      setErrorTips('Error sending tokens');
      setShowLoading(false);
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const downloadExcel = (data: string[]) => {
    if (importRecord == null || !data.length) return;
    
    let amountStr = `Address,Amount\n`;
    let addressStr = "";
    
    importRecord.forEach((item) => {
      const { address, amount } = item;
      let isSuccess = false;
      
      for (let i = 0; i < data.length; i++) {
        if (address.toLowerCase() === data[i].toLowerCase()) {
          isSuccess = true;
          break;
        }
      }
      
      if (!isSuccess) {
        addressStr += `${address},${amount} \n`;
      }
    });
    
    amountStr += addressStr;
    if (addressStr.split("\n").length === 1) return;

    let uri = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(amountStr)}`;
    let link = document.createElement("a");
    link.href = uri;
    link.download = `Failed_address_${new Date().valueOf()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const doApprove = async () => {
    if (first == null || tokenContract == null || !web3Provider || !account || !multiSenderAddress) return;
    
    try {
      const signer = web3Provider.getSigner(account);
      const { decimals } = first;

      let _allowance = await tokenContract.allowance(account, multiSenderAddress);

      // Step-2: Approve
      if (_allowance.lt(totalTokenAmount)) {
        if (selected === 'unlimited') {
          dispatch({ type: ActionType.TIPS, payload: `Unlimited Approve in progress...` });
          
          try {
            let receipt = await tokenContract.connect(signer).approve(multiSenderAddress, ethers.constants.MaxUint256);
            setTips('Unlimited Approve in progress...');

            let data = await receipt.wait();
            setTxHash(data.hash || data.transactionHash);
            dispatch({ type: ActionType.STORE_TXHASH, payload: data.hash || data.transactionHash });
            dispatch({ type: ActionType.TIPS, payload: null });
            setShowApprove(false);
            
            let after = await tokenContract.allowance(account, multiSenderAddress);
            setAllowance(ethers.utils.formatUnits(after, decimals));
          } catch (err: any) {
            console.error('approve error: ', err);
            setShowLoading(false);
            dispatch({ type: ActionType.TIPS, payload: null });
            setErrorTips(err.data?.message || err.message);
          }
        } else {
          dispatch({ type: ActionType.TIPS, payload: `Approve in progress...` });
          
          try {
            let receipt = await tokenContract.connect(signer).approve(multiSenderAddress, totalTokenAmount);
            setTips('Approve in progress...');
            
            let data = await receipt.wait();
            setTxHash(data.hash || data.transactionHash);
            dispatch({ type: ActionType.STORE_TXHASH, payload: data.hash || data.transactionHash });
            dispatch({ type: ActionType.TIPS, payload: null });
            setShowApprove(false);
            
            let after = await tokenContract.allowance(account, multiSenderAddress);
            setAllowance(ethers.utils.formatUnits(after, decimals));
          } catch (err: any) {
            console.error('approve error: ', err);
            setErrorTips(err.data?.message || err.message);
            setShowLoading(false);
            dispatch({ type: ActionType.TIPS, payload: null });
          }
        }
      }
    } catch (error) {
      console.error('Error in doApprove:', error);
      setErrorTips('Error approving tokens');
      setShowLoading(false);
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const doSend = async () => {
    if (first == null) {
      setErrorTips('No transaction data found. Please check your input.');
      return;
    }

    const { tokenAddress } = first;
    if (tokenAddress === '0x000000000000000000000000000000000000bEEF') { // Ether
      await sendEther();
    } else {
      await sendERC20Token();
    }
  };

  const QueryEther = () => {
    if (first == null || !web3Provider) return;
    
    try {
      const { amounts, decimals } = first;
      setShowLoading(true);
      setTips('Waiting...');
      dispatch({ type: ActionType.TIPS, payload: "Waiting..." });

      // Step-1: Check balance...
      let lines = amounts.split('\n');
      let _addressArray = [];
      let _amountWeiArray = [];
      let _totalAmount = BigNumber.from('0');

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index].trim();
        if (!line) {
          continue;
        }
        
        let values = line.split(',');
        if (values.length < 2) continue;

        let address = values[0].trim();
        let amountWei;
        
        try {
          amountWei = ethers.utils.parseEther(values[1].trim());
        } catch (error) {
          console.error('Error parsing amount:', error);
          continue;
        }

        if (!ethers.utils.isAddress(address)) {
          continue;
        }

        _addressArray.push(address);
        _amountWeiArray.push(amountWei);

        _totalAmount = _totalAmount.add(BigNumber.from(amountWei));
      }
      
      setTotalTokenAmount(_totalAmount);
      setTokenAddr(_addressArray);
      setAmountAddr(_amountWeiArray);
      dispatch({ type: ActionType.TIPS, payload: null });
      setShowLoading(false);
    } catch (error) {
      console.error('Error in QueryEther:', error);
      setErrorTips('Error processing ETH transactions');
      setShowLoading(false);
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  const QueryToken = async () => {
    if (first == null || !tokenContract || !web3Provider || !account || !multiSenderAddress) return;
    
    try {
      setShowLoading(true);
      setTips('Waiting...');
      dispatch({ type: ActionType.TIPS, payload: `Waiting...` });
      
      const { amounts, tokenAddress } = first;
      const multiSender = new ethers.Contract(multiSenderAddress, SenderAbi, web3Provider);
      const decimals = await tokenContract.decimals();

      // Step-1: Check balance...
      let lines = amounts.split('\n');
      let _addressArray = [];
      let _amountWeiArray = [];
      let _totalAmount = BigNumber.from('0');

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index].trim();
        if (!line) {
          continue;
        }
        
        let values = line.split(',');
        if (values.length < 2) continue;

        let address = values[0].trim();
        let amountWei;
        
        try {
          amountWei = ethers.utils.parseUnits(values[1].trim(), decimals);
        } catch (error) {
          console.error('Error parsing amount:', error);
          continue;
        }

        if (!ethers.utils.isAddress(address)) {
          continue;
        }

        _addressArray.push(address);
        _amountWeiArray.push(amountWei);

        _totalAmount = _totalAmount.add(BigNumber.from(amountWei));
      }
      
      setTotalTokenAmount(_totalAmount);
      setTokenAddr(_addressArray);
      setAmountAddr(_amountWeiArray);
      dispatch({ type: ActionType.TIPS, payload: null });
      setShowLoading(false);
      
      let _allowance = await tokenContract.allowance(account, multiSenderAddress);
      if (_allowance.lt(_totalAmount)) {
        setShowApprove(true);
      } else {
        setShowApprove(false);
      }
    } catch (error) {
      console.error('Error in QueryToken:', error);
      setErrorTips('Error processing token transactions');
      setShowLoading(false);
      dispatch({ type: ActionType.TIPS, payload: null });
    }
  };

  return (
    <Box>
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
              {tableList.map((i, index) => (
                <tr key={`${i.address}_${index}`}>
                  <td>{index}</td>
                  <td>{i.address}</td>
                  <td>{i.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableBox>
      </div>
      <div className="mb-3">
        <h5>Summary</h5>
        <Table bordered>
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
                <div className='numbers'>{estimatedGas ? estimatedGas : '--'}</div>
                <div className="tips">Estimated Gas</div>
              </td>
              <td>
                <div className='numbers'>{estimatedFee ? estimatedFee + ' ETH' : '--'}</div>
                <div className="tips">Estimated Gas Fee</div>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <div className='numbers'>&nbsp;</div>
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
      {showApprove && (
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
      )}
      <TipsBox>
        {!!errorTips.length && <Alert variant='danger'>{errorTips}</Alert>}
      </TipsBox>
      {showApprove ? (
        <div className="ml2">
          <Button
            variant="flat"
            onClick={doApprove}
            disabled={showLoading}
          >
            {showLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            Approve
          </Button>
        </div>
      ) : (
        <div className="ml2 d-flex gap-2">
          <Button
            variant="secondary"
            onClick={handlePrev}
          >
            Back
          </Button>
          <Button
            variant="flat"
            onClick={doSend}
            disabled={showLoading}
          >
            {showLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            Send
          </Button>
        </div>
      )}
    </Box>
  );
};

export default Step2;
