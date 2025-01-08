import { eContractid, IReserveParams } from "../../helpers/types";

import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from "../aave/rateStrategies";

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "6000",
  liquidationThreshold: "6500",
  liquidationBonus: "10700",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "6",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1500",
  supplyCap: "20000",
  borrowCap: "18000",
  debtCeiling: "0",
  borrowableIsolation: true,
};

export const strategyWETH: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: "6000",
  liquidationThreshold: "6500",
  liquidationBonus: "10100",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "3000",
  supplyCap: "3",
  borrowCap: "1",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategyASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "4000",
  liquidationThreshold: "5000",
  liquidationBonus: "11500",
  liquidationProtocolFee: "2000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "170000",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};