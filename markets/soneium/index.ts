import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyWETH,
    strategyWBTC,
    strategyUSDC,
    strategySolvBTC,
    strategySolvBTCBBN,
    strategyASTR,
    strategySTONE,
    strategynsASTR,
    strategywstETH,
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
        "USDC.e": strategyUSDC,
        SolvBTC: strategySolvBTC,
        "SolvBTC.BBN": strategySolvBTCBBN,
        ASTR: strategyASTR,
        STONE: strategySTONE,
        nsASTR: strategynsASTR,
        wstETH: strategywstETH
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.minato]: {
            "USDC.e": "0x87307a6c8f7b66653F7Cd1C8703064D1e369E8B6",
            WBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            WETH: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807",
            SolvBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            "SolvBTC.BBN": "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            ASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            STONE: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807", //TODO
            nsASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            wstETH: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807"
        },
        [eSoneiumNetwork.soneium]: {
            "USDC.e": "0x87307a6c8f7b66653F7Cd1C8703064D1e369E8B6",
            WBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            WETH: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807",
            SolvBTC: "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            "SolvBTC.BBN": "0x7B783a093eE5Fe07E49b5bd913a1b4AD1e90B23F",
            ASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            STONE: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807", //TODO
            nsASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            wstETH: "0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807"
        },
    },
    ReserveAssets: {
        [eSoneiumNetwork.minato]: {
            WBTC: ZERO_ADDRESS,
            WETH: "0x4200000000000000000000000000000000000006",
            "USDC.e": "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391",
            SolvBTC: ZERO_ADDRESS,
            "SolvBTC.BBN": ZERO_ADDRESS,
            ASTR: "0x26e6f7c7047252DdE3dcBF26AA492e6a264Db655",
            STONE: ZERO_ADDRESS,
            nsASTR: "0xe14b432b82bA85d36c0B1F5DcD43605a1FD329CC",
            wstETH: "0x5717D6A621aA104b0b4cAd32BFe6AD3b659f269E"
        },
        [eSoneiumNetwork.soneium]: {
            WBTC: ZERO_ADDRESS,
            WETH: ZERO_ADDRESS,
            "USDC.e": ZERO_ADDRESS,
            SolvBTC: ZERO_ADDRESS,
            "SolvBTC.BBN": ZERO_ADDRESS,
            ASTR: ZERO_ADDRESS,
            STONE: ZERO_ADDRESS,
            nsASTR: ZERO_ADDRESS,
            wstETH: ZERO_ADDRESS
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC.e",],
        },
        EthEmode: {
            id: "2",
            ltv: "9000", //This should be higher than the regular WETH strategy but lower than or equal to the stablecoin E-mode.
            liquidationThreshold: "9250", //This should be slightly higher than the ltv.
            liquidationBonus: "10250", //This should be lower than the regular WETH strategy but higher than the stablecoin E-mode. 
            label: "ethereum",
            assets: ["WETH", "STONE"],
        }, BTCEmode: {
            id: "3",
            ltv: "9000",
            liquidationThreshold: "9250", //This should be slightly higher than the ltv.
            liquidationBonus: "10250", //This should be lower than the regular WETH strategy but higher than the stablecoin E-mode. 
            label: "Bitcoin",
            assets: ["WBTC", "SolvBTC", "SolvBTC.BBN"],
        }
    },
};

export default SoneiumConfig;
