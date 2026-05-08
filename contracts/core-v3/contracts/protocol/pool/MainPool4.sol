// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {Errors} from '../libraries/helpers/Errors.sol';
import {L2Pool} from './L2Pool.sol';
import {IPoolAddressesProvider} from '../../interfaces/IPoolAddressesProvider.sol';
import {DataTypes} from '../libraries/types/DataTypes.sol';
import {UserConfiguration} from '../libraries/configuration/UserConfiguration.sol';
import {IERC20} from '../../dependencies/openzeppelin/contracts/IERC20.sol';


/**
 * @title MainPool4
 * @author SakeFinance
 * @notice Extends MainPool3 with ability to set collateral flag for another user
 */
contract MainPool4 is L2Pool {
  using UserConfiguration for DataTypes.UserConfigurationMap;

  address public immutable rateZeroer;
  address public immutable collateralSetter;

  constructor(
    IPoolAddressesProvider provider,
    address zeroer,
    address _collateralSetter
  ) L2Pool(provider) {
    rateZeroer = zeroer;
    collateralSetter = _collateralSetter;
  }

  function setRateZero(address asset) external {
    // access control
    if(msg.sender != rateZeroer) revert("Unauthorized");
    // check if the reserve is listed
    if(_reserves[asset].aTokenAddress == address(0)) revert("Asset not listed");
    // zero out liquidity rate
    _reserves[asset].currentLiquidityRate = 0;
    // zero out variable borrow rate
    _reserves[asset].currentVariableBorrowRate = 0;
  }

  function setUserUseReserveAsCollateralForUser(
    address user,
    address asset,
    bool useAsCollateral
  ) external {
    if(msg.sender != collateralSetter) revert("Unauthorized");
    if(user == address(0)) revert("Invalid user");
    address aTokenAddress = _reserves[asset].aTokenAddress;
    if(aTokenAddress == address(0)) revert("Asset not listed");
    uint256 reserveId = _reserves[asset].id;
    // if the state is already what we want, do nothing
    if(useAsCollateral == _usersConfig[user].isUsingAsCollateral(reserveId)) return;
    // if enabling and user has no supply balance, do nothing
    if(useAsCollateral) {
      uint256 userBalance = IERC20(aTokenAddress).balanceOf(user);
      if(userBalance == 0) return;
    }
    _usersConfig[user].setUsingAsCollateral(reserveId, useAsCollateral);
    if(useAsCollateral) {
      emit ReserveUsedAsCollateralEnabled(asset, user);
    } else {
      emit ReserveUsedAsCollateralDisabled(asset, user);
    }
  }

  function initialize(IPoolAddressesProvider provider) external virtual override initializer {
    require(provider == ADDRESSES_PROVIDER, Errors.INVALID_ADDRESSES_PROVIDER);
  }

  function getRevision() internal pure virtual override returns (uint256) {
    return 4;
  }

  function poolRevision() public pure returns (uint256) {
    return 4;
  }

  function borrow(
    address asset,
    uint256 amount,
    uint256 interestRateMode,
    uint16 referralCode,
    address onBehalfOf
  ) public virtual override {
    revert("Borrows disabled");
  }

  function liquidationCall(
    address collateralAsset,
    address debtAsset,
    address user,
    uint256 debtToCover,
    bool receiveAToken
  ) public virtual override {
    revert("Liquidations disabled");
  }

  function flashLoan(
    address receiverAddress,
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata interestRateModes,
    address onBehalfOf,
    bytes calldata params,
    uint16 referralCode
  ) public virtual override {
    revert("Flash loans disabled");
  }

  function flashLoanSimple(
    address receiverAddress,
    address asset,
    uint256 amount,
    bytes calldata params,
    uint16 referralCode
  ) public virtual override {
    revert("Flash loans disabled");
  }
}
