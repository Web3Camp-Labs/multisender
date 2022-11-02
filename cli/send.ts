import { ethers } from "ethers";
import * as fs from "fs";
import parse from "csv-parse/lib/sync";
import colors from "colors";
import { exit } from "process";

import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { program } from "commander";

import ethereum from "../scripts/deployed/ethereum";
import bnbchain from "../scripts/deployed/bnbchain";
import polygon from "../scripts/deployed/polygon";
import bnbtest from "../scripts/deployed/bnbchain-test";


const senderAbiPath = "../abi/MultiSender.json";
const erc20AbisPath = "../abi/ERC20.json";

const NETWORKS = {
    // Test networks
    bsctest: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        accounts: [process.env.TESTNET_PRIVATE_KEY],
    },

    // Main networks
    bsc: {
        // url: "https://bsc-dataseed1.binance.org",
        url: "https://bsc-dataseed1.defibit.io/",
        accounts: [process.env.MAINNET_PRIVATE_KEY],
    },

    mainnet: {
        url: `https://eth-mainnet.g.alchemy.com/v2/ThP75c4L-jDh9F9d8_icKVhT9r9xdDRu`,
        accounts: [process.env.MAINNET_PRIVATE_KEY],
    },

    polygon: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/HnyOE6plvFb9l5AQfiE6vDYmE83bCrnd`,
        accounts: [process.env.MAINNET_PRIVATE_KEY],
    }
};

function loadcsv(path: string) {
    const input = fs.readFileSync(path, 'utf-8');
    return parse(input, {
        encoding: 'utf8',
        trim: true,
        columns: true,
        auto_parse: true,
        skip_empty_lines: true,
        ltrim: true,
        rtrim: true,
        // quoting: true,
        // header: true,
        bom: true,
    })
}

async function execute() {


    program
        .name('multisender-cli')
        .description('CLI to multisend tokens')
        .version('0.0.1');

    program
        .requiredOption('-n, --network <string>', "the networks to send tokens, ethereum, polygon, bnbchain, moonbeam, bsctest")
        .requiredOption('-c, --csv <string>', "the csv file contains all the sending data")
        .requiredOption('-t, --token <string>', "the multi send token address")
        .option('-d, --dry-run', "dry-run", false);

    program.parse();

    let opts = program.opts();
    console.log(opts);

    console.log(colors.green(`========== Multisend started ==========`));


    var pageSize = 200; // How many tx per transaction
    var startPage = 0;
    var dryrun = false;
    var handleError = true;
    var inputFile = '';
    var tokenAddress = '';
    var senderAddress = '';
    var network;

    // Step 1 Prepare
    if (opts.network === "ethereum" || opts.network === "mainnet") {
        network = NETWORKS.mainnet;
        senderAddress = ethereum.contracts.sender;
    } else if (opts.network == "bsc" || opts.network === "bnbchain") {
        network = NETWORKS.bsc;
        senderAddress = bnbchain.contracts.sender;
    } else if (opts.network == "polygon" || opts.network === "matic") {
        network = NETWORKS.polygon;
        senderAddress = polygon.contracts.sender;
    } else {
        console.error("unexpected network");
        exit(1);
    }
    console.log(network);
    console.log(`sender address: ${senderAddress}`);
    console.log(`sender abi: ${senderAbiPath}`);
    console.log(`erc20 abi: ${erc20AbisPath}`);

    inputFile = opts.csv;
    tokenAddress = opts.token;

    // Step 1.1 Prepare Smart Contracts

    const senderABI = JSON.parse(fs.readFileSync(senderAbiPath, "utf8"));
    const tokenABI = JSON.parse(fs.readFileSync(erc20AbisPath, "utf8"));

    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(network.accounts[0] || '', provider);

    const senderContract = new ethers.Contract(senderAddress, senderABI, wallet);
    await senderContract.deployed();
    const tokenContract = new ethers.Contract(tokenAddress || '', tokenABI, wallet);
    await tokenContract.deployed();

    console.log(colors.green(`========== signer address ==========`), wallet.getAddress());
    console.log(colors.green(`========== senderContract ==========`), senderContract.address);
    console.log(colors.green(`========== tokenContract ==========`), tokenContract.address);

    let decimals = await tokenContract.decimals();
    console.log(colors.green(`========== token decimals =========`), decimals);

    // Step 1.2 Check csv columns
    let data = loadcsv(inputFile);
    data = data
        .map((r: any) => { return { ...r, address: r.address.trim(), amount: parseFloat(r.amount) } })
        .filter((r: any) => r.address && r.amount);

    if (data.length == 0) {
        console.error('Empty csv file or missing columns');
        return;
    }

    // Step 1.3 Check addresses
    console.log("Check addresses ...");
    let hasError = false;
    let addressMap: Map<string, { amount: number }> = new Map<string, { amount: number }>;
    data.forEach((element: { address: string, amount: number }) => {
        if (!ethers.utils.isAddress(element.address)) {
            hasError = true;
            console.log(colors.red(`Invalid address : ${element.address}`));
        } else if (element.address in addressMap) {
            console.log(colors.yellow(`Duplicate address : ${element.address}`));
            // addressMap[element.address].amount += element.amount;
        } else {
            addressMap.set(element.address, {
                amount: element.amount
            })
        }
    });

    if (handleError && hasError) {
        console.error(colors.red("Error found. Please check your csv file."));
        return;
    }

    // Step 1.4 Prepare Address List and Amount List
    let totalAmount = 0;
    let totalAmountBN;
    let addresses = [];
    let amounts = [];

    {
        for (let [key, element] of addressMap) {
            addresses.push(key);
            amounts.push(ethers.utils.parseUnits(element.amount.toString(), decimals));
            totalAmount += element.amount;

            // console.log(`amount: ${element.amount}`)
        }

        console.log(`totalAmount: ${totalAmount}`)
        totalAmountBN = ethers.utils.parseUnits(totalAmount.toFixed(decimals), decimals);
    }

    // Step 1.5 Check Balance
    {
        const mybalance = await tokenContract.balanceOf(await wallet.getAddress());
        console.log(colors.red(`My balance ${ethers.utils.formatUnits(mybalance, decimals)}`));
        if (totalAmountBN.gt(mybalance)) {
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

        let allowance = await tokenContract.allowance(wallet.getAddress(), senderContract.address);
        if (totalAmountBN.gt(allowance)) {
            console.log(`Approve MaxUint256 for contract ${senderContract.address} ...`);
            let res = await tokenContract.approve(senderContract.address, totalAmountBN);
            // let res = await tokenContract.approve(senderContract.address, totalAmountBN, { gasPrice: 100_000_000_000 });
            // let res = await tokenContract.approve(senderContract.address, ethers.constants.MaxUint256, { gasPrice: 100_000_000_000, gasLimit: 2e7 });
            console.log(`tx: `, res);
            await res.wait();
        }

        console.log("Send in progress...");

        for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
            console.log(`sending from ${index} to ${index + pageSize}`);
            const addressArray = addresses.slice(index, index + pageSize);
            const amountArray = amounts.slice(index, index + pageSize);

            let feeData = await provider.getFeeData();
            console.log(feeData);
            console.log('maxFeePergas: ', feeData?.maxFeePerGas?.toNumber());
            console.log('maxPriorityFeePerGas', feeData?.maxPriorityFeePerGas?.toNumber())
            // let gasCost = await senderContract.estimateGas.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: feeData.maxFeePerGas, gasLimit: 3e7 });
            // console.log('estimate gas: ', gasCost);
            // return;

            let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray);
            // let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 100_000_000_000, gasLimit: 2e7 });

            console.log(`tx:`, res);
            await res.wait();
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
