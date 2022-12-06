import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import type { BigNumber } from "ethers";
import { send } from "process";
import exp from "constants";

describe("MultiSender", function () {

  let token: Contract;
  let sender: Contract;
  let accounts: SignerWithAddress[];

  before(async () => {
    accounts = await ethers.getSigners();
    const balance = await accounts[0].getBalance();
    console.log('signer balance: ', ethers.utils.formatEther(balance));

    const MultiSender = await ethers.getContractFactory("MultiSender");
    sender = await upgrades.deployProxy(MultiSender);
    console.log('sender at: ', sender.address);

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    token = await ERC20Token.deploy(ethers.utils.parseEther('1000000000'));
    console.log('mock token at: ', token.address);
  })

  it("Multi send native token", async function () {

    let balances: BigNumber[] = [];

    let amounts = [
      ethers.utils.parseEther('10')
      , ethers.utils.parseEther('20')
      , ethers.utils.parseEther('30')
      , ethers.utils.parseEther('40')
      , ethers.utils.parseEther('50')
      , ethers.utils.parseEther('60')
      , ethers.utils.parseEther('70')
      , ethers.utils.parseEther('80')
      , ethers.utils.parseEther('90')];

    let receivers = [
      accounts[1].address
      , accounts[2].address
      , accounts[3].address
      , accounts[4].address
      , accounts[5].address
      , accounts[6].address
      , accounts[7].address
      , accounts[8].address
      , accounts[9].address
    ]

    for await (const iterator of receivers) {
      balances.push(await (await ethers.getSigner(iterator)).getBalance());
    }

    let totalAmount = ethers.BigNumber.from(0);

    for (const elem of amounts) {
      totalAmount = totalAmount.add(elem);
    }
    console.log('totalAmount: ', totalAmount.toString());

    let tx = await sender.batchSendEther(receivers, amounts, { value: totalAmount.add(ethers.utils.parseEther('9')) });
    await tx.wait();

    expect((await (await ethers.getSigner(receivers[0])).getBalance()).sub(balances[0])).to.equal(amounts[0]);
    expect((await (await ethers.getSigner(receivers[1])).getBalance()).sub(balances[1])).to.equal(amounts[1]);
    expect((await (await ethers.getSigner(receivers[2])).getBalance()).sub(balances[2])).to.equal(amounts[2]);
    expect((await (await ethers.getSigner(receivers[3])).getBalance()).sub(balances[3])).to.equal(amounts[3]);
    expect((await (await ethers.getSigner(receivers[4])).getBalance()).sub(balances[4])).to.equal(amounts[4]);
    expect((await (await ethers.getSigner(receivers[5])).getBalance()).sub(balances[5])).to.equal(amounts[5]);
    expect((await (await ethers.getSigner(receivers[6])).getBalance()).sub(balances[6])).to.equal(amounts[6]);
    expect((await (await ethers.getSigner(receivers[7])).getBalance()).sub(balances[7])).to.equal(amounts[7]);
    expect((await (await ethers.getSigner(receivers[8])).getBalance()).sub(balances[8])).to.equal(amounts[8]);

    let preBalance = await ethers.provider.getBalance(sender.address);
    console.log(`preBalance: ${ethers.utils.formatEther(preBalance)}`);
    tx = await sender.claimBalance('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');
    await tx.wait();

    let curBalance = await ethers.provider.getBalance(sender.address);
    console.log(`curBalance: ${ethers.utils.formatEther(curBalance)}`);
  });


  it("Multi send fixed amount of native token", async function () {

    let balances: BigNumber[] = [];

    let fixedAmount = ethers.utils.parseEther('99');

    let receivers = [
      accounts[1].address
      , accounts[2].address
      , accounts[3].address
      , accounts[4].address
      , accounts[5].address
      , accounts[6].address
      , accounts[7].address
      , accounts[8].address
      , accounts[9].address
    ]

    for await (const iterator of receivers) {
      balances.push(await (await ethers.getSigner(iterator)).getBalance());
    }

    let totalAmount = ethers.BigNumber.from('0');
    totalAmount = ethers.BigNumber.from(receivers.length).mul(fixedAmount);

    console.log('totalAmount: ', totalAmount.toString());

    let tx = await sender.batchSendFixedEther(receivers, fixedAmount, { value: totalAmount.add(ethers.utils.parseEther('9')) });
    await tx.wait();

    expect((await (await ethers.getSigner(receivers[0])).getBalance()).sub(balances[0])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[1])).getBalance()).sub(balances[1])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[2])).getBalance()).sub(balances[2])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[3])).getBalance()).sub(balances[3])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[4])).getBalance()).sub(balances[4])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[5])).getBalance()).sub(balances[5])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[6])).getBalance()).sub(balances[6])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[7])).getBalance()).sub(balances[7])).to.equal(fixedAmount);
    expect((await (await ethers.getSigner(receivers[8])).getBalance()).sub(balances[8])).to.equal(fixedAmount);

    let preBalance = await ethers.provider.getBalance(sender.address);
    console.log(`preBalance: ${ethers.utils.formatEther(preBalance)}`);
    tx = await sender.claimBalance('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');
    await tx.wait();

    let curBalance = await ethers.provider.getBalance(sender.address);
    console.log(`curBalance: ${ethers.utils.formatEther(curBalance)}`);
  });

  it("Multi send ERC20 token", async function () {
    let balances: BigNumber[] = [];
    let decimals = await token.decimals();

    let amounts = [
      ethers.utils.parseUnits('1000', decimals)
      , ethers.utils.parseUnits('2000', decimals)
      , ethers.utils.parseUnits('3000', decimals)
      , ethers.utils.parseUnits('4000', decimals)
      , ethers.utils.parseUnits('5000', decimals)
      , ethers.utils.parseUnits('6000', decimals)
      , ethers.utils.parseUnits('7000', decimals)
      , ethers.utils.parseUnits('8000', decimals)
      , ethers.utils.parseUnits('9000', decimals)];

    let receivers = [
      accounts[1].address
      , accounts[2].address
      , accounts[3].address
      , accounts[4].address
      , accounts[5].address
      , accounts[6].address
      , accounts[7].address
      , accounts[8].address
      , accounts[9].address
    ]

    for await (const iterator of receivers) {
      balances.push(await (await token.balanceOf(iterator)));
    }

    let totalAmount = ethers.BigNumber.from('0');

    for (const elem of amounts) {
      totalAmount = totalAmount.add(elem);
    }

    console.log('totalAmount: ', totalAmount.toString());

    let tx = await token.approve(sender.address, totalAmount);
    await tx.wait();

    tx = await sender.batchSendERC20(token.address, receivers, amounts);
    await tx.wait();

    expect((await token.balanceOf(receivers[0])).sub(balances[0])).to.equal(amounts[0]);
    expect((await token.balanceOf(receivers[1])).sub(balances[1])).to.equal(amounts[1]);
    expect((await token.balanceOf(receivers[2])).sub(balances[2])).to.equal(amounts[2]);
    expect((await token.balanceOf(receivers[3])).sub(balances[3])).to.equal(amounts[3]);
    expect((await token.balanceOf(receivers[4])).sub(balances[4])).to.equal(amounts[4]);
    expect((await token.balanceOf(receivers[5])).sub(balances[5])).to.equal(amounts[5]);
    expect((await token.balanceOf(receivers[6])).sub(balances[6])).to.equal(amounts[6]);
    expect((await token.balanceOf(receivers[7])).sub(balances[7])).to.equal(amounts[7]);
    expect((await token.balanceOf(receivers[8])).sub(balances[8])).to.equal(amounts[8]);
  });

  it("Multi send fixed amount of ERC20 token", async function () {
    let balances: BigNumber[] = [];
    let decimals = await token.decimals();

    let fixedAmount = ethers.utils.parseUnits('9999', decimals);

    let receivers = [
      accounts[1].address
      , accounts[2].address
      , accounts[3].address
      , accounts[4].address
      , accounts[5].address
      , accounts[6].address
      , accounts[7].address
      , accounts[8].address
      , accounts[9].address
    ]

    for await (const iterator of receivers) {
      balances.push(await (await token.balanceOf(iterator)));
    }

    let totalAmount = ethers.BigNumber.from('0');

    totalAmount = ethers.BigNumber.from(receivers.length).mul(fixedAmount);

    console.log('totalAmount: ', totalAmount.toString());

    let tx = await token.approve(sender.address, totalAmount);
    await tx.wait();

    tx = await sender.batchSendFixedERC20(token.address, receivers, fixedAmount);
    await tx.wait();

    expect((await token.balanceOf(receivers[0])).sub(balances[0])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[1])).sub(balances[1])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[2])).sub(balances[2])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[3])).sub(balances[3])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[4])).sub(balances[4])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[5])).sub(balances[5])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[6])).sub(balances[6])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[7])).sub(balances[7])).to.equal(fixedAmount);
    expect((await token.balanceOf(receivers[8])).sub(balances[8])).to.equal(fixedAmount);
  });

  // });
});
