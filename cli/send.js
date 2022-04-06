const { ethers } = require("ethers");
const fs = require("fs");
const parse = require('csv-parse/lib/sync');
const colors = require("colors");
require("dotenv").config();

const pageSize = 200; // How many tx per transaction
const startPage = 0;
const dryrun = true;

const NETWORKS = {
    bsctest: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
};

function loadcsv(path) {
    const input = fs.readFileSync(path, 'utf-8');
    return parse(input, {
        encoding: 'utf8',
        trim: true,
        columns: true,
        auto_parse: true,
        skip_empty_lines: true,
        ltrim: true,
        rtrim: true,
        quoting: true,
        header: true,
        bom: true,
    })
}

async function execute() {
    console.log(colors.green(`========== started ==========`));

    // Step 1 Prepare

    // Step 1.1 Check csv columns
    let data = loadcsv("./inputs.csv");

    // console.log(colors.green(`========== data ==========`), data);

    data = data
        .map(r => { return { ...r, address: r.address.trim(), amount: parseFloat(r.amount) } })
        .filter(r => r.address && r.amount);

    if (data.length == 0) {
        console.error('Empty csv file or missing columns');
        return;
    }

    // console.log(colors.green(`========== data ==========`), data);

    // Step 1.2 Check addresses
    console.log("Check addresses ...");
    let hasError = false;
    let addressMap = {};
    data.forEach(element => {
        if (!ethers.utils.isAddress(element.address)) {
            hasError = true;
            console.log(colors.red(`Invalid address : ${element.address}`));
        } else if (element.address in addressMap) {
            console.log(colors.yellow(`Duplicate address : ${element.address}`));
            // addressMap[element.address].amount += element.amount;
        } else {
            addressMap[element.address] = {
                amount: element.amount
            }
        }
    });

    // if (hasError) {
    //     console.error(colors.red("Error found. Please check your csv file."));
    //     return;
    // }

    // Step 1.3 Prepare Address List and Amount List
    let totalAmount = 0;

    let addresses = [];
    let amounts = [];

    {
        for (const key in addressMap) {
            if (Object.hasOwnProperty.call(addressMap, key)) {
                const element = addressMap[key];
                // console.log(`Address : ${key}, Amount : ${element.amount}`);

                addresses.push(key);
                amounts.push(ethers.utils.parseEther(element.amount.toString()));

                totalAmount += element.amount;
            }
        }
        console.log(`Total Amount ${totalAmount}`);
    }

    // Step 1.4 Prepare Smart Contracts
    const senderAddress = JSON.parse(fs.readFileSync("../front-end/pages/config/bsctest.json", "utf8"))["sender"];
    const senderABI = JSON.parse(fs.readFileSync("../front-end/pages/abi/sender.abi.json", "utf8"));

    const tokenAddress = '0x11DBa5229EEF74eb7F8918685151572672ec8830'; // FIXME: test USDT, to be replaced with parameter
    const tokenABI = JSON.parse(fs.readFileSync("../front-end/pages/abi/ERC20.abi.json", "utf8"));

    const provider = new ethers.providers.JsonRpcProvider(NETWORKS.bsctest.url);
    const wallet = new ethers.Wallet(NETWORKS.bsctest.accounts[0], provider);

    const senderContract = new ethers.Contract(senderAddress, senderABI, wallet);
    await senderContract.deployed();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    await tokenContract.deployed();

    console.log(colors.green(`========== signer address ==========`), wallet.getAddress());
    console.log(colors.green(`========== senderContract ==========`), senderContract.address);
    console.log(colors.green(`========== tokenContract ==========`), tokenContract.address);


    // Step 1.5 Check Balance
    {
        const balance = await tokenContract.balanceOf(wallet.getAddress());
        const mybalance = parseFloat(ethers.utils.formatEther(balance));

        console.log(`My balance ${mybalance}`);
        if (mybalance < totalAmount) {
            console.log(colors.red(`Error, insufficient balance.`));
            return;
        }
    }

    console.log(`Total addresses: ${addresses.length}, Total Amount : ${totalAmount}, The Sender Contract : ${senderContract.address}`);

    // Step 2 Execute
    {
        if (dryrun) {
            console.log('Done with Dryrun ~~~~');
            return;
        }

        console.log(`Approve ${totalAmount} for contract ${senderContract.address} ...`);
        await tokenContract.approve(senderContract.address, ethers.utils.parseEther(totalAmount.toString()));

        console.log("Send in progress...");

        for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
            console.log(`sending from ${index} to ${index + pageSize}`);
            const addressArray = addresses.slice(index, index + pageSize);
            const amountArray = amounts.slice(index, index + pageSize);

            let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray);
            console.log(`tx: ${res.tx}`);
        }

        const balance = await tokenContract.balanceOf(wallet.getAddress());
        const mybalance = ethers.utils.formatEther(balance);

        console.log(`My balance ${mybalance}`);
    }



    console.log(colors.green(`========== ended ==========`));
}



const main = async () => {
    await execute()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
