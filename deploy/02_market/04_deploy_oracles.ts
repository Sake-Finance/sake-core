import { getChainlinkOracles } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import {
  FALLBACK_ORACLE_ID,
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "../../helpers/deploy-ids";
import {
  loadPoolConfig,
  ConfigNames,
  getParamPerNetwork,
  checkRequiredEnvironment,
  getReserveAddresses,
} from "../../helpers/market-config-helpers";
import { PythAggregatorV3Deployment } from "../../typechain"
import { eNetwork, ICommonConfiguration, SymbolMap } from "../../helpers/types";
import { getPairsTokenAggregator } from "../../helpers/init-helpers";
import { parseUnits } from "ethers/lib/utils";
import { MARKET_NAME } from "../../helpers/env";

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

  const { OracleQuoteUnit } = poolConfig as ICommonConfiguration;

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const fallbackOracleAddress = ZERO_ADDRESS;

  const reserveAssets = await getReserveAddresses(poolConfig, network);
  const chainlinkAggregators = await getChainlinkOracles(poolConfig, network);

  const [assets, chainlinkSources] = getPairsTokenAggregator(
    reserveAssets,
    chainlinkAggregators
  );

  const pythFeedIds = [
    "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", // wbtc
    "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6", // weth
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", // usdc
    "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", // solvBTC
    "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", // solvBTCBBN
    "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853", //ASTR
    // "0x4dcc2fb96fb89a802ef9712f6bd2246d3607cf95ca5540cb24490d37003f8c46", //STONE
    "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6", //STONE(use weth first)
    "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853", // nsASTR
    "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6", // wstETH
    "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853", // vASTR
  ]
  // Check if pythFeedIds length matches reserveAssets length
  if (pythFeedIds.length !== Object.keys(reserveAssets).length) {
    throw new Error('Number of Pyth feed IDs does not match number of reserve assets');
  }

  const pythContract = "0x2880aB155794e7179c9eE2e38200202908C17B43" // minato 

  // Deploy PythAggregatorV3Deployment contract
  const pythAggregatorDeployment = await deploy('PythAggregatorV3Deployment', {
    from: deployer,
    args: [],
    log: true,
  });

  // Verify the deployed contract
  // try {
  //   await hre.run("verify:verify", {
  //     address: pythAggregatorDeployment.address,
  //     constructorArguments: [],
  //   });
  // } catch (error) {
  //   console.warn(`Warning: Verification failed for PythAggregatorV3Deployment at ${pythAggregatorDeployment.address}`, error);
  // }

  // Get the deployed contract instance
  const pythAggregatorDeploymentContract = await hre.ethers.getContractAt(
    'PythAggregatorV3Deployment',
    pythAggregatorDeployment.address
  ) as PythAggregatorV3Deployment;

  // Call deployAggregators function and wait for the transaction to be mined
  const tx = await pythAggregatorDeploymentContract.deployAggregators(pythContract, pythFeedIds);
  const receipt = await tx.wait();

  // Get the deployed aggregator addresses from the event logs
  const deployedEvent = receipt.events?.find(e => e.event === 'AggregatorsDeployed');

  if (!deployedEvent) {
    throw new Error('AggregatorsDeployed event not found in transaction receipt');
  }

  const pythAggregators = deployedEvent.args?.aggregators;

  if (!pythAggregators || pythAggregators.length === 0) {
    throw new Error('Failed to deploy Pyth aggregators: Empty or undefined aggregators array');
  }

  // // Verify each deployed PythAggregatorV3 contract
  // for (const aggregator of pythAggregators) {
  //   try {
  //     await hre.run("verify:verify", {
  //       address: aggregator,
  //       constructorArguments: [pythContract, pythFeedIds[pythAggregators.indexOf(aggregator)]],
  //     });
  //   } catch (error) {
  //     console.warn(`Warning: Verification failed for PythAggregatorV3 at ${aggregator}`, error);
  //   }
  // }

  console.log('Deployed Pyth aggregators:', pythAggregators);

  await deploy(ORACLE_ID, {
    from: deployer,
    args: [
      addressesProviderAddress,
      assets,
      chainlinkSources,
      pythAggregators,
      fallbackOracleAddress,
      ZERO_ADDRESS,
      parseUnits("1", OracleQuoteUnit),
    ],
    ...COMMON_DEPLOY_PARAMS,
    contract: "AaveOracle",
  });

  return true;
};

func.id = `Oracles:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "oracle"];

func.dependencies = ["before-deploy"];

func.skip = async () => checkRequiredEnvironment();

export default func;
