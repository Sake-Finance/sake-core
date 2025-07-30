// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {Errors} from '../libraries/helpers/Errors.sol';
import {L2Pool} from './L2Pool.sol';
import {IPoolAddressesProvider} from '../../interfaces/IPoolAddressesProvider.sol';


/**
 * @title AstarPool2
 * @author SakeFinance
 * @notice 
 */
contract AstarPool2 is L2Pool {
  
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
}
