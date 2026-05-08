// npx hardhat deploy --tags mainPool-v4 --network soneium
import { getPool, getPoolLibraries } from "../../helpers/contract-getters";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import {
  getContract,
  getProxyImplementationBySlot,
  waitForTx,
} from "../../helpers/utilities/tx";
import { PoolAddressesProvider } from "../../typechain";

const MAIN_POOL_V4_IMPL_ID = "MainPool4-Implementation";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const rateZeroer = "0x7Bdf000CA60120429CBBAaB2C5f30471C6FdE12e"; // multisig, not timelock
  const collateralSetter = "0x7Bdf000CA60120429CBBAaB2C5f30471C6FdE12e"; // multisig, not timelock

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const commonLibraries = await getPoolLibraries();

  // MainPool2 extends Pool (not L2Pool), so CalldataLogic is not required
  const mainPool4Artifact = await deploy(MAIN_POOL_V4_IMPL_ID, {
    contract: "MainPool4",
    from: deployer,
    args: [addressesProviderAddress, rateZeroer, collateralSetter],
    libraries: {
      ...commonLibraries,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  // Initialize the implementation directly to prevent front-running
  if (mainPool4Artifact.newlyDeployed) {
    const mainPool4Impl = await getPool(mainPool4Artifact.address);
    await waitForTx(await mainPool4Impl.initialize(addressesProviderAddress));
    console.log("[MainPool4] Initialized implementation at", mainPool4Artifact.address);
  }

  return true;
};

func.id = "MainPool4Upgrade";
func.tags = ["mainPool-fix", "mainPool-v4"];

export default func;
