// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {Errors} from '../libraries/helpers/Errors.sol';
import {L2Pool} from './L2Pool.sol';
import {IPoolAddressesProvider} from '../../interfaces/IPoolAddressesProvider.sol';


/**
 * @title MainPool2
 * @author SakeFinance
 * @notice
 */
contract MainPool2 is L2Pool {

  address public immutable rateZeroer;

  constructor(IPoolAddressesProvider provider, address zeroer) L2Pool(provider) {
    rateZeroer = zeroer;
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

  function initialize(IPoolAddressesProvider provider) external virtual override initializer {
    require(provider == ADDRESSES_PROVIDER, Errors.INVALID_ADDRESSES_PROVIDER);
  }

  function getRevision() internal pure virtual override returns (uint256) {
    return 2;
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
