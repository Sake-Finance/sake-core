// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {Ownable} from "../../../../core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.sol";
import {TestnetERC20} from "./TestnetERC20.sol";
import {IERC20} from "../../../../core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IFaucet} from "./IFaucet.sol";

/**
 * @title Faucet
 * @dev Ownable Faucet Contract
 */
contract Faucet is IFaucet, Ownable {
    uint256 internal maximumMintAmount;
    uint256 internal limitDecimal;
    mapping(address => bool) internal _nonMintable;
    address[] internal assetList;

    // If _permissioned is enabled, then only owner can mint Testnet ERC20 tokens
    // If disabled, anyone can call mint at the faucet, for PoC environments
    bool internal _permissioned;

    // New mapping to track last mint/request time for each address
    mapping(address => uint256) private lastActionTime;

    // Add this state variable
    uint256 public cooldownPeriod = 1 hours;

    constructor(address owner, bool permissioned, uint256 maxMinAmount) {
        require(owner != address(0));
        transferOwnership(owner);
        _permissioned = permissioned;
        maximumMintAmount = maxMinAmount;
    }

    /**
     * @dev Function modifier, if _permissioned is enabled then msg.sender is required to be the owner
     */
    modifier onlyOwnerIfPermissioned() {
        if (_permissioned == true) {
            require(
                owner() == _msgSender(),
                "Ownable: caller is not the owner"
            );
        }
        _;
    }

    // Update the modifier
    modifier oncePerCooldownPeriod() {
        require(
            block.timestamp >= lastActionTime[msg.sender] + cooldownPeriod,
            "Error: Can only perform this action once per cooldown period"
        );
        _;
        lastActionTime[msg.sender] = block.timestamp;
    }

    /// @inheritdoc IFaucet
    function mint(
        address token,
        address to,
        uint256 amount
    )
        external
        override
        onlyOwnerIfPermissioned
        oncePerCooldownPeriod
        returns (uint256)
    {
        require(!_nonMintable[token], "Error: not mintable");
        require(
            amount <=
                maximumMintAmount *
                    (10 ** (TestnetERC20(token).decimals() - limitDecimal)),
            "Error: Mint limit transaction exceeded"
        );

        TestnetERC20(token).mint(to, amount);
        return amount;
    }

    /// @inheritdoc IFaucet
    function mintByOwner(
        address token,
        address to,
        uint256 amount
    ) external override onlyOwner returns (uint256) {
        require(!_nonMintable[token], "Error: not mintable");
        TestnetERC20(token).mint(to, amount);
        return amount;
    }

    function setPermissioned(bool permissioned) external override onlyOwner {
        _permissioned = permissioned;
    }

    /// @inheritdoc IFaucet
    function isPermissioned() external view override returns (bool) {
        return _permissioned;
    }

    /// @inheritdoc IFaucet
    function setMintable(
        address asset,
        bool active
    ) external override onlyOwner {
        _nonMintable[asset] = !active;
    }

    /// @inheritdoc IFaucet
    function isMintable(address asset) external view override returns (bool) {
        return !_nonMintable[asset];
    }

    /// @inheritdoc IFaucet
    function transferOwnershipOfChild(
        address[] calldata childContracts,
        address newOwner
    ) external override onlyOwner {
        for (uint256 i = 0; i < childContracts.length; i++) {
            Ownable(childContracts[i]).transferOwnership(newOwner);
        }
    }

    /// @inheritdoc IFaucet
    function setProtectedOfChild(
        address[] calldata childContracts,
        bool state
    ) external override onlyOwner {
        for (uint256 i = 0; i < childContracts.length; i++) {
            TestnetERC20(childContracts[i]).setProtected(state);
        }
    }

    /// @inheritdoc IFaucet
    function setMaximumMintAmount(
        uint256 newMaxMintAmount
    ) external override onlyOwner {
        maximumMintAmount = newMaxMintAmount;
    }

    /// @inheritdoc IFaucet
    function getMaximumMintAmount() external view override returns (uint256) {
        return maximumMintAmount;
    }

    /// @notice Adds a new asset to the assetList
    /// @param asset The address of the asset to add
    function addAsset(address asset) external onlyOwner {
        assetList.push(asset);
    }

    /// @notice Gets the entire assetList
    /// @return An array of asset addresses
    function getAssetList() external view returns (address[] memory) {
        return assetList;
    }

    /// @inheritdoc IFaucet
    function setLimitDecimal(
        uint256 newLimitDecimal
    ) external override onlyOwner {
        limitDecimal = newLimitDecimal;
    }

    /// @inheritdoc IFaucet
    function getLimitDecimal() external view override returns (uint256) {
        return limitDecimal;
    }

    /// @notice Requests tokens from the faucet
    /// @param asset The address of the asset to request
    /// @param amount The amount of tokens to request
    /// @return The amount of tokens transferred
    function requestTokens(
        address asset,
        uint256 amount
    ) external oncePerCooldownPeriod returns (uint256) {
        require(isAssetListed(asset), "Error: Asset not listed");
        require(
            amount <=
                maximumMintAmount *
                    (10 ** (TestnetERC20(asset).decimals() - limitDecimal)),
            "Error: Amount exceeds maximum mint amount"
        );

        uint256 balance = IERC20(asset).balanceOf(address(this));
        require(balance >= amount, "Error: Insufficient faucet balance");

        IERC20(asset).transfer(msg.sender, amount);
        return amount;
    }

    /// @notice Requests tokens from the faucet by the owner, bypassing restrictions
    /// @param asset The address of the asset to request
    /// @param to The address to receive the tokens
    /// @param amount The amount of tokens to request
    /// @return The amount of tokens transferred
    function requestTokensByOwner(
        address asset,
        address to,
        uint256 amount
    ) external onlyOwner returns (uint256) {
        require(isAssetListed(asset), "Error: Asset not listed");
        uint256 balance = IERC20(asset).balanceOf(address(this));
        require(balance >= amount, "Error: Insufficient faucet balance");

        IERC20(asset).transfer(to, amount);
        return amount;
    }

    /// @notice Checks if an asset is in the assetList
    /// @param asset The address of the asset to check
    /// @return True if the asset is in the list, false otherwise
    function isAssetListed(address asset) public view returns (bool) {
        for (uint256 i = 0; i < assetList.length; i++) {
            if (assetList[i] == asset) {
                return true;
            }
        }
        return false;
    }

    /// @notice Transfers a specified amount of an asset back to the owner
    /// @param asset The address of the asset to transfer
    /// @param amount The amount of tokens to transfer
    /// @return The amount of tokens transferred
    function transferAssetToOwner(
        address asset,
        uint256 amount
    ) external onlyOwner returns (uint256) {
        require(isAssetListed(asset), "Error: Asset not listed");
        uint256 balance = IERC20(asset).balanceOf(address(this));
        require(balance >= amount, "Error: Insufficient faucet balance");

        IERC20(asset).transfer(owner(), amount);
        return amount;
    }

    // Add this function to allow the owner to set the cooldown period
    function setCooldownPeriod(uint256 newCooldownPeriod) external onlyOwner {
        cooldownPeriod = newCooldownPeriod;
    }
}
