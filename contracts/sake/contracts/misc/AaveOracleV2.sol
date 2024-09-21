// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

// import {AggregatorInterface} from '../dependencies/chainlink/AggregatorInterface.sol';
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {Errors} from "../../../core-v3/contracts/protocol/libraries/helpers/Errors.sol";
import {IACLManager} from "../../../core-v3/contracts/interfaces/IACLManager.sol";
import {IPoolAddressesProvider} from "../../../core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPriceOracleGetter} from "../../../core-v3/contracts/interfaces/IPriceOracleGetter.sol";
import {IAaveOracleV2} from "../interfaces/IAaveOracleV2.sol";

/**
 * @title AaveOracleV2
 * @author Sake
 * @notice Contract to get asset prices, manage price sources and update the fallback oracle
 * - Use of Chainlink Aggregators as first source of price, Pyth Aggregators as second source of price
 * - If the returned price by a Chainlink aggregator is <= 0, the call is forwarded to a fallback oracle, which is pyth oracle - PythAggregatorV3
 * - V1 -> V2: use AggregatorV3Interface rather then AggregatorInterface, use latestRoundData() rather then latestAnswer()
 */
contract AaveOracleV2 is IAaveOracleV2 {
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;

    // Map of asset price chainlink sources (asset => priceSource)
    mapping(address => AggregatorV3Interface) private chainlinkAssetsSources;

    // Map of asset price pyth sources (asset => priceSource)
    mapping(address => AggregatorV3Interface) private pythAssetsSources;

    IPriceOracleGetter private _fallbackOracle;
    address public immutable override BASE_CURRENCY;
    uint256 public immutable override BASE_CURRENCY_UNIT;

    /**
     * @dev Only asset listing or pool admin can call functions marked by this modifier.
     */
    modifier onlyAssetListingOrPoolAdmins() {
        _onlyAssetListingOrPoolAdmins();
        _;
    }

    /**
     * @notice Constructor
     * @param provider The address of the new PoolAddressesProvider
     * @param assets The addresses of the assets
     * @param chainlinkSources The address of the chainlink source of each asset
     * @param pythSources The address of the pyth source of each asset
     * @param fallbackOracle The address of the fallback oracle to use if the data of an
     *        aggregator is not consistent, should be pyth
     * @param baseCurrency The base currency used for the price quotes. If USD is used, base currency is 0x0
     * @param baseCurrencyUnit The unit of the base currency
     */
    constructor(
        IPoolAddressesProvider provider,
        address[] memory assets,
        address[] memory chainlinkSources,
        address[] memory pythSources,
        address fallbackOracle,
        address baseCurrency,
        uint256 baseCurrencyUnit
    ) {
        ADDRESSES_PROVIDER = provider;
        _setFallbackOracle(fallbackOracle);
        _setChainlinkAssetsSources(assets, chainlinkSources);
        _setPythAssetsSources(assets, pythSources);
        BASE_CURRENCY = baseCurrency;
        BASE_CURRENCY_UNIT = baseCurrencyUnit;
        emit BaseCurrencySet(baseCurrency, baseCurrencyUnit);
    }

    /// @inheritdoc IAaveOracleV2
    function setChainlinkAssetSources(
        address[] calldata assets,
        address[] calldata sources
    ) external override onlyAssetListingOrPoolAdmins {
        _setChainlinkAssetsSources(assets, sources);
    }

    /// @inheritdoc IAaveOracleV2
    function setPythAssetSources(
        address[] calldata assets,
        address[] calldata sources
    ) external override onlyAssetListingOrPoolAdmins {
        _setPythAssetsSources(assets, sources);
    }

    /// @inheritdoc IAaveOracleV2
    function setFallbackOracle(
        address fallbackOracle
    ) external override onlyAssetListingOrPoolAdmins {
        _setFallbackOracle(fallbackOracle);
    }

    /**
     * @notice Internal function to set the Chainlink sources for each asset
     * @param assets The addresses of the assets
     * @param sources The address of the source of each asset
     */
    function _setChainlinkAssetsSources(
        address[] memory assets,
        address[] memory sources
    ) internal {
        require(
            assets.length == sources.length,
            Errors.INCONSISTENT_PARAMS_LENGTH
        );
        for (uint256 i = 0; i < assets.length; i++) {
            chainlinkAssetsSources[assets[i]] = AggregatorV3Interface(
                sources[i]
            );
            emit AssetSourceUpdated(assets[i], sources[i]);
        }
    }

    /**
     * @notice Internal function to set the Chainlink sources for each asset
     * @param assets The addresses of the assets
     * @param sources The address of the source of each asset
     */
    function _setPythAssetsSources(
        address[] memory assets,
        address[] memory sources
    ) internal {
        require(
            assets.length == sources.length,
            Errors.INCONSISTENT_PARAMS_LENGTH
        );
        for (uint256 i = 0; i < assets.length; i++) {
            pythAssetsSources[assets[i]] = AggregatorV3Interface(sources[i]);
            emit AssetSourceUpdated(assets[i], sources[i]);
        }
    }

    /**
     * @notice Internal function to set the fallback oracle
     * @param fallbackOracle The address of the fallback oracle
     */
    function _setFallbackOracle(address fallbackOracle) internal {
        _fallbackOracle = IPriceOracleGetter(fallbackOracle);
        emit FallbackOracleUpdated(fallbackOracle);
    }

    /// @inheritdoc IPriceOracleGetter
    function getAssetPrice(
        address asset
    ) public view override returns (uint256) {
        AggregatorV3Interface chainLinkSource = chainlinkAssetsSources[asset];
        AggregatorV3Interface pythSource = pythAssetsSources[asset];

        if (asset == BASE_CURRENCY) {
            return BASE_CURRENCY_UNIT;
        } else if (
            address(chainLinkSource) == address(0) &&
            address(pythSource) == address(0)
        ) {
            return _fallbackOracle.getAssetPrice(asset);
        } else {
            (, int256 chainLinkPrice, , , ) = chainLinkSource.latestRoundData();
            (, int256 pythPrice, , , ) = pythSource.latestRoundData();

            // priority: chainlink -> pyth
            if (chainLinkPrice > 0) {
                return uint256(chainLinkPrice);
            } else if (pythPrice > 0) {
                return uint256(pythPrice);
            } else {
                return _fallbackOracle.getAssetPrice(asset);
            }
        }
    }

    /// @inheritdoc IAaveOracleV2
    function getAssetsPrices(
        address[] calldata assets
    ) external view override returns (uint256[] memory) {
        uint256[] memory prices = new uint256[](assets.length);
        for (uint256 i = 0; i < assets.length; i++) {
            prices[i] = getAssetPrice(assets[i]);
        }
        return prices;
    }

    /// @inheritdoc IAaveOracleV2
    function getChainlinkSourceOfAsset(
        address asset
    ) external view override returns (address) {
        return address(chainlinkAssetsSources[asset]);
    }

    /// @inheritdoc IAaveOracleV2
    function getPythSourceOfAsset(
        address asset
    ) external view override returns (address) {
        return address(pythAssetsSources[asset]);
    }

    /// @inheritdoc IAaveOracleV2
    function getFallbackOracle() external view returns (address) {
        return address(_fallbackOracle);
    }

    function _onlyAssetListingOrPoolAdmins() internal view {
        IACLManager aclManager = IACLManager(
            ADDRESSES_PROVIDER.getACLManager()
        );
        require(
            aclManager.isAssetListingAdmin(msg.sender) ||
                aclManager.isPoolAdmin(msg.sender),
            Errors.CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN
        );
    }
}
