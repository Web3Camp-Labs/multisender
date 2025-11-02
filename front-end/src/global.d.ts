/**
 * Global type declarations for Ethereum provider
 */

interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string | null;
  chainId?: string;
}

interface Window {
  ethereum?: EthereumProvider;
  coinbaseWalletExtension?: EthereumProvider;
}
