// WORKDIR="./data/" DRYRUN=1 truffle exec ./scripts/send.js --network development
// WORKDIR="./data/" DRYRUN=1 truffle exec ./scripts/send.js --network kovan
// WORKDIR="./data/" DRYRUN=1 truffle exec ./scripts/send.js --network mainnet

require('dotenv').config();

const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const BN = web3.utils.BN;
const UNIT = new BN('1000000000000000000');

const Sender = artifacts.require('MultiSender');
const Token = artifacts.require('ERC20Token');

const dryrun = parseInt(process.env.DRYRUN || '1');
const workdir = process.env.WORKDIR;

const csvFile = `${workdir}/inputs.csv`;

function loadcsv(path) {
    const input = fs.readFileSync(path, 'utf-8');
    return parse(input, {
        columns: true,
        skip_empty_lines: true
    })
}

async function main() {
    console.log('Mutli send ERC20 token. Start with', { dryrun });

    const senderContract = await Sender.deployed();
    const tokenContract = await Token.deployed();

    const [account] = await web3.eth.getAccounts();

    // address,amount...
    let data = loadcsv(csvFile);

    // check csv columns
    data = data
        .map(r => { return { ...r, address: r.address.trim(), amount: parseFloat(r.amount) } })
        .filter(r => r.address && r.amount);

    if (data.length == 0) {
        console.error('Empty csv file or missing columns');
        return;
    }

    console.log("Check addresses ...");

    let hasError = false;
    let addressMap = {};
    data.forEach(element => {
        if (!web3.utils.isAddress(element.address)) {
            hasError = true;
            console.log(`Invalid address : ${element.address}`);
        }

        if (element.address in addressMap) {
            console.log(`Duplicate address : ${element.address}`);
            addressMap[element.address].amount += element.amount;
        } else {
            addressMap[element.address] = {
                amount: element.amount
            }
        }
    });

    let totalAmount = 0;

    let addresses = [];
    let amounts = [];

    for (const key in addressMap) {
        if (Object.hasOwnProperty.call(addressMap, key)) {
            const element = addressMap[key];
            console.log(`Address : ${key}, Amount : ${element.amount}`);

            addresses.push(key);
            amounts.push(web3.utils.toWei(element.amount.toString()));

            totalAmount += element.amount;
        }
    }
    console.log(`Total Amount ${totalAmount}`);

    if (hasError) {
        return;
    }

    {
        const balance = await tokenContract.balanceOf(account);
        const mybalance = parseFloat(web3.utils.fromWei(balance));

        console.log(`My balance ${mybalance}`);
        if (mybalance < totalAmount) {
            console.log(`Error, insufficient balance.`);
            return;
        }
    }

    console.log(`Total addresses: ${addresses.length}, Total Amount : ${totalAmount}, The Sender Contract : ${senderContract.address}`);

    {
        if (dryrun) {
            console.log('Done with Dryrun ~~~~');
            return;
        }

        console.log(`Approve ${totalAmount} for contract ${senderContract.address} ...`);
        await tokenContract.approve(senderContract.address, UNIT.muln(totalAmount));

        console.log("Send in progress...");

        const pageSize = 150;

        for (let index = 0; index < addresses.length; index+=pageSize) {
            console.log(`sending from ${index} to ${index + pageSize}`);
            const addressArray = addresses.slice(index, index+pageSize);
            const amountArray = amounts.slice(index, index+pageSize);

            let res = await senderContract.batchSendToken(tokenContract.address, addressArray, amountArray);
            console.log(`tx: ${res.tx}`);
        }
        
        const balance = await tokenContract.balanceOf(account);
        const mybalance = parseFloat(web3.utils.fromWei(balance));

        console.log(`My balance ${mybalance}`);
    }


    console.log('Done~~~~');
}

module.exports = async function (callback, networkName, accounts) {
    try {
        console.log(networkName)
        await main();
        callback();
    } catch (err) {
        console.error(err.message);
        callback(err);
    }
}