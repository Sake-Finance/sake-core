import { getReserveAddresses } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork } from "../../helpers";
import {
  loadPoolConfig,
  ConfigNames,
} from "../../helpers/market-config-helpers";
import { MARKET_NAME } from "../../helpers/env";
import { AaveOracle } from "../../typechain/contracts/sake/contracts/misc/AaveOracle"
import {
  ORACLE_ID,
} from "../../helpers/deploy-ids";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  // if (!chainlinkAggregatorProxy[network]) {
  //   console.log(
  //     '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
  //   );
  //   return;
  // }

  // Deploy UiIncentiveDataProvider getter helper
  await deploy("UiIncentiveDataProviderV3", {
    from: deployer,
  });

  if (!chainlinkAggregatorProxy[network] || chainlinkAggregatorProxy[network] == "") {
    console.log(`Missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts, use AaveOracle`)

    const reserveAssets = await getReserveAddresses(poolConfig, network);

    // Get the deployed AaveOracle contract
    const { address: oracleAddress } = await deployments.get(ORACLE_ID);
    const aaveOracle = (await hre.ethers.getContractAt(
      "AaveOracle",
      oracleAddress
    )) as AaveOracle;

    const tmpSource = await aaveOracle.getChainlinkSourceOfAsset(reserveAssets["WETH"]);

    console.log("tmp Source: " + tmpSource)

    await deploy("UiPoolDataProviderV3", {
      from: deployer,
      args: [
        tmpSource,
        tmpSource,
      ],
      ...COMMON_DEPLOY_PARAMS,
    });
  } else {
    // Deploy UiPoolDataProvider getter helper
    await deploy("UiPoolDataProviderV3", {
      from: deployer,
      args: [
        chainlinkAggregatorProxy[network],
        chainlinkEthUsdAggregatorProxy[network],
      ],
      ...COMMON_DEPLOY_PARAMS,
    });
  };
}

func.tags = ["periphery-post", "ui-helpers"];

export default func;
