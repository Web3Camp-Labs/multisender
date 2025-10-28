import React, { useEffect, useState } from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import { ActionType } from '../context/types';

const HeaderBox = styled(Navbar)`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .navbar-brand {
    font-weight: bold;
    color: purple;
  }
  
  .connect-btn {
    background-color: purple;
    border-color: purple;
    
    &:hover {
      background-color: #8a2be2;
      border-color: #8a2be2;
    }
  }
  
  .account-display {
    font-size: 14px;
    color: #666;
    margin-right: 10px;
  }
`;

const Header: React.FC = () => {
  const { state, dispatch } = useWeb3();
  const { account, web3Provider } = state;
  const [networkName, setNetworkName] = useState<string>('');

  useEffect(() => {
    const getNetwork = async () => {
      if (!web3Provider) return;
      
      try {
        const network = await web3Provider.getNetwork();
        let name = '';
        
        switch (network.chainId) {
          case 1:
            name = 'Ethereum Mainnet';
            break;
          case 56:
            name = 'Binance Smart Chain';
            break;
          case 97:
            name = 'BSC Testnet';
            break;
          case 137:
            name = 'Polygon';
            break;
          default:
            name = network.name;
        }
        
        setNetworkName(name);
      } catch (error) {
        console.error('Error getting network:', error);
      }
    };
    
    getNetwork();
  }, [web3Provider]);

  const connectWallet = async () => {
    if (!web3Provider) return;
    
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        dispatch({ type: ActionType.SET_ACCOUNT, payload: accounts[0] });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <HeaderBox expand="lg">
      <Container>
        <Navbar.Brand href="#">MultiSender</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {networkName && (
            <span className="account-display me-3">Network: {networkName}</span>
          )}
          {account ? (
            <span className="account-display">{formatAddress(account)}</span>
          ) : (
            <Button 
              variant="primary" 
              className="connect-btn" 
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </HeaderBox>
  );
};

export default Header;
