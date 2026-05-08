// npx hardhat deploy --tags mainPool-v5 --network soneium
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
// import { PoolAddressesProvider } from "../../typechain";

const MAIN_POOL_V5_IMPL_ID = "MainPool5-Implementation-1";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const commonLibraries = await getPoolLibraries();

  // MainPool2 extends Pool (not L2Pool), so CalldataLogic is not required
  const mainPool5Artifact = await deploy(MAIN_POOL_V5_IMPL_ID, {
    contract: "MainPool5",
    from: deployer,
    args: [addressesProviderAddress],
    libraries: {
      ...commonLibraries,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  // Initialize the implementation directly to prevent front-running
  if (mainPool5Artifact.newlyDeployed) {
    const mainPool5Impl = await getPool(mainPool5Artifact.address);
    await waitForTx(await mainPool5Impl.initialize(addressesProviderAddress));
    console.log("[MainPool5] Initialized implementation at", mainPool5Artifact.address);
  }

  return true;
};

func.id = "MainPool5Upgrade";
func.tags = ["mainPool-fix", "mainPool-v5"];

export default func;
