# Web3Camp MultiSender - React Implementation

This is a React implementation of the Web3Camp MultiSender application, which allows sending ETH and ERC-20 tokens to multiple addresses in a single transaction.

## Features

- Send ETH and ERC-20 tokens to multiple addresses in a single transaction
- Import addresses and amounts from Excel files
- Support for multiple networks (Ethereum, BSC, Polygon)
- Transaction history tracking
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Web3Camp-Labs/multisender.git
cd multisender/react-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
```

The build output will be in the `build/` directory.

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the header to connect your Web3 wallet.

2. **Step 1 - Prepare**:
   - Enter the token address (use 0x000000000000000000000000000000000000bEEF for ETH)
   - Import addresses and amounts from Excel or enter them manually in the format: `address,amount`
   - Click "Next" to proceed

3. **Step 2 - Confirm**:
   - Review the list of recipients and transaction summary
   - For ERC-20 tokens, approve the token spending if needed
   - Click "Send" to execute the transactions

4. **Step 3 - Result**:
   - View the transaction history with links to block explorers
   - Download a CSV file of any failed transactions (if applicable)

## Network Support

The application supports the following networks:
- Ethereum Mainnet
- Binance Smart Chain
- Polygon
- BSC Testnet

## Technical Details

This application is built with:
- React 18
- TypeScript
- Vite (fast build tool)
- ethers.js for Web3 integration
- React Bootstrap for UI components
- Styled Components for styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Next.js implementation by Web3Camp
- [ethers.js](https://docs.ethers.io/)
- [React Bootstrap](https://react-bootstrap.github.io/)
