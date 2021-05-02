const truffleAssert = require('truffle-assertions');

const ERC20Token = artifacts.require('ERC20Token');
const BN = web3.utils.BN;

const UNIT = new BN('1000000000000000000');
const SUPPLY = UNIT.mul(new BN('1000000000'));

contract('ERC20 Token', accounts => {
  let token;

  before(async () => {
    token = await ERC20Token.deployed();
  })

  it('should put 1B ERC20 Token in the first account', async () => {
    const balance = await token.balanceOf(accounts[0]);
    assert(balance.eq(SUPPLY), '1B wasn\'t in the first account');
  });

  it('should send 1 ERC20 Token to accounts[1]', async () => {
    await token.transfer(accounts[1], UNIT);
    const balance = await token.balanceOf(accounts[0]);
    assert(balance.eq(SUPPLY.sub(UNIT)), 'Bad balance');
  });

  it('should allow 3rd party to transfer from the owner with allowance', async () => {
    await token.transfer(accounts[1], UNIT.muln(100));
    await token.approve(accounts[2], UNIT);
    const balanceBefore = await token.balanceOf(accounts[0]);
    await token.transferFrom(accounts[0], accounts[1], UNIT, {from: accounts[2]});
    const balanceAfter = await token.balanceOf(accounts[0]);
    assert(balanceBefore.sub(UNIT).eq(balanceAfter), 'Balance should change');
  });

});
