import {
  DETERMINISTIC_DEPLOYMENT,
  DETERMINISTIC_FACTORIES,
  ETHERSCAN_KEY,
  getCommonNetworkConfig,
  hardhatNetworkSettings,
  loadTasks,
} from "./helpers/hardhat-config-helpers";
import {
  eArbitrumNetwork,
  eAvalancheNetwork,
  eEthereumNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  eBaseNetwork,
  eSoneiumNetwork,
} from "./helpers/types";
import { DEFAULT_NAMED_ACCOUNTS } from "./helpers/constants";

import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-dependency-compiler";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const TASK_FOLDERS = ["misc", "market-registry"];

// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
  loadTasks(TASK_FOLDERS);
}

export default {
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
          evmVersion: "berlin",
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: { enabled: true, runs: 100_000 },
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  networks: {
    hardhat: hardhatNetworkSettings,
    localhost: {
      url: "http://127.0.0.1:8545",
      ...hardhatNetworkSettings,
    },
    minato: getCommonNetworkConfig(eSoneiumNetwork.minato, 1946),
    soneium: getCommonNetworkConfig(eSoneiumNetwork.soneium, 84532), //base sepolia
    tenderly: getCommonNetworkConfig("tenderly", 1),
    main: getCommonNetworkConfig(eEthereumNetwork.main, 1),
    kovan: getCommonNetworkConfig(eEthereumNetwork.kovan, 42),
    rinkeby: getCommonNetworkConfig(eEthereumNetwork.rinkeby, 4),
    ropsten: getCommonNetworkConfig(eEthereumNetwork.ropsten, 3),
    [ePolygonNetwork.polygon]: getCommonNetworkConfig(
      ePolygonNetwork.polygon,
      137
    ),
    [ePolygonNetwork.mumbai]: getCommonNetworkConfig(
      ePolygonNetwork.mumbai,
      80001
    ),
    arbitrum: getCommonNetworkConfig(eArbitrumNetwork.arbitrum, 42161),
    [eArbitrumNetwork.arbitrumTestnet]: getCommonNetworkConfig(
      eArbitrumNetwork.arbitrumTestnet,
      421611
    ),
    [eHarmonyNetwork.main]: getCommonNetworkConfig(
      eHarmonyNetwork.main,
      1666600000
    ),
    [eHarmonyNetwork.testnet]: getCommonNetworkConfig(
      eHarmonyNetwork.testnet,
      1666700000
    ),
    [eAvalancheNetwork.avalanche]: getCommonNetworkConfig(
      eAvalancheNetwork.avalanche,
      43114
    ),
    [eAvalancheNetwork.fuji]: getCommonNetworkConfig(
      eAvalancheNetwork.fuji,
      43113
    ),
    [eFantomNetwork.main]: getCommonNetworkConfig(eFantomNetwork.main, 250),
    [eFantomNetwork.testnet]: getCommonNetworkConfig(
      eFantomNetwork.testnet,
      4002
    ),
    [eOptimismNetwork.testnet]: getCommonNetworkConfig(
      eOptimismNetwork.testnet,
      420
    ),
    [eOptimismNetwork.main]: getCommonNetworkConfig(eOptimismNetwork.main, 10),
    [eEthereumNetwork.goerli]: getCommonNetworkConfig(
      eEthereumNetwork.goerli,
      5
    ),
    [eEthereumNetwork.sepolia]: getCommonNetworkConfig(
      eEthereumNetwork.sepolia,
      11155111
    ),
    [eArbitrumNetwork.goerliNitro]: getCommonNetworkConfig(
      eArbitrumNetwork.goerliNitro,
      421613
    ),
    [eBaseNetwork.base]: getCommonNetworkConfig(eBaseNetwork.base, 8453),
    [eBaseNetwork.baseGoerli]: getCommonNetworkConfig(
      eBaseNetwork.baseGoerli,
      84531
    ),
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  mocha: {
    timeout: 0,
  },
  dependencyCompiler: {
    paths: [
      "contracts/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol",
      "contracts/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol",
      "contracts/core-v3/contracts/misc/AaveOracle.sol",
      "contracts/core-v3/contracts/protocol/tokenization/AToken.sol",
      "contracts/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol",
      "contracts/core-v3/contracts/protocol/tokenization/StableDebtToken.sol",
      "contracts/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol",
      "contracts/core-v3/contracts/protocol/libraries/logic/CalldataLogic.sol",
      "contracts/core-v3/contracts/protocol/pool/Pool.sol",
      "contracts/core-v3/contracts/protocol/pool/L2Pool.sol",
      "contracts/core-v3/contracts/protocol/pool/PoolConfigurator.sol",
      "contracts/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol",
      "contracts/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol",
      "contracts/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol",
      "contracts/core-v3/contracts/deployments/ReservesSetupHelper.sol",
      "contracts/core-v3/contracts/misc/AaveProtocolDataProvider.sol",
      "contracts/core-v3/contracts/misc/L2Encoder.sol",
      "contracts/core-v3/contracts/protocol/configuration/ACLManager.sol",
      "contracts/core-v3/contracts/dependencies/weth/WETH9.sol",
      "contracts/core-v3/contracts/mocks/helpers/MockIncentivesController.sol",
      "contracts/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol",
      "contracts/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol",
      "contracts/core-v3/contracts/mocks/tokens/MintableERC20.sol",
      "contracts/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol",
      "contracts/core-v3/contracts/mocks/tokens/WETH9Mocked.sol",
      "contracts/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol",
      "contracts/core-v3/contracts/mocks/upgradeability/MockAToken.sol",
      "contracts/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol",
      "contracts/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol",
      "contracts/core-v3/contracts/mocks/helpers/MockPool.sol",
      "contracts/core-v3/contracts/mocks/helpers/MockL2Pool.sol",
      "contracts/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol",
      "contracts/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol",
      "contracts/core-v3/contracts/mocks/oracle/PriceOracle.sol",
      "contracts/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol",
      "contracts/periphery-v3/contracts/misc/UiPoolDataProviderV3.sol",
      "contracts/periphery-v3/contracts/misc/WalletBalanceProvider.sol",
      "contracts/periphery-v3/contracts/misc/WrappedTokenGatewayV3.sol",
      "contracts/periphery-v3/contracts/misc/interfaces/IWETH.sol",
      "contracts/periphery-v3/contracts/misc/UiIncentiveDataProviderV3.sol",
      "contracts/periphery-v3/contracts/rewards/RewardsController.sol",
      "contracts/periphery-v3/contracts/rewards/transfer-strategies/StakedTokenTransferStrategy.sol",
      "contracts/periphery-v3/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol",
      "contracts/periphery-v3/contracts/rewards/EmissionManager.sol",
      "contracts/periphery-v3/contracts/mocks/WETH9Mock.sol",
      "contracts/periphery-v3/contracts/mocks/testnet-helpers/Faucet.sol",
      "contracts/periphery-v3/contracts/mocks/testnet-helpers/TestnetERC20.sol",
      "contracts/periphery-v3/contracts/treasury/Collector.sol",
      "contracts/periphery-v3/contracts/treasury/CollectorController.sol",
      "contracts/periphery-v3/contracts/treasury/AaveEcosystemReserveV2.sol",
      "contracts/periphery-v3/contracts/treasury/AaveEcosystemReserveController.sol",
      "@aave/safety-module/contracts/stake/StakedAave.sol",
      "@aave/safety-module/contracts/stake/StakedAaveV2.sol",
      "@aave/safety-module/contracts/proposals/extend-stkaave-distribution/StakedTokenV2Rev3.sol",
    ],
  },
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT
    ? DETERMINISTIC_FACTORIES
    : undefined,
  etherscan: {
    apiKey: ETHERSCAN_KEY,
    customChains: [
      {
        network: eBaseNetwork.base,
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
      {
        network: eSoneiumNetwork.soneium,
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://api-sepolia.basescan.org/"
        },
      },
      {
        network: eSoneiumNetwork.minato,
        chainId: 1946,
        urls: {
          apiURL: "https://explorer-testnet.soneium.org/api",
          browserURL: "https://explorer-testnet.soneium.org"
        },
      }
    ],
  },
};
