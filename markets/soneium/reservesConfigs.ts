import { eContractid, IReserveParams } from "../../helpers/types";

import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from "../aave/rateStrategies";

// export const strategyDAI: IReserveParams = {
//   strategy: rateStrategyStableOne,
//   baseLTVAsCollateral: "6750",
//   liquidationThreshold: "7200",
//   liquidationBonus: "11550",
//   liquidationProtocolFee: "1000",
//   borrowingEnabled: true,
//   stableBorrowRateEnabled: false,
//   flashLoanEnabled: true,
//   reserveDecimals: "18",
//   aTokenImpl: eContractid.AToken,
//   reserveFactor: "1000",
//   supplyCap: "2000000000",
//   borrowCap: "0",
//   debtCeiling: "0",
//   borrowableIsolation: true,
// };

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "7200",
  liquidationThreshold: "7650",
  liquidationBonus: "11550",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "6",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: true,
};

export const strategyWETH: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "7200",
  liquidationThreshold: "7425",
  liquidationBonus: "11550",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategyWBTC: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "6300",
  liquidationThreshold: "6750",
  liquidationBonus: "12100",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "8",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "2000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

// export const strategyUSDT: IReserveParams = {
//   strategy: rateStrategyStableTwo,
//   baseLTVAsCollateral: "6750",
//   liquidationThreshold: "7200",
//   liquidationBonus: "11550",
//   liquidationProtocolFee: "1000",
//   borrowingEnabled: true,
//   stableBorrowRateEnabled: false,
//   flashLoanEnabled: true,
//   reserveDecimals: "6",
//   aTokenImpl: eContractid.AToken,
//   reserveFactor: "1000",
//   supplyCap: "2000000000",
//   borrowCap: "0",
//   debtCeiling: "500000000",
//   borrowableIsolation: true,
// };

export const strategySolvBTC: IReserveParams = {
  ...strategyWBTC,
  reserveDecimals: "18",
};

export const strategySolvBTCBBN: IReserveParams = {
  ...strategyWBTC,
  reserveDecimals: "18",
};

// export const strategySolvBTCENA: IReserveParams = {
//   ...strategyWBTC,
//   reserveDecimals: "18",
// };

export const strategyASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "7000",
  liquidationThreshold: "7500",
  liquidationBonus: "11550",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategySTONE: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "5000",
  liquidationThreshold: "5500",
  liquidationBonus: "10100",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategynsASTR: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: "6300",
  liquidationThreshold: "6800",
  liquidationBonus: "11550",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategywstETH: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "6500",
  liquidationThreshold: "6700",
  liquidationBonus: "11550",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "0",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
}

export const strategyvASTR: IReserveParams = strategynsASTR;