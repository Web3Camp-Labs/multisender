const accountlist = async () => {
    const { ethereum } = window;
    if (typeof ethereum == 'undefined') {
        return {
            type:'error'
        } ;
    }
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return {
        type:'success',
        data: accounts[0]
     }

}

export default {
    accountlist,
}
