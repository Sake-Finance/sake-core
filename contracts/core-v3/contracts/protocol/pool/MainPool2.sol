// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {Errors} from '../libraries/helpers/Errors.sol';
import {Pool} from './Pool.sol';
import {IPoolAddressesProvider} from '../../interfaces/IPoolAddressesProvider.sol';


/**
 * @title MainPool2
 * @author SakeFinance
 * @notice
 */
contract MainPool2 is Pool {

  address public immutable rateZeroer;
  address public immutable repairer;

  constructor(IPoolAddressesProvider provider, address zeroer, address _repairer) Pool(provider) {
    rateZeroer = zeroer;
    repairer = _repairer;
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

  function poolRevision() public pure returns (uint256) {
    return 2;
  }

  function supply(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode
  ) public virtual override {
    if(msg.sender != repairer) revert("Unauthorized");
    super.supply(asset, amount, onBehalfOf, referralCode);
  }

  function supplyWithPermit(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode,
    uint256 deadline,
    uint8 permitV,
    bytes32 permitR,
    bytes32 permitS
  ) public virtual override {
    if(msg.sender != repairer) revert("Unauthorized");
    super.supplyWithPermit(asset, amount, onBehalfOf, referralCode, deadline, permitV, permitR, permitS);
  }

  function withdraw(
    address asset,
    uint256 amount,
    address to
  ) public virtual override returns (uint256) {
    revert("Withdrawals disabled");
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

  function repay(
    address asset,
    uint256 amount,
    uint256 interestRateMode,
    address onBehalfOf
  ) public virtual override returns (uint256) {
    if(msg.sender != repairer) revert("Unauthorized");
    return super.repay(asset, amount, interestRateMode, onBehalfOf);
  }

  function repayWithPermit(
    address asset,
    uint256 amount,
    uint256 interestRateMode,
    address onBehalfOf,
    uint256 deadline,
    uint8 permitV,
    bytes32 permitR,
    bytes32 permitS
  ) public virtual override returns (uint256) {
    if(msg.sender != repairer) revert("Unauthorized");
    return super.repayWithPermit(asset, amount, interestRateMode, onBehalfOf, deadline, permitV, permitR, permitS);
  }

  function repayWithATokens(
    address asset,
    uint256 amount,
    uint256 interestRateMode
  ) public virtual override returns (uint256) {
    if(msg.sender != repairer) revert("Unauthorized");
    return super.repayWithATokens(asset, amount, interestRateMode);
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

  function deposit(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode
  ) external virtual override {
    revert("Deposits disabled");
  }
}
