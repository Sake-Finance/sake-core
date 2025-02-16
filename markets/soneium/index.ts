import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyASTR,
    strategynsASTR,
    strategyWSTASTR
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
        ASTR: strategyASTR,
        nsASTR: strategynsASTR,
        WSTASTR: strategyWSTASTR,
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.minato]: {
            ASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            nsASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            WSTASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
        },
        [eSoneiumNetwork.soneium]: {
            ASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            nsASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
            WSTASTR: "0x1e13086Ca715865e4d89b280e3BB6371dD48DabA",
        },
    },
    ReserveAssets: {
        [eSoneiumNetwork.minato]: {
            ASTR: "0x26e6f7c7047252DdE3dcBF26AA492e6a264Db655", // from original prod-testnet market
            nsASTR: "0xe14b432b82ba85d36c0b1f5dcd43605a1fd329cc", // from original prod-testnet market
            WSTASTR: "0x958B47458BDfbC7c32A0E1Aa3558e28D62726794",
        },
        [eSoneiumNetwork.soneium]: {
            ASTR: ZERO_ADDRESS,
            nsASTR: ZERO_ADDRESS,
            WSTASTR: ZERO_ADDRESS,
        },
    },
    EModes: {
    },
};

export default SoneiumConfig;
