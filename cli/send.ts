import { ethers, Wallet } from "ethers";
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
import { token } from "../typechain/@openzeppelin/contracts";


const senderAbiPath = "../abi/MultiSender.json";
const erc20AbisPath = "../abi/ERC20.json";

const NETWORKS = {
    // Test networks
    bsctest: {
        // url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        url: "https://dimensional-magical-sun.bsc-testnet.discover.quiknode.pro/8d7ff025c5d4a1aa94bfcdf8a563bf156c120ca7/",
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

function formatTx(tx: any) {
    console.log(`tx.nonce: `, tx.nonce);
    console.log(`tx.to: `, tx.to);
    console.log(`tx.vaue: `, tx.value);
    console.log(`tx.chainId: `, tx.chainId);
    console.log(`tx.from: `, tx.from);
    console.log(`tx.hash: `, tx.hash);
}

async function execute() {


    program
        .name('multisender-cli')
        .description('CLI to multisend tokens')
        .version('0.0.1');

    program
        .requiredOption('-n, --network <string>', "the networks to send tokens, ethereum, polygon, bnbchain, moonbeam, bsctest")
        .requiredOption('-c, --csv <string>', "the csv file contains all the sending data")
        .option('-t, --token <string>', "the multi send token address, the default value is native token", '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
        .option('-m, --merge-multi-entry', "handle multi entry, sum duplicate entries", false)
        .option('-o, --optimize', "gas optimization", false)
        .option('-d, --dry-run', "dry-run", false);

    program.parse();

    let opts = program.opts();
    console.log(opts);

    console.log(colors.green(`========== Multisend started ==========`));


    var pageSize = 250; // How many tx per transaction
    var threshold = 50; // How many tx with same amount will be handled by 
    var startPage = 0;
    var dryrun = false;
    var multientry = false;
    var optimization = false;

    var handleError = true;
    var inputFile = '';
    var tokenAddress = '';
    var decimals = 18;
    var senderAddress = '';
    var network;

    // Step 1 Prepare

    // mainnets
    if (opts.network === "ethereum" || opts.network === "mainnet") {
        network = NETWORKS.mainnet;
        senderAddress = ethereum.contracts.sender;
    } else if (opts.network === "bsc" || opts.network === "bnbchain") {
        network = NETWORKS.bsc;
        senderAddress = bnbchain.contracts.sender;
    } else if (opts.network === "polygon" || opts.network === "matic") {
        network = NETWORKS.polygon;
        senderAddress = polygon.contracts.sender;

        //testnet
    } else if (opts.network === "bsctest" || opts.network === "bnbtest") {
        network = NETWORKS.bsctest;
        senderAddress = bnbtest.contracts.sender;
    } else {
        console.error("unexpected network");
        exit(1);
    }
    // console.log(network);
    console.log(`sender address: ${senderAddress}`);
    console.log(`sender abi: ${senderAbiPath}`);
    console.log(`erc20 abi: ${erc20AbisPath}`);

    inputFile = opts.csv;
    tokenAddress = opts.token;
    dryrun = opts.dryRun;
    multientry = opts.mergeMultiEntry;
    optimization = opts.optimize;

    // Step 1.1 Prepare Smart Contracts
    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(network.accounts[0] || '', provider);

    // init sender contract
    const senderABI = JSON.parse(fs.readFileSync(senderAbiPath, "utf8"));
    const senderContract = new ethers.Contract(senderAddress, senderABI, wallet);
    await senderContract.deployed();

    console.log(colors.green(`========== signer address ==========`), await wallet.getAddress());
    console.log(colors.green(`========== senderContract ==========`), senderContract.address);

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
    let addressMap: Map<string, number> = new Map<string, number>;
    data.forEach((element: { address: string, amount: number }) => {
        if (!ethers.utils.isAddress(element.address)) {
            hasError = true;
            console.log(colors.red(`Invalid address : ${element.address}`));
        } else if (element.address in addressMap) {
            console.log(colors.yellow(`Duplicate address : ${element.address}`));
            if (multientry) {
                console.log(colors.green(`Sum duplicate entries for one address`));
                addressMap.set(element.address, element.amount + (addressMap.get(element.address) || 0));
            }
        } else {
            addressMap.set(element.address, element.amount);
        }
    });

    if (handleError && hasError) {
        console.error(colors.red("Error found. Please check your csv file."));
        return;
    }

    // Step 1.4 Prepare Address List and Amount List
    let totalAmount = 0;
    let totalAmountBN: ethers.BigNumber;
    let addresses = [];
    let amounts: Array<number> = [];

    {
        for (let [key, element] of addressMap) {
            addresses.push(key);
            amounts.push(element);
            totalAmount += element;
        }

        console.log(`totalAmount: ${totalAmount}`)
        totalAmountBN = ethers.utils.parseUnits(totalAmount.toFixed(decimals), decimals);
    }

    console.log(`Total addresses: ${addresses.length}, Total Amount : ${totalAmount}, The Sender Contract : ${senderContract.address}`);


    // Step 1.5 Check Balance
    {
        // init token contract
        if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") { // native token
            decimals = 18;
            const mybalance = await wallet.getBalance();
            if (totalAmountBN.gt(mybalance)) {
                console.log(colors.red(`Error, insufficient balance.`));
                return;
            }
        } else {
            const tokenABI = JSON.parse(fs.readFileSync(erc20AbisPath, "utf8"));
            const tokenContract = new ethers.Contract(tokenAddress || '', tokenABI, wallet);
            await tokenContract.deployed();
            decimals = await tokenContract.decimals();
            console.log(colors.green(`========== tokenContract ==========`), tokenContract.address);
            console.log(colors.green(`========== token decimals =========`), decimals);

            const mybalance = await tokenContract.balanceOf(await wallet.getAddress());
            console.log(colors.red(`My balance ${ethers.utils.formatUnits(mybalance, decimals)}`));
            if (totalAmountBN.gt(mybalance)) {
                console.log(colors.red(`Error, insufficient balance.`));
                return;
            }
        }
    }




    // Step 2 Execute
    {

        let feeData = await provider.getFeeData();
        console.log(feeData);

        let totalGas: number = 0;


        if (optimization) {
            // Step 2.1 gas optimization
            let fixedAmountMap: Map<string, Array<string>> = new Map<string, Array<string>>;
            for (let [key, element] of addressMap) {
                let strAmount = element.toString();
                if (fixedAmountMap.has(strAmount)) {
                    fixedAmountMap.get(strAmount)?.push(key);
                } else {
                    fixedAmountMap.set(strAmount, [key]);
                }
            }

            let totalTxNum = 0;
            let fixedNum = 0;
            let fixedTxNum = 0;
            let notFixedNum = 0;
            let notFixedTxNum = 0;

            let fixedAddresses: Map<string, Array<string>> = new Map<string, Array<string>>;
            let notFixedAddresses: Array<string> = [];
            let notFixedAmounts: Array<number> = [];
            for (let [key, element] of fixedAmountMap) {
                // console.log(`fixed amount: ${key}, has ${element.length}`);
                if (element.length > threshold) {
                    let txNum = Math.ceil(element.length / (2 * pageSize));
                    console.log(`fixed amount: ${key}, has ${element.length}, tx number: ${txNum}`);
                    fixedNum += element.length;
                    fixedTxNum += txNum;
                    fixedAddresses.set(key, element);
                } else {
                    notFixedNum += element.length;
                    notFixedAddresses = notFixedAddresses.concat(element);
                    notFixedAmounts = notFixedAmounts.concat(Array(element.length).fill(key));
                }
            }

            notFixedTxNum = Math.ceil(notFixedNum / pageSize);
            totalTxNum = fixedTxNum + notFixedTxNum;

            console.log(`original tx number: ${Math.ceil(addresses.length / pageSize)}, not fixed number: ${notFixedNum}, not fixed tx number: ${notFixedTxNum}, fixed number: ${fixedNum}, fixed tx number: ${fixedTxNum}, total tx number: ${totalTxNum}`);

            console.log(`notFixedAddresses length: ${notFixedAddresses.length}`);

            for (let [strAmount, addresses] of fixedAddresses) {
                let amount = parseFloat(strAmount);
                await batchSendFixedToken(tokenAddress, addresses, amount, wallet, 2 * pageSize);
            }

            await batchSendToken(tokenAddress, notFixedAddresses, notFixedAmounts, wallet, pageSize);

            console.log(`total gas cost: ${totalGas}`);

        } else {
            // Step 2.2 without gas optimization
            await batchSendToken(tokenAddress, addresses, amounts, wallet, pageSize);

            console.log(`total gas cost: ${totalGas}`);
        }

        async function batchSendToken(tokenAddress: string, addresses: Array<string>, amounts: Array<number>, wallet: Wallet, pageSize: number) {
            console.log(`batchSendToken`);
            if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
                for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
                    console.log(`sending from ${index} to ${index + pageSize}`);
                    const addressArray = addresses.slice(index, index + pageSize);
                    const amountArray = amounts.slice(index, index + pageSize);
                    const amountArrayBN = amountArray.map(elem => { return ethers.utils.parseEther(elem.toString()) });
                    const totalAmountBN = amountArrayBN.reduce((prev, curr) => { return prev.add(curr); });

                    let feeData = await provider.getFeeData();
                    console.log(feeData);
                    console.log('maxFeePergas: ', feeData?.maxFeePerGas?.toNumber());
                    console.log('maxPriorityFeePerGas', feeData?.maxPriorityFeePerGas?.toNumber())
                    let gasCost = await senderContract.estimateGas.batchSendEther(addressArray, amountArrayBN, { value: totalAmountBN });
                    console.log('estimate gas: ', gasCost.toString());
                    totalGas += gasCost.toNumber();

                    if (dryrun) {
                        console.log('with Dryrun ~~~~');
                    } else {
                        let tx = await senderContract.batchSendEther(addressArray, amountArrayBN, { value: totalAmountBN });
                        // let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });

                        formatTx(tx);
                        await tx.wait();
                    }
                }

                const mybalance = ethers.utils.formatEther(await wallet.getBalance());
                console.log(`My balance ${mybalance}`);
            } else {

                // check allowance
                const tokenABI = JSON.parse(fs.readFileSync(erc20AbisPath, "utf8"));
                const tokenContract = new ethers.Contract(tokenAddress || '', tokenABI, wallet);
                await tokenContract.deployed();

                let allowance = await tokenContract.allowance(wallet.getAddress(), senderContract.address);
                if (totalAmountBN.gt(allowance) && !dryrun) {
                    console.log(`Approve for contract ${senderContract.address} ...`);
                    let tx = await tokenContract.approve(senderContract.address, totalAmountBN);
                    // let res = await tokenContract.approve(senderContract.address, totalAmountBN, { gasPrice: 100_000_000_000 });
                    // let res = await tokenContract.approve(senderContract.address, ethers.constants.MaxUint256, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });
                    formatTx(tx);
                    await tx.wait();
                }

                console.log("Sending in progress ...");

                for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
                    console.log(`sending from ${index} to ${index + pageSize}`);
                    const addressArray = addresses.slice(index, index + pageSize);
                    const amountArray = amounts.slice(index, index + pageSize);
                    const amountArrayBN = amountArray.map(elem => { return ethers.utils.parseUnits(elem.toString(), decimals) });

                    let feeData = await provider.getFeeData();
                    console.log(feeData);
                    console.log('maxFeePergas: ', feeData?.maxFeePerGas?.toNumber());
                    console.log('maxPriorityFeePerGas', feeData?.maxPriorityFeePerGas?.toNumber())
                    let gasCost = await senderContract.estimateGas.batchSendERC20(tokenContract.address, addressArray, amountArrayBN);
                    console.log('estimate gas: ', gasCost.toString());
                    totalGas += gasCost.toNumber();

                    if (dryrun) {
                        console.log('with Dryrun ~~~~');
                    } else {
                        let tx = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArrayBN);
                        // let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });

                        formatTx(tx);
                        await tx.wait();
                    }

                }

                const balance = await tokenContract.balanceOf(wallet.getAddress());
                const mybalance = ethers.utils.formatUnits(balance, decimals);

                console.log(`My balance ${mybalance}`);
            }
        }


        async function batchSendFixedToken(tokenAddress: string, addresses: Array<string>, amount: number, wallet: Wallet, pageSize: number) {
            console.log(`batchSendFixedToken`);
            if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
                for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
                    console.log(`sending from ${index} to ${index + pageSize}`);
                    const addressArray = addresses.slice(index, index + pageSize);
                    const amountBN = ethers.utils.parseEther(amount.toString());
                    const totalAmountBN = amountBN.mul(ethers.BigNumber.from(addressArray.length));

                    let feeData = await provider.getFeeData();
                    console.log(feeData);
                    console.log('maxFeePergas: ', feeData?.maxFeePerGas?.toNumber());
                    console.log('maxPriorityFeePerGas', feeData?.maxPriorityFeePerGas?.toNumber())
                    let gasCost = await senderContract.estimateGas.batchSendFixedEther(addressArray, amountBN, { value: totalAmountBN });
                    console.log('estimate gas: ', gasCost.toString());
                    totalGas += gasCost.toNumber();

                    if (dryrun) {
                        console.log('with Dryrun ~~~~');
                    } else {
                        let tx = await senderContract.batchSendFixedEther(addressArray, amountBN, { value: totalAmountBN });
                        // let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });

                        formatTx(tx);
                        await tx.wait();
                    }
                }

                const mybalance = ethers.utils.formatEther(await wallet.getBalance());
                console.log(`My balance ${mybalance}`);
            } else {

                // check allowance
                const tokenABI = JSON.parse(fs.readFileSync(erc20AbisPath, "utf8"));
                const tokenContract = new ethers.Contract(tokenAddress || '', tokenABI, wallet);
                await tokenContract.deployed();

                let allowance = await tokenContract.allowance(wallet.getAddress(), senderContract.address);
                if (totalAmountBN.gt(allowance) && !dryrun) {
                    console.log(`Approve for contract ${senderContract.address} ...`);
                    let tx = await tokenContract.approve(senderContract.address, totalAmountBN);
                    // let res = await tokenContract.approve(senderContract.address, totalAmountBN, { gasPrice: 100_000_000_000 });
                    // let res = await tokenContract.approve(senderContract.address, ethers.constants.MaxUint256, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });
                    formatTx(tx)
                    await tx.wait();
                }

                console.log("Sending in progress ...");

                for (let index = startPage * pageSize; index < addresses.length; index += pageSize) {
                    console.log(`sending from ${index} to ${index + pageSize}`);
                    const addressArray = addresses.slice(index, index + pageSize);
                    const amountBN = ethers.utils.parseUnits(amount.toString(), decimals);

                    let gasCost = await senderContract.estimateGas.batchSendFixedERC20(tokenContract.address, addressArray, amountBN, { gasLimit: 3e7 });
                    console.log('estimate gas: ', gasCost.toString());
                    totalGas += gasCost.toNumber();

                    if (dryrun) {
                        console.log('with Dryrun ~~~~');
                    } else {
                        let tx = await senderContract.batchSendFixedERC20(tokenContract.address, addressArray, amountBN);
                        // let res = await senderContract.batchSendERC20(tokenContract.address, addressArray, amountArray, { gasPrice: 1_500_000_000_000, gasLimit: 2e7 });

                        formatTx(tx);
                        await tx.wait();
                    }
                }

                const balance = await tokenContract.balanceOf(wallet.getAddress());
                const mybalance = ethers.utils.formatUnits(balance, decimals);

                console.log(`My balance ${mybalance}`);
            }
        }

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
