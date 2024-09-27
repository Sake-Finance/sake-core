import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyWETH,
    strategyWBTC,
    strategyUSDC,
    strategySolvBTC,
    strategySolvBTCBBN,
    strategyASTR,
} from "./reservesConfigs";

import { CommonsConfig } from "../aave/commons";

export const SoneiumConfig: IAaveConfiguration = {
    ...CommonsConfig,
    MarketId: "Soneium Aave Market",
    ATokenNamePrefix: "Soneium",
    WrappedNativeTokenSymbol: "WETH",
    StableDebtTokenNamePrefix: "Soneium",
    VariableDebtTokenNamePrefix: "Soneium",
    SymbolPrefix: "Soneium",
    ProviderId: 39,
    ReservesConfig: {
        WBTC: strategyWBTC,
        WETH: strategyWETH,
        USDC: strategyUSDC,
        SolvBTC: strategySolvBTC,
        SolvBTCBBN: strategySolvBTCBBN,
        ASTR: strategyASTR,
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.minato]: { // TODO
            USDC: "0x87307a6c8f7b66653F7Cd1C8703064D1e369E8B6",
            WBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            WETH: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807",
            SolvBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            SolvBTCBBN: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            ASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
        },
        [eSoneiumNetwork.soneium]: {
            USDC: "",
            WBTC: "",
            WETH: "",
            SolvBTC: "",
            SolvBTCBBN: "",
            ASTR: "",
        }
    },
    ReserveAssets: {
        [eSoneiumNetwork.soneium]: {
            WBTC: ZERO_ADDRESS,
            WETH: ZERO_ADDRESS,
            USDC: ZERO_ADDRESS,
            SolvBTC: ZERO_ADDRESS,
            SolvBTCBBN: ZERO_ADDRESS,
            ASTR: ZERO_ADDRESS,
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC",],
        },
        EthEmode: {
            id: "2",
            ltv: "9000", //This should be higher than the regular WETH strategy but lower than or equal to the stablecoin E-mode.
            liquidationThreshold: "9250", //This should be slightly higher than the ltv.
            liquidationBonus: "10250", //This should be lower than the regular WETH strategy but higher than the stablecoin E-mode. 
            label: "ethereum",
            assets: ["WETH"],
        }
    },
};

export default SoneiumConfig;
