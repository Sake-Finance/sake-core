import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyWETH,
    strategyASTR,
    strategyUSDC
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
        WETH: strategyWETH,
        ASTR: strategyASTR,
        USDC: strategyUSDC,
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.soneium]: {
            WETH: "0x96b0f252dd2F8aB9C51465EA195226ba5939aa5C",
            ASTR: "0x0000000000000000000000000000000000000000",
            USDC: "0x0000000000000000000000000000000000000000"
        },
    },
    ReserveAssets: {
        [eSoneiumNetwork.soneium]: {
            WETH: "0x4200000000000000000000000000000000000006",
            ASTR: "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441",
            USDC: "0x8BEDECB512cCAD2962ce284DdE4540Aa219fa728"
        },
    },
    EModes: {
        // StableEMode: {
        //     id: "1",
        //     ltv: "9700",
        //     liquidationThreshold: "9750",
        //     liquidationBonus: "10100",
        //     label: "Stablecoins",
        //     assets: ["USDC.e",],
        // },
        // EthEmode: {
        //     id: "2",
        //     ltv: "9000", //This should be higher than the regular WETH strategy but lower than or equal to the stablecoin E-mode.
        //     liquidationThreshold: "9250", //This should be slightly higher than the ltv.
        //     liquidationBonus: "10250", //This should be lower than the regular WETH strategy but higher than the stablecoin E-mode. 
        //     label: "ethereum",
        //     assets: ["WETH", "STONE"],
        // }, BTCEmode: {
        //     id: "3",
        //     ltv: "9000",
        //     liquidationThreshold: "9250", //This should be slightly higher than the ltv.
        //     liquidationBonus: "10250", //This should be lower than the regular WETH strategy but higher than the stablecoin E-mode. 
        //     label: "Bitcoin",
        //     assets: ["WBTC", "SolvBTC", "SolvBTC.BBN"],
        // }, ASTREmode: {
        //     id: "4",
        //     ltv: "8000",
        //     liquidationThreshold: "8250",
        //     liquidationBonus: "10250",
        //     label: "ASTRcoins",
        //     assets: ["ASTR", "nsASTR", "vASTR"]
        // }
    },
};

export default SoneiumConfig;
