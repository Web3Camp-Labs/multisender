
const accountlist = async () => {
    const { ethereum } = window;
    if (typeof ethereum == 'undefined') return ;

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];

    // if (window.web3) {
    //     window.web3 = new Web3(window.web3.currentProvider);
    //     window.ethereum.enable();
    //     return true;
    // }
    // return false;


}

export default {
    accountlist,
    // accountAddress,
    // accountName,
    // accountInjector,
}
