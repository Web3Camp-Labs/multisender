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

    it('multi send token', async () => {
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

        for (const elem of amounts) {
            totalAmount = totalAmount.add(elem);
        }

        // console.log("Total Amount: ", totalAmount);

        await token.approve(sender.address, totalAmount);

        const res = await sender.batchSendERC20(token.address, receivers, amounts);
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

    it('multi send eth', async () => {

        let amounts = [
            web3.utils.toWei('1')
            , web3.utils.toWei('2')
            , web3.utils.toWei('3')
            , web3.utils.toWei('4')
            , web3.utils.toWei('5')
            , web3.utils.toWei('4')
            , web3.utils.toWei('4')
            , web3.utils.toWei('2')
            , web3.utils.toWei('1')];

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

        for (const elem of amounts) {
            totalAmount = totalAmount.add(new BN(elem));
        }

        console.log("Total amount to send: ", totalAmount);

        let s = await web3.eth.getBalance(accounts[0]);
        let balance = web3.utils.fromWei(s);
        console.log("Current balance: ", balance);

        const res = await sender.batchSendEther(receivers, amounts, {
            from: accounts[0],
            value: web3.utils.toHex(totalAmount),
        });


        console.log("result : ", res);

        let index = 0;
        for (const elem of receivers) {
            let amount = amounts[index];
            let receiver = receivers[index];
            let s = await web3.eth.getBalance(receiver);
            let balance = web3.utils.fromWei(s);
            // assert(balance.eq(amount), 'wrong balance');
            console.log(`Address: ${receiver}, amount: ${amount}, balance: ${balance}`);

            index += 1;
        }

    });

    it('claim tokens', async () => {

        let amounts = [
            web3.utils.toWei('0.1')
            , web3.utils.toWei('0.2')
            , web3.utils.toWei('0.3')
            , web3.utils.toWei('0.4')
            , web3.utils.toWei('0.5')
            , web3.utils.toWei('0.6')
            , web3.utils.toWei('0.7')
            , web3.utils.toWei('0.8')
            , web3.utils.toWei('0.9')];

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

        for (const elem of amounts) {
            totalAmount = totalAmount.add(new BN(elem));
        }

        console.log("Total amount to send: ", totalAmount);

        let s = await web3.eth.getBalance(accounts[0]);
        let balance = web3.utils.fromWei(s);
        console.log("Current balance: ", balance);


        totalAmount = totalAmount.add(new BN(web3.utils.toWei("3"))); // extra

        const res = await sender.batchSendEther(receivers, amounts, {
            from: accounts[0],
            value: web3.utils.toHex(totalAmount),
        });


        console.log("result : ", res);

        let index = 0;
        for (const elem of receivers) {
            let amount = amounts[index];
            let receiver = receivers[index];
            let s = await web3.eth.getBalance(receiver);
            let balance = web3.utils.fromWei(s);
            // assert(balance.eq(amount), 'wrong balance');
            console.log(`Address: ${receiver}, amount: ${amount}, balance: ${balance}`);

            index += 1;
        }

        let b = await web3.eth.getBalance(sender.address);
        let bnb = new BN(b);
        console.log("Sender Contract balance before claim: ", web3.utils.fromWei(b));
        assert(bnb.eq(new BN(web3.utils.toWei("3"))), "incorrect balance of contract");

        await sender.claimTokens("0x0000000000000000000000000000000000000000");

        b = await web3.eth.getBalance(sender.address);
        bnb = new BN(b);
        console.log("Sender Contract balance after claim: ", web3.utils.fromWei(b));
        assert(bnb.eq(new BN(web3.utils.toWei("0"))), "incorrect balance of contract");
    });
});
