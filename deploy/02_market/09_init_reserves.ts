import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  getTreasuryAddress,
  loadPoolConfig,
  savePoolTokens,
} from "../../helpers/market-config-helpers";
import { eNetwork, IAaveConfiguration } from "../../helpers/types";
import {
  configureReservesByHelper,
  initReservesByHelper,
} from "../../helpers/init-helpers";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_DATA_PROVIDER,
} from "../../helpers/deploy-ids";
import { MARKET_NAME } from "../../helpers/env";
import {
  getFaucet,
  getAaveProtocolDataProvider,
} from "../../helpers/contract-getters";
import { waitForTx } from "../../helpers/utilities/tx";
import { BigNumber } from "ethers";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const { deployer } = await getNamedAccounts();

  const poolConfig = (await loadPoolConfig(
    MARKET_NAME as ConfigNames
  )) as IAaveConfiguration;

  const addressProviderArtifact = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const {
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReservesConfig,
    RateStrategies,
  } = poolConfig;

  // Deploy Rate Strategies
  for (const strategy in RateStrategies) {
    const strategyData = RateStrategies[strategy];
    const args = [
      addressProviderArtifact.address,
      strategyData.optimalUsageRatio,
      strategyData.baseVariableBorrowRate,
      strategyData.variableRateSlope1,
      strategyData.variableRateSlope2,
      strategyData.stableRateSlope1,
      strategyData.stableRateSlope2,
      strategyData.baseStableRateOffset,
      strategyData.stableRateExcessOffset,
      strategyData.optimalStableToTotalDebtRatio,
    ];
    await deployments.deploy(`ReserveStrategy-${strategyData.name}`, {
      from: deployer,
      args: args,
      contract: "DefaultReserveInterestRateStrategy",
      log: true,
    });
  }

  // Deploy Reserves ATokens

  const treasuryAddress = await getTreasuryAddress(poolConfig, network);
  const incentivesController = await deployments.get("IncentivesProxy");
  const reservesAddresses = await getReserveAddresses(poolConfig, network);

  if (Object.keys(reservesAddresses).length == 0) {
    console.warn("[WARNING] Skipping initialization. Empty asset list.");
    return;
  }

  // OPEN IT WHEN ADD REAL TESTNET ASSET
  // reservesAddresses["USDC.e"] = "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391"

  await initReservesByHelper(
    ReservesConfig,
    reservesAddresses,
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    deployer,
    treasuryAddress,
    incentivesController.address
  );
  deployments.log(`[Deployment] Initialized all reserves`);

  await configureReservesByHelper(ReservesConfig, reservesAddresses);

  // Save AToken and Debt tokens artifacts
  const dataProvider = await deployments.get(POOL_DATA_PROVIDER);
  await savePoolTokens(reservesAddresses, dataProvider.address);
  // Get the deployed Faucet contract
  const faucetContract = await getFaucet();

  // Get reserve addresses
  const reserveAssets = await getReserveAddresses(poolConfig, network);
  const reservesConfig = poolConfig.ReservesConfig;
  const reserveSymbols = Object.keys(reservesConfig);

  console.log("reserveAssets:")
  console.log(reserveAssets)

  // Loop through all reserve assets and call setMintable
  const dataProviderInstance = await getAaveProtocolDataProvider();

  // OPEN IT WHEN ADD REAL TESTNET ASSET
  // await faucetContract.addAsset("0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391")

  // COMMENT IT WHEN ADD REAL TESTNET ASSET
  for (const symbol of reserveSymbols) {

    // DEAL WITH THE REAL WORK TESTNET TOKEN
    if (["WETH", "ASTR", "USDC.e", "nsASTR", "wstETH"].includes(symbol)) {
      console.log("no need to setup in faucet for asset " + symbol)
      continue
    }

    const assetAddress = reserveAssets[symbol];
    const decimal: number = Number(reservesConfig[symbol].reserveDecimals);
    if (assetAddress) {
      await waitForTx(
        await faucetContract.setMintable(assetAddress, true)
      );
      console.log(`Set ${symbol} (${assetAddress}) as mintable in Faucet`);

      // Mint half of the maximum mint amount to the aToken contract address
      const { aTokenAddress, variableDebtTokenAddress, stableDebtTokenAddress } =
        await dataProviderInstance.getReserveTokensAddresses(assetAddress);

      if (!aTokenAddress || aTokenAddress === ZERO_ADDRESS) {
        console.warn(`aTokenAddress for ${symbol} is not valid`);
        continue;
      }

      // const maxMintAmount = (await faucetContract.getMaximumMintAmount()).toNumber();
      // const idealMintAmount = 1000;
      // const mintAmount = BigNumber.from(idealMintAmount).mul(BigNumber.from(10).pow(decimal));
      // await waitForTx(
      //   await faucetContract.mint(assetAddress, aTokenAddress, mintAmount)
      // );
      // console.log(`Minted ${mintAmount.toString()} of ${symbol} to aToken contract`);
    } else {
      console.warn(`Address for ${symbol} not found in reserveAssets`);
    }
  }

  deployments.log(`[Deployment] Configured all reserves`);
  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ReservesInit:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-reserves"];
func.dependencies = [
  "before-deploy",
  "core",
  "periphery-pre",
  "provider",
  "init-pool",
  "oracles",
];

func.skip = async () => checkRequiredEnvironment();

export default func;
