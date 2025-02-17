import { eSoneiumNetwork, IAaveConfiguration } from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
    strategyASTR,
    strategynsASTR

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
    },
    ChainlinkAggregator: {
        [eSoneiumNetwork.soneium]: {
            ASTR: "0xBa5C28f78eFdC03C37e2C46880314386aFf43228",
            nsASTR:"0xBa5C28f78eFdC03C37e2C46880314386aFf43228",
        },
    },
    ReserveAssets: {
        [eSoneiumNetwork.soneium]: {
            ASTR: "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441",
            nsASTR: "0xc67476893C166c537afd9bc6bc87b3f228b44337"
        },
    },
    EModes: {
    },
};

export default SoneiumConfig;
