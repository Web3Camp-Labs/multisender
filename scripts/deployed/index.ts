import { network } from "hardhat";

import ethereum from "./ethereum";
import bnbchain from "./bnbchain";
import polygon from "./polygon";
import bnbtest from "./bnbchain-test";

var configuration:any;

switch (network.name) {
    case 'ethereum':
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

    case 'bnbchain-test':
    case 'bnbchaintest':
    case 'bsctest':
        configuration = bnbtest;
        break;

    default:
        break;
}

export default configuration;