# Multi Sender for ERC20 Tokens

This tool is mainly for sending multiple tx in one transaction.

# Install

Run `npm i` to install all packages needed for this tool.

# Build & Deploy

Run `truffle migrate --network development` to build and deploy to local testnet. Please pay attention to the network id of your local testnet and the network id configed in truffle-config.js.

# Test

Run `truffle test --network development` to run the unit tests.

# Scripts

After deploy the contracts including the ERC20 token and MultiSender, please run `WORKDIR="./data/" DRYRUN=0 truffle exec ./scripts/send.js --network development` to test the multisend feature with local test net.

If you want dryrun this script, please change the `DRYRUN` to 1 in `WORKDIR="./data/" DRYRUN=1 truffle exec ./scripts/send.js --network development`.


# Contracts
Ethereum Mainet 0x71402BD4ccE356C41Bb3c5070a0E124E9989cbc0  
Kovan 0x3A4cDe6D856cE7421b563FE50f54e6731196E18a  
Heco Mainnet 0x063084091a393F9Bc92186CDEDFaf0B4e8909d87  
Heco Testnet 0x6A365dCadF3A3b81593985FD749611B8311cE9dF  
BSC Mainnet 0x2Ba47E18597a6478eC0c481a765B8D1986577A39   
BSC Testnet 0x845c08d0ba1f8db01b50e411e3fa95224a2c2951  
Polygon Mainnet 0x0e5d3Eb41710Ad7d67893a548ba082c62B7D85be
