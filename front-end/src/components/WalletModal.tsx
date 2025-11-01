import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Typography, Divider } from 'antd';
import { WalletOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { detectWallets, WALLET_TYPES, Wallet } from '../utils/walletUtils';

const { Title, Paragraph, Text } = Typography;

const WalletOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 249, 249, 1) 100%);

  &:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const WalletIcon = styled.div`
  font-size: 42px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const WalletName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
`;

const WalletDescription = styled.div`
  font-size: 13px;
  color: #718096;
  margin-top: 4px;
`;

const NoWalletSection = styled.div`
  text-align: center;
  padding: 30px 20px;
  background-color: #f7fafc;
  border-radius: 12px;
  margin-top: 20px;
`;

const InstallButton = styled(Button)`
  margin-top: 16px;
  height: 40px;
  font-weight: 600;
  border-radius: 8px;
`;

const ModalTitle = styled(Title)`
  text-align: center;
  margin-bottom: 8px !important;
`;

const ModalDescription = styled(Paragraph)`
  text-align: center;
  color: #718096;
  margin-bottom: 24px !important;
`;

interface WalletModalProps {
  visible: boolean;
  onCancel: () => void;
  onConnect: (wallet: Wallet) => Promise<void>;
}

/**
 * Wallet connection modal
 */
const WalletModal: React.FC<WalletModalProps> = ({ visible, onCancel, onConnect }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      const availableWallets = detectWallets();
      setWallets(availableWallets);
    }
  }, [visible]);

  const handleConnect = async (wallet: Wallet) => {
    setConnecting(wallet.name);
    try {
      await onConnect(wallet);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setConnecting(null);
    }
  };

  const getWalletDescription = (walletName: string): string => {
    switch (walletName) {
      case WALLET_TYPES.METAMASK:
        return 'Popular browser wallet for Ethereum';
      case WALLET_TYPES.COINBASE:
        return 'Secure wallet from Coinbase';
      case WALLET_TYPES.INJECTED:
        return 'Browser wallet extension';
      default:
        return 'Connect with your wallet';
    }
  };

  const renderWalletOptions = () => {
    if (wallets.length === 0) {
      return (
        <NoWalletSection>
          <WalletIcon style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</WalletIcon>
          <Title level={4}>No Wallet Detected</Title>
          <Paragraph>
            To connect your wallet, you need to install a browser extension wallet. We recommend
            MetaMask or Coinbase Wallet.
          </Paragraph>
          <Space size="middle">
            <InstallButton
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.open('https://metamask.io/download.html', '_blank')}
            >
              Install MetaMask
            </InstallButton>
            <InstallButton
              icon={<DownloadOutlined />}
              onClick={() => window.open('https://www.coinbase.com/wallet/downloads', '_blank')}
            >
              Install Coinbase Wallet
            </InstallButton>
          </Space>
        </NoWalletSection>
      );
    }

    return wallets.map((wallet, index) => (
      <WalletOption key={index} onClick={() => handleConnect(wallet)}>
        <WalletInfo>
          <WalletIcon>{wallet.icon}</WalletIcon>
          <div>
            <WalletName>{wallet.name}</WalletName>
            <WalletDescription>{getWalletDescription(wallet.name)}</WalletDescription>
          </div>
        </WalletInfo>
        <Button
          type="primary"
          icon={<WalletOutlined />}
          loading={connecting === wallet.name}
          disabled={connecting !== null && connecting !== wallet.name}
        >
          {connecting === wallet.name ? 'Connecting...' : 'Connect'}
        </Button>
      </WalletOption>
    ));
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={520}
      centered
      destroyOnClose
    >
      <ModalTitle level={3}>
        <WalletOutlined style={{ marginRight: '8px', color: '#667eea' }} />
        Connect Your Wallet
      </ModalTitle>
      <ModalDescription>
        Choose your preferred wallet to connect to MultiSender
      </ModalDescription>

      <Divider style={{ margin: '16px 0 24px' }} />

      {renderWalletOptions()}

      <Divider style={{ margin: '24px 0 16px' }} />

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          By connecting your wallet, you agree to our Terms of Service
        </Text>
      </div>
    </Modal>
  );
};

export default WalletModal;
