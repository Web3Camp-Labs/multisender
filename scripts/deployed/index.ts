import { network } from "hardhat";

import ethereum from "./ethereum";
import bnbchain from "./bnbchain";
import polygon from "./polygon";
import moonbeam from "./moonbeam";


import bnbtest from "./bnbchain-test";

var configuration: any;

switch (network.name) {
    case 'ethereum':
    case 'mainnet':
        configuration = ethereum;
        break;

    case 'bnbchain':
    case 'bsc':
        configuration = bnbchain;
        break;

    case 'polygon':
    case 'matic':
        configuration = polygon;
        break;

    case 'moonbeam':
        configuration = moonbeam;
        break;

    case 'bnbchain-test':
    case 'bnbchaintest':
    case 'bsctest':
        configuration = bnbtest;
        break;

    default:
        break;
}

export default configuration;