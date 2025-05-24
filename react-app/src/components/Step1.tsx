import React, { ChangeEvent, useState, useEffect } from 'react';
import { Row, Col, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import { ActionType } from '../context/types';
import { ethers } from 'ethers';
import TokenAbi from '../abi/ERC20.json';
import ConfigJson from '../config/config.json';
import ExcelImport from './ExcelImport';

declare global {
  interface Window {
    __lastFirstObj?: any;
  }
}

const Box = styled.div`
  .height50 {
    height: 200px;
  }
  
  .upload {
    svg {
      margin-right: 10px;
    }
  }
  
  label[for="Addresses"] {
    background: #fff;
    height: 33px;
    width: 99%;
    line-height: 4px;
    margin: 7.5px 0 0 1px;
    opacity: 1 !important;
    color: #aaa;
  }
`;

const TipsBox = styled.div`
  margin-bottom: 20px;
`;

interface Props {
  handleNext: (step: number) => void;
}

console.log('Step1 rendered');
const Step1: React.FC<Props> = ({ handleNext }) => {
  const { dispatch, state } = useWeb3();
  const { account, web3Provider, first } = state;
  console.log('[Step1] state.first:', first);

  const [tokenAddress, setTokenAddress] = useState<string>('0x000000000000000000000000000000000000bEEF'); // 0xbEEF as Ether
  const [decimals, setDecimals] = useState<number>(18);
  const [amounts, setAmounts] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [errorTips, setErrorTips] = useState<string>('');
  const [support, setSupport] = useState<boolean | null>(null);

  console.log('Step1 rendered');

  // Effect: navigate to Step2 when state.first matches the just-dispatched obj
  React.useEffect(() => {
    console.log('[Step1 useEffect] fired. first:', first, 'window.__lastFirstObj:', window.__lastFirstObj, 'dependencies:', [first, handleNext]);
    if (!window.__lastFirstObj) return;
    if (!first) return;
    // Compare all fields
    if (
      first.amounts === window.__lastFirstObj.amounts &&
      first.tokenAddress === window.__lastFirstObj.tokenAddress &&
      first.decimals === window.__lastFirstObj.decimals
    ) {
      console.log('Step1 useEffect: Navigating to Step2, state.first:', first);
      handleNext(2);
      window.__lastFirstObj = undefined;
    }
  }, [first, handleNext]);

  useEffect(() => {
    if (!account || account === "" || !amounts || !tokenAddress) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [account, amounts, tokenAddress, decimals]);

  useEffect(() => {
    if (web3Provider == null) return;

    const getDecimals = async () => {
      if (tokenAddress === "0x000000000000000000000000000000000000bEEF") return;
      
      try {
        const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, web3Provider);
        const decimals = await tokenContract.decimals();
        setDecimals(decimals);
        setErrorTips('');
      } catch (err: any) {
        setErrorTips(err.data?.message || err.message);
      }
    };
    
    getDecimals();
  }, [tokenAddress, web3Provider]);

  useEffect(() => {
    initMultiSenderAddress();
  }, [web3Provider]);

  const initMultiSenderAddress = async () => {
    if (!web3Provider) return;
    
    try {
      const { chainId } = await web3Provider.getNetwork();
      const chainArr = ConfigJson.networks.filter(item => item.chainId === chainId);
      
      if (chainArr.length) {
        setSupport(true);
      } else {
        setErrorTips('Unsupported network!');
        setSupport(false);
      }
    } catch (error) {
      console.error("Error initializing multisender address:", error);
      setErrorTips('Error connecting to network');
      setSupport(false);
    }
  };

  const handleInput = (e: ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    switch (name) {
      case 'token':
        setTokenAddress(value);
        break;
      case 'amounts':
        setAmounts(value);
        break;
      default:
        break;
    }
  };

  const nextPage = async () => {
    let arr = amounts.split('\n');
    let data: any[] = [];
    let amountStr = '';
    
    arr.forEach((item) => {
      if (!item.trim()) return;
      
      let address = item.split(",")[0].trim();
      let amount = item.split(",")[1]?.trim();
      
      if (!address || !amount) return;
      
      data.push({
        address,
        amount
      });
      
      let isAddress = ethers.utils.isAddress(address);
      if (isAddress && !isNaN(parseFloat(amount))) {
        amountStr += `${address},${parseFloat(amount)}\n`; // No trailing space before \n
      }
    });
    
    if (data.length === 0) {
  setErrorTips('Please enter at least one valid address and amount.');
  return;
}

console.log('Dispatching to context:', data, amountStr, tokenAddress, decimals);
dispatch({ type: ActionType.STORE_IMPORT, payload: data });

const obj = {
  amounts: amountStr,
  tokenAddress,
  decimals: decimals.toString()
};

console.log('Dispatching STORE_FIRST:', obj, 'typeof obj:', typeof obj);
dispatch({ type: ActionType.STORE_FIRST, payload: obj });
// Navigation will happen in a useEffect below when state.first matches obj.
// Store the latest obj in a ref for comparison.
window.__lastFirstObj = obj;


  };

  const getChildrenMsg = (data: any[]) => {
    let str = '';
    
    for (let ele of data) {
      let eleStr = [];
      for (let key in ele) {
        eleStr.push(ele[key]);
      }
      str += eleStr.join(",");
      str += "\n";
    }

    setAmounts(str);
  };

  return (
    <Box>
      <Row>
        <Col md={9}>
          <FloatingLabel
            controlId="Token"
            label="Token"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="token"
              placeholder="Token"
              value={tokenAddress}
              onChange={(e) => handleInput(e)}
            />
          </FloatingLabel>
        </Col>
        <Col md={3}>
          <FloatingLabel
            controlId="Decimals"
            label="Decimals"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="decimals"
              placeholder="Decimals"
              value={decimals}
              readOnly={true}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <div className="mb-3">
        <ExcelImport getChildrenMsg={getChildrenMsg} />
      </div>
      <Row>
        <Col md={12}>
          <FloatingLabel
            controlId="Addresses"
            label="Addresses with Amounts"
            className="mb-3 addressLabel"
          >
            <Form.Control
              placeholder="Addresses with Amounts"
              as="textarea"
              name="amounts"
              className="height50"
              value={amounts}
              onChange={(e) => handleInput(e)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <TipsBox>
        {!!errorTips.length && <Alert variant="danger">{errorTips}</Alert>}
      </TipsBox>
      <div>
        <Button
          variant="flat"
          onClick={() => nextPage()}
          disabled={!support || btnDisabled}
        >
          Next
        </Button>
      </div>
    </Box>
  );
};

export default Step1;
