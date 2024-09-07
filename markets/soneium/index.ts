import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyWETH,
    strategyWBTC,
    strategyUSDT,
    strategyUSDC,
    strategyDAI,
    strategySolvBTC,
    strategySolvBTCBBN,
    strategySolvBTCENA
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
        USDT: strategyUSDT,
        USDC: strategyUSDC,
        DAI: strategyDAI,
        SolvBTC: strategySolvBTC,
        "SolvBTC.BBN": strategySolvBTCBBN,
        "SolvBTC.ENA": strategySolvBTCENA
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.minato]: { // TODO
            DAI: "0xD1092a65338d049DB68D7Be6bD89d17a0929945e",
            USDC: "0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165",
            WBTC: "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",
            WETH: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
            USDT: "0x3ec8593F930EA45ea58c968260e6e9FF53FC934f",
            SolvBTC: "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",
            "SolvBTC.BBN": "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",
            "SolvBTC.ENA": "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",
        },
        [eSoneiumNetwork.soneium]: {
            DAI: "",
            USDC: "",
            WBTC: "",
            WETH: "",
            USDT: "",
            SolvBTC: "",
            "SolvBTC.BBN": "",
            "SolvBTC.ENA": "",
        }
    },
    ReserveAssets: {
        [eSoneiumNetwork.soneium]: {
            WBTC: ZERO_ADDRESS,
            WETH: ZERO_ADDRESS,
            USDT: ZERO_ADDRESS,
            USDC: ZERO_ADDRESS,
            DAI: ZERO_ADDRESS,
            SolvBTC: ZERO_ADDRESS,
            "SolvBTC.BBN": ZERO_ADDRESS,
            "SolvBTC.ENA": ZERO_ADDRESS,
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC", "USDT", "DAI"],
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
