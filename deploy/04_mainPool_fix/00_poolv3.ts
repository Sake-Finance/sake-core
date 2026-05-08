// npx hardhat deploy --tags mainPool-v3 --network soneium
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

const MAIN_POOL_V3_IMPL_ID = "MainPool3-Implementation";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const rateZeroer = "0x7Bdf000CA60120429CBBAaB2C5f30471C6FdE12e"; // multisig, not timelock

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const commonLibraries = await getPoolLibraries();

  // MainPool2 extends Pool (not L2Pool), so CalldataLogic is not required
  const mainPool3Artifact = await deploy(MAIN_POOL_V3_IMPL_ID, {
    contract: "MainPool3",
    from: deployer,
    args: [addressesProviderAddress, rateZeroer],
    libraries: {
      ...commonLibraries,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  // Initialize the implementation directly to prevent front-running
  if (mainPool3Artifact.newlyDeployed) {
    const mainPool3Impl = await getPool(mainPool3Artifact.address);
    await waitForTx(await mainPool3Impl.initialize(addressesProviderAddress));
    console.log("[MainPool3] Initialized implementation at", mainPool3Artifact.address);
  }

  return true;
};

func.id = "MainPool3Upgrade";
func.tags = ["mainPool-fix", "mainPool-v3"];

export default func;
