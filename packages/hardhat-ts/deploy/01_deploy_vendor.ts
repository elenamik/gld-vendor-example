import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // You might need the previously deployed yourToken:
  const gld = await ethers.getContract('GLD', deployer);

  // Todo: deploy the vendor

  await deploy('Vendor', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [gld.address],
    log: true,
  });
  console.log('DEPLOYER', deployer);

  const vendor = await ethers.getContract('Vendor', deployer);

  // Todo: transfer the tokens to the vendor
  console.log('\n 🏵  Sending all 1000 tokens to the vendor...\n');
  await gld.transfer(vendor.address, ethers.utils.parseEther('1000'));
  //
  // await vendor.transferOwnership('0x6631Dc8073B40a4fb1803F9b076E17bD27f05d9D');
  console.log('DONE');
};
export default func;
func.tags = ['Vendor'];
