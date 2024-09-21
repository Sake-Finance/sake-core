// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.10;

import {IPriceOracleGetter} from "../../../core-v3/contracts/interfaces/IPriceOracleGetter.sol";
import {IPoolAddressesProvider} from "../../../core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

/**
 * @title IAaveOracleV2
 * @author Sake
 * @notice Defines the basic interface for the Aave Oracle V2
 */
interface IAaveOracleV2 is IPriceOracleGetter {
    /**
     * @dev Emitted after the base currency is set
     * @param baseCurrency The base currency of used for price quotes
     * @param baseCurrencyUnit The unit of the base currency
     */
    event BaseCurrencySet(
        address indexed baseCurrency,
        uint256 baseCurrencyUnit
    );

    /**
     * @dev Emitted after the price source of an asset is updated
     * @param asset The address of the asset
     * @param source The price source of the asset
     */
    event AssetSourceUpdated(address indexed asset, address indexed source);

    /**
     * @dev Emitted after the address of fallback oracle is updated
     * @param fallbackOracle The address of the fallback oracle
     */
    event FallbackOracleUpdated(address indexed fallbackOracle);

    /**
     * @notice Returns the PoolAddressesProvider
     * @return The address of the PoolAddressesProvider contract
     */
    function ADDRESSES_PROVIDER()
        external
        view
        returns (IPoolAddressesProvider);

    /**
     * @notice Sets or replaces Chainlink price sources of assets
     * @param assets The addresses of the assets
     * @param sources The addresses of the price sources
     */
    function setChainlinkAssetSources(
        address[] calldata assets,
        address[] calldata sources
    ) external;

    /**
     * @notice Sets or replaces Pyth price sources of assets
     * @param assets The addresses of the assets
     * @param sources The addresses of the price sources
     */
    function setPythAssetSources(
        address[] calldata assets,
        address[] calldata sources
    ) external;

    /**
     * @notice Sets the fallback oracle
     * @param fallbackOracle The address of the fallback oracle
     */
    function setFallbackOracle(address fallbackOracle) external;

    /**
     * @notice Returns a list of prices from a list of assets addresses
     * @param assets The list of assets addresses
     * @return The prices of the given assets
     */
    function getAssetsPrices(
        address[] calldata assets
    ) external view returns (uint256[] memory);

    /**
     * @notice Returns the address of the Chainlink source for an asset address
     * @param asset The address of the asset
     * @return The address of the Chainlink source
     */
    function getChainlinkSourceOfAsset(
        address asset
    ) external view returns (address);

    /**
     * @notice Returns the address of the Pyth source for an asset address
     * @param asset The address of the asset
     * @return The address of the Pyth source
     */
    function getPythSourceOfAsset(
        address asset
    ) external view returns (address);

    /**
     * @notice Returns the address of the fallback oracle
     * @return The address of the fallback oracle
     */
    function getFallbackOracle() external view returns (address);
}
