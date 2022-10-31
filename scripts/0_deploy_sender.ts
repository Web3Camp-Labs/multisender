import { ethers, upgrades } from "hardhat";
import { green } from "colors";
import deployed from "./deployed";


async function main() {

  const MultiSender = await ethers.getContractFactory("MultiSender");
  const sender = await upgrades.deployProxy(MultiSender, []);
  await sender.deployed();

  console.log(deployed)
  deployed.saveAddress('sender', sender.address);

  console.log(green(`Deploy MultiSender at:  ${sender.address}`));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
