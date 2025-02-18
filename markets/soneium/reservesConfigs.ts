import { eContractid, IReserveParams } from "../../helpers/types";

import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from "../aave/rateStrategies";

export const strategyASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "6500",
  liquidationThreshold: "7500",
  liquidationBonus: "11200",
  liquidationProtocolFee: "2000",
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
  baseLTVAsCollateral: "6000",
  liquidationThreshold: "7000",
  liquidationBonus: "11500",
  liquidationProtocolFee: "2000",
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