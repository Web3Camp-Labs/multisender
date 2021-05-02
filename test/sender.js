const truffleAssert = require('truffle-assertions');

const ERC20Token = artifacts.require('ERC20Token');
const SenderContract = artifacts.require("MultiSender");

const BN = web3.utils.BN;

const UNIT = new BN('1000000000000000000');
const SUPPLY = UNIT.mul(new BN('1000000000'));

contract('MultiSender Contract', accounts => {
  let token;
  let sender;

  before(async () => {
    token = await ERC20Token.deployed();
    sender = await SenderContract.deployed();
  })

  it('should put 1B ERC20 Token in the first account', async () => {
    const balance = await token.balanceOf(accounts[0]);
    assert(balance.eq(SUPPLY), '1B wasn\'t in the first account');
  });

});
