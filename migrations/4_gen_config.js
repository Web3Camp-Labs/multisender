const MultiSender = artifacts.require("MultiSender");
const ERC20Token = artifacts.require("ERC20Token");

const fs = require('fs');

module.exports = function (deployer, networkName, accounts) {
    deployer.then(async () => {
        if (networkName !== 'mainnet') {
            const erc20Token = await ERC20Token.deployed();
            const multiSender = await MultiSender.deployed();

            let contracts = {
                sender: multiSender.address
            };

            fs.writeFileSync(`./front-end/src/config/contracts.json`, JSON.stringify(contracts, null, 4));

            const erc20Build = require('../build/contracts/ERC20Token.json');
            fs.writeFileSync(`./front-end/src/config/ERC20.abi.json`, JSON.stringify(erc20Build.abi, null, 4));

            const senderBuild = require('../build/contracts/MultiSender.json');
            fs.writeFileSync(`./front-end/src/config/sender.abi.json`, JSON.stringify(senderBuild.abi, null, 4));


            let config = {
                token: erc20Token.address,
                sender: multiSender.address
            };

            fs.writeFileSync(`./contracts-${networkName}.json`, JSON.stringify(config, null, 4));
        }
    })
};
