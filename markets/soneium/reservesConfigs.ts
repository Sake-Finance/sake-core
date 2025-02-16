import { eContractid, IReserveParams } from "../../helpers/types";

import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from "../aave/rateStrategies";

export const strategyASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "100000000",
  borrowCap: "90000000",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategynsASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "50000000",
  borrowCap: "50000000",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategyWSTASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8500",
  liquidationBonus: "11000",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "50000000",
  borrowCap: "50000000",
  debtCeiling: "0",
  borrowableIsolation: false,
};