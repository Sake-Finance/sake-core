import {
  getSubTokensByPrefix,
  isIncentivesEnabled,
} from "../../helpers/market-config-helpers";
import {
  FALLBACK_ORACLE_ID,
  ORACLE_ID,
  TESTNET_REWARD_TOKEN_PREFIX,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  V3_CORE_VERSION,
} from "../../helpers/constants";
import { getContract, waitForTx } from "../../helpers/utilities/tx";
import {
  PoolAddressesProvider,
  AaveOracle__factory,
} from "../../typechain";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { getAddress } from "@ethersproject/address";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { eNetwork } from "../../helpers/types";
import Bluebird from "bluebird";
import { MARKET_NAME } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts();
  const addressesProviderArtifact = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const addressesProviderInstance = (
    await hre.ethers.getContractAt(
      addressesProviderArtifact.abi,
      addressesProviderArtifact.address
    )
  ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

  // 1. Set price oracle
  const configPriceOracle = (await deployments.get(ORACLE_ID)).address;

  // OPEN IT WHEN ADD NEW ASSET
  // const SONE = "0x526c528B914402a27bF15A5E26571d3f9f7DcC5b";
  // const soneOracle = "0x43105567c05596b5A3bf34479F88c07a694AeB72";
  // const oracleInstance = AaveOracle__factory.connect(
  //   configPriceOracle,
  //   await hre.ethers.getSigner(deployer)
  // );
  // await waitForTx(
  //   await oracleInstance.setChainlinkAssetSources([SONE], [soneOracle])
  // );

  const statePriceOracle = await addressesProviderInstance.getPriceOracle();
  if (getAddress(configPriceOracle) === getAddress(statePriceOracle)) {
    console.log("[addresses-provider] Price oracle already set. Skipping tx.");
  } else {
    await waitForTx(
      await addressesProviderInstance.setPriceOracle(configPriceOracle)
    );
    console.log(
      `[Deployment] Added PriceOracle ${configPriceOracle} to PoolAddressesProvider`
    );
  }

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `InitOracles:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "oracles"];

func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];

func.skip = async () => checkRequiredEnvironment();

export default func;
