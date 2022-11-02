# Multi Sender for Tokens

This tool is mainly for sending multiple tx in one transaction on EVM chains. The maximum transfer per transaction would be **200** as default.

Currently supported chains: **Ethereum**, **Polygon**, **BNB Chain**, **Moonbeam**, other chains will be available soon.

# Using CLI Tool

Install the packages by run `yarn` in the root folder.

Copy `.env.example` as `.env`, and replace with your configurations.

The command to multi-send tokens.
```shell
npx ts-node send.ts -n <network> -c <path to the multi send addresses> -t <erc20 token address>
```

The csv file format will be like `<address>,<amount>` shown below:

```csv
address,amount
0xeb01ff124d71b6c7e6613fd6e0a86c28c733f008,0.0001
0xfa1afc4534fc9f80a552e61dd04cd8a172c821a6,0.0001
0x6cc836b535eb9431f9def82b71f80e449f29c821,0.0001
```

# Front
### Install

Run `yarn` in `front-end` folder to install all packages needed for frontend.

# Contracts

### Install packages
Run `yarn` in root folder to install all packages needed for contracts.

### Build & Deploy Contracts

Run tests
```shell
npx hardhat test
```

Deploy
```
npx hardhat run scripts/0_deploy_sender.tx --network ethereum

npx hardhat run scripts/0_deploy_sender.tx --network polygon

npx hardhat run scripts/0_deploy_sender.tx --network bnbchain

npx hardhat run scripts/0_deploy_sender.tx --network moonbeam
```

Upgrade 
```
npx hardhat run scripts/1_upgrade_sender.tx --network ethereum

npx hardhat run scripts/1_upgrade_sender.tx --network polygon

npx hardhat run scripts/1_upgrade_sender.tx --network bnbchain

npx hardhat run scripts/1_upgrade_sender.tx --network moonbeam
```

### Contracts
Ethereum Mainet   
BSC Mainnet  
Polygon Mainnet  
Moonbeam Mainnet  