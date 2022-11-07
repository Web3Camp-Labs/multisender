import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-docgen";

import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solpp";


import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {

    // test networks
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true
    },

    bsctest: {
      url: "https://dimensional-magical-sun.bsc-testnet.discover.quiknode.pro/8d7ff025c5d4a1aa94bfcdf8a563bf156c120ca7/",
      accounts: [process.env.TESTNET_PRIVATE_KEY || ''],
    },

    // main networks
    ethereum: {
      url: "https://eth-mainnet.g.alchemy.com/v2/ThP75c4L-jDh9F9d8_icKVhT9r9xdDRu",
      accounts: [process.env.MAINNET_PRIVATE_KEY || ''],
    },
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/HnyOE6plvFb9l5AQfiE6vDYmE83bCrnd",
      accounts: [process.env.MAINNET_PRIVATE_KEY || ''],
      gasPrice: 60_000_000_000
    },
    bsc: {
      url: "https://bsc-dataseed1.defibit.io/",
      accounts: [process.env.MAINNET_PRIVATE_KEY || ''],
    },
    moonbeam: {
      url: "https://rpc.api.moonbeam.network",
      accounts: [process.env.MAINNET_PRIVATE_KEY || ''],
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      }
    ]
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  typechain: {
    outDir: './typechain',
    target: 'ethers-v5',
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: false,
    flat: true
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: false
  },
  solpp: {
    noFlatten: true
  },
  mocha: {
    timeout: 100000
  },
};

export default config;
