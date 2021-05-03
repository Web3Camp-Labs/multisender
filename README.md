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


