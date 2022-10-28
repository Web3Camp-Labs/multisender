const { ethers } = require("ethers");
const fs = require("fs");
const parse = require('csv-parse/lib/sync');
const colors = require("colors");
const { exit } = require("process");
require("dotenv").config();

const pageSize = 200; // How many tx per transaction
const startPage = 0;
const dryrun = false;
const handleError = true;

const networkName = "polygon";
const inputFile = "./inputs.csv";

const NETWORKS = {
    bsctest: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        accounts: [process.env.TESTNET_PRIVATE_KEY],
        senderAddress: "0x845c08d0ba1f8db01b50e411e3fa95224a2c2951",
        senderAbiPath: "./abis/other/sender.abi.json",
        erc20AbisPath: "./abis/other/ERC20.abi.json"
    },

    bsc: {
        url: "https://bsc-dataseed1.binance.org",
        accounts: [process.env.TESTNET_PRIVATE_KEY],
        senderAddress: "0x2Ba47E18597a6478eC0c481a765B8D1986577A39",
        senderAbiPath: "./abis/other/sender.abi.json",
        erc20AbisPath: "./abis/other/ERC20.abi.json"
    },

    mainnet: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
        accounts: [process.env.MAINNET_PRIVATE_KEY],
        senderAddress: "0x71402BD4ccE356C41Bb3c5070a0E124E9989cbc0",
        senderAbiPath: "./abis/mainnet/sender.abi.json",
        erc20AbisPath: "./abis/mainnet/ERC20.abi.json"
    },

    polygon: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
        accounts: [process.env.POLYGON_PRIVATE_KEY],
        senderAddress: "0x0e5d3Eb41710Ad7d67893a548ba082c62B7D85be",
        senderAbiPath: "./abis/other/sender.abi.json",
        erc20AbisPath: "./abis/other/ERC20.abi.json"
    }
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
    console.log(colors.green(`========== Multisend started ==========`));

    let network;
    if (networkName == "mainnet") {
        network = NETWORKS.mainnet;
    } else if (networkName == "bsc") {
        network = NETWORKS.bsc;
    } else if (networkName == "bsctest") {
        network = NETWORKS.bsctest;
    } else if (networkName == "polygon") {
        network = NETWORKS.polygon;
    } else {
        console.error("unexpected network");
        exit(1);
    }
    console.log(network);

    // Step 1 Prepare

    // Step 1.4 Prepare Smart Contracts
    // const senderAddress = JSON.parse(fs.readFileSync("../front-end/pages/config/mainnet.json", "utf8"))["sender"];
    const senderAddress = network.senderAddress;
    const senderABI = JSON.parse(fs.readFileSync(network.senderAbiPath, "utf8"));

    const tokenAddress = process.env.TOKEN_ADDRESS; // FIXME: test USDT, to be replaced with parameter
    const tokenABI = JSON.parse(fs.readFileSync(network.erc20AbisPath, "utf8"));

    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(network.accounts[0], provider);

    const senderContract = new ethers.Contract(senderAddress, senderABI, wallet);
    await senderContract.deployed();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    await tokenContract.deployed();

    console.log(colors.green(`========== signer address ==========`), wallet.getAddress());
    console.log(colors.green(`========== senderContract ==========`), senderContract.address);
    console.log(colors.green(`========== tokenContract ==========`), tokenContract.address);

    let decimals = await tokenContract.decimals();
    console.log(colors.green(`========== token decimals =========`), decimals);
    // return;

    // Step 1.1 Check csv columns
    let data = loadcsv(inputFile);
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

    if (handleError && hasError) {
        console.error(colors.red("Error found. Please check your csv file."));
        return;
    }

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
                amounts.push(ethers.utils.parseUnits(element.amount.toString(), decimals));

                totalAmount += element.amount;
            }
        }
        console.log(`Total Amount ${totalAmount}`);
    }




    // Step 1.5 Check Balance
    {
        const balance = await tokenContract.balanceOf(wallet.getAddress());
        const mybalance = parseFloat(ethers.utils.formatUnits(balance, decimals));

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

        let feeData = await provider.getFeeData();
        console.log(feeData);

        // let allowence = await tokenContract.allowenceOf(senderContract.address);
        // if (allowence < ethers.utils.parseUnits(totalAmount.toString(), decimals)) {
        console.log(`Approve MaxUint256 for contract ${senderContract.address} ...`);
        let res = await tokenContract.approve(senderContract.address, ethers.constants.MaxUint256, { gasPrice: 100_000_000_000});
        await res.wait();
        // }

        // await tokenContract.approve(senderContract.address, ethers.utils.parseEther(totalAmount.toString()));
        // await tokenContract.approve(senderContract.address, ethers.constants.MaxUint256);
        console.log("Send in progress...");

        for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
            console.log(`sending from ${index} to ${index + pageSize}`);
            const addressArray = addresses.slice(index, index + pageSize);
            const amountArray = amounts.slice(index, index + pageSize);

            if (networkName === "mainnet") { // FIXME: Ethereum Mainnet is still using old version. 
                let res = await senderContract.batchSendToken(tokenContract.address, addressArray, amountArray);
                await res.wait();
                console.log(`tx: ${res.tx}`);
            } else {
                let feeData = await provider.getFeeData();
                console.log(feeData);
                console.log('maxFeePergas: ', feeData.maxFeePerGas.toNumber());
                console.log('maxPriorityFeePerGas', feeData.maxPriorityFeePerGas.toNumber())
                // let gasCost = await senderContract.estimateGas.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: feeData.maxFeePerGas, gasLimit: 3e7 });
                // console.log('estimate gas: ', gasCost);
                // return;
                let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 100_000_000_000, gasLimit: 2e7 });

                console.log(`tx:`, res);

                await res.wait();
                console.log(`tx: ${res.tx}`);
            }
        }

        const balance = await tokenContract.balanceOf(wallet.getAddress());
        const mybalance = ethers.utils.formatUnits(balance, decimals);

        console.log(`My balance ${mybalance}`);
    }

    console.log(colors.green(`========== Multisend ended ==========`));
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
