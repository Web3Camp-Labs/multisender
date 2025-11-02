import React, { useEffect, useState } from 'react';
import { Button, notification, Dropdown } from 'antd';
import { WalletOutlined, DisconnectOutlined, CopyOutlined, HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useWeb3, disconnectWallet as disconnectFromContext } from '../context/Web3Context';
import { ActionType } from '../context/types';
import WalletModal from './WalletModal';
import {
  connectWallet as connectToWallet,
  disconnectWallet as disconnectFromWallet,
  getSelectedWallet,
  isWalletAvailable,
  Wallet
} from '../utils/walletUtils';

const HeaderTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 64px;
    padding: 0 5%;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1000;

    @media (max-width: 768px) {
        min-height: 56px;
        padding: 0 3%;
    }
`;

const Logo = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 8px 0;

    .logo-text {
        font-size: 24px;
        font-weight: bold;
        color: #667eea;

        @media (max-width: 768px) {
            font-size: 20px;
        }
    }
`;

const AccountDisplay = styled.div`
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 20px;
    padding: 5px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 36px;

    &:hover {
        background-color: #e6f7ff;
    }

    .address {
        margin-left: 8px;
        font-size: 14px;
    }

    @media (max-width: 768px) {
        padding: 4px 10px;
        height: 32px;

        .address {
            font-size: 12px;
        }
    }
`;

const NetworkBadge = styled.div`
    background-color: ${props => props.color || '#52c41a'};
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    margin-right: 10px;
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    height: 100%;

    @media (max-width: 768px) {
        gap: 8px;
    }
`;

interface NetworkBadgeProps {
    color?: string;
}

const Header: React.FC = () => {
  const { state, dispatch } = useWeb3();
  const { account, web3Provider } = state;
  const [networkName, setNetworkName] = useState<string>('');
  const [networkColor, setNetworkColor] = useState<string>('#52c41a');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string>('');

  useEffect(() => {
    const getNetwork = async () => {
      if (!web3Provider) return;

      try {
        const network = await web3Provider.getNetwork();
        const chainIdNum = Number(network.chainId);

        let name = '';
        let color = '#f5a623';

        switch (chainIdNum) {
          case 1:
            name = 'Ethereum';
            color = '#627EEA';
            break;
          case 56:
            name = 'BSC';
            color = '#F0B90B';
            break;
          case 97:
            name = 'BSC Testnet';
            color = '#F0B90B';
            break;
          case 137:
            name = 'Polygon';
            color = '#8247E5';
            break;
          case 5:
            name = 'Goerli';
            color = '#3099f2';
            break;
          case 11155111:
            name = 'Sepolia';
            color = '#5f4bb6';
            break;
          case 80001:
            name = 'Mumbai';
            color = '#92b5d8';
            break;
          default:
            name = `Chain ${chainIdNum}`;
            color = '#f5a623';
        }

        setNetworkName(name);
        setNetworkColor(color);
      } catch (error) {
        console.error('Error getting network:', error);
      }
    };

    getNetwork();
  }, [web3Provider]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const selectedWallet = getSelectedWallet();
      if (selectedWallet && selectedWallet.provider) {
        setSelectedWalletName(selectedWallet.name);

        // Check if accounts are already connected
        try {
          const accounts = await selectedWallet.provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && !account) {
            dispatch({ type: ActionType.SET_ACCOUNT, payload: accounts[0] });
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const openWalletModal = () => {
    if (!isWalletAvailable()) {
      notification.warning({
        message: 'No Wallet Detected',
        description: 'Please install MetaMask, Coinbase Wallet, or another compatible wallet extension.',
        duration: 5,
      });
    }
    setShowWalletModal(true);
  };

  const handleWalletConnect = async (wallet: Wallet) => {
    setIsConnecting(true);

    try {
      const connectedAccount = await connectToWallet(wallet);
      setSelectedWalletName(wallet.name);

      // Update Web3Context with the connected account
      dispatch({ type: ActionType.SET_ACCOUNT, payload: connectedAccount });

      setShowWalletModal(false);

      notification.success({
        message: 'Wallet Connected',
        description: `Successfully connected to ${wallet.name}!`,
        duration: 3,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      notification.error({
        message: 'Connection Failed',
        description: error.message || 'Failed to connect wallet. Please try again.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromWallet();
    disconnectFromContext(dispatch);
    setSelectedWalletName('');
    notification.info({
      message: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected from this app.',
    });
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      notification.success({
        message: 'Address Copied',
        description: 'Address copied to clipboard!',
        duration: 2,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const backToHome = () => {
    window.location.href = '#';
  };

  const getMenuItems = () => {
    const items: any[] = [];

    if (selectedWalletName) {
      items.push({
        key: 'wallet',
        disabled: true,
        label: (
          <span style={{ color: '#667eea', fontWeight: 600 }}>
            {selectedWalletName}
          </span>
        ),
      });
      items.push({ type: 'divider' });
    }

    items.push({
      key: 'copy',
      icon: <CopyOutlined />,
      label: 'Copy Address',
      onClick: copyAddress,
    });

    items.push({
      key: 'disconnect',
      icon: <DisconnectOutlined />,
      label: 'Disconnect',
      onClick: handleDisconnect,
    });

    return items;
  };

  return (
    <>
    <HeaderTop>
      <Logo onClick={backToHome}>
        <div className="logo-text">MultiSender</div>
      </Logo>

      <HeaderActions>
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={backToHome}
        >
          Home
        </Button>

        {!account ? (
          <Button
            type="primary"
            icon={<WalletOutlined />}
            onClick={openWalletModal}
            loading={isConnecting}
          >
            Connect Wallet
          </Button>
        ) : (
          <Dropdown menu={{ items: getMenuItems() }} trigger={['click']}>
            <AccountDisplay>
              {networkName && (
                <NetworkBadge color={networkColor}>
                  {networkName}
                </NetworkBadge>
              )}
              <WalletOutlined />
              <span className="address">{formatAddress(account)}</span>
            </AccountDisplay>
          </Dropdown>
        )}
      </HeaderActions>
    </HeaderTop>

    <WalletModal
      visible={showWalletModal}
      onCancel={() => setShowWalletModal(false)}
      onConnect={handleWalletConnect}
    />
  </>
  );
};

export default Header;
