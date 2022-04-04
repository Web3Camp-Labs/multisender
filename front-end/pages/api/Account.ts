const accountList = async () => {
    const { ethereum } = window as any;
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
    accountList,
}
