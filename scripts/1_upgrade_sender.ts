import { ethers, upgrades, network } from "hardhat";
import { green } from "colors";


async function main() {

  console.log(green(`Upgrade MultiSender contract...`));

  // const MultiSender = await ethers.getContractFactory("MultiSender");
  // const sender = await upgrades.upgradeProxy{
  //   ,
  //   MultiSender
  // }

  console.log(green(`========== ended ==========`))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
