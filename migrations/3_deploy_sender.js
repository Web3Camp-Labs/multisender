const MultiSender = artifacts.require("MultiSender");

module.exports = function (deployer, networkName, accounts) {

    deployer.then(async () => {
        if (networkName !== 'mainnet') {
            await deployer.deploy(MultiSender);
        } else {
            await deployer.deploy(MultiSender);
        }
    })

};
