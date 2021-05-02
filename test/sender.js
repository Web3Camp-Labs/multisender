const { sortedIndex } = require('lodash');
const truffleAssert = require('truffle-assertions');

const ERC20Token = artifacts.require('ERC20Token');
const SenderContract = artifacts.require("MultiSender");

const BN = web3.utils.BN;

const UNIT = new BN('1000000000000000000');
const SUPPLY = UNIT.mul(new BN('1000000000'));

contract('MultiSender Contract', accounts => {
    let token;
    let sender;

    before(async () => {
        token = await ERC20Token.deployed();
        sender = await SenderContract.deployed();
    })

    it('should put 1B ERC20 Token in the first account', async () => {
        const balance = await token.balanceOf(accounts[0]);
        assert(balance.eq(SUPPLY), '1B wasn\'t in the first account');
    });

    it('multi send', async () => {
        const balance = await token.balanceOf(accounts[0]);
        assert(balance.eq(SUPPLY), '1B wasn\'t in the first account');


        let amounts = [
            UNIT.mul(new BN('1000'))
            , UNIT.mul(new BN('2000'))
            , UNIT.mul(new BN('3000'))
            , UNIT.mul(new BN('4000'))
            , UNIT.mul(new BN('5000'))
            , UNIT.mul(new BN('6000'))
            , UNIT.mul(new BN('7000'))
            , UNIT.mul(new BN('8000'))
            , UNIT.mul(new BN('9000'))];

        let receivers = [
            accounts[1]
            , accounts[2]
            , accounts[3]
            , accounts[4]
            , accounts[5]
            , accounts[6]
            , accounts[7]
            , accounts[8]
            , accounts[9]
        ]

        let totalAmount = new BN('0');

        for(const elem of amounts) {
            totalAmount = totalAmount.add(elem);
        }

        // console.log("Total Amount: ", totalAmount);

        await token.approve(sender.address, totalAmount);

        const res = await sender.batchSendToken(token.address, receivers, amounts);
        // console.log("result : ", res);

        let index = 0;
        for (const elem of receivers) {
            let amount = amounts[index];
            let receiver = receivers[index];

            const balance = await token.balanceOf(receiver);
            assert(balance.eq(amount), 'wrong balance');

            index += 1;
        }

    });
});
