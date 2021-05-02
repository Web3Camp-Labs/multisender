const ERC20Token = artifacts.require("ERC20Token");

const BN = web3.utils.BN;
const UNIT = new BN('1000000000000000000');

module.exports = function (deployer, networkName, accounts) {

    deployer.then(async () => {
        if (networkName !== 'mainnet') {
            await deployer.deploy(ERC20Token, new BN('1000000000').mul(UNIT));
        }
    })

};
