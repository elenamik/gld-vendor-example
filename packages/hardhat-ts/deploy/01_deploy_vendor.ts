import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const gld = await ethers.getContract('GLD', deployer);

  await deploy('Vendor', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [gld.address],
    log: true,
  });

  const vendor = await ethers.getContract('Vendor', deployer);

  console.log('\n 🏵  Sending all 1000 tokens to the vendor...\n');
  await gld.transfer(vendor.address, ethers.utils.parseEther('1000'));

  // await vendor.transferOwnership('0x6631Dc8073B40a4fb1803F9b076E17bD27f05d9D');
};
export default func;
func.tags = ['Vendor'];
