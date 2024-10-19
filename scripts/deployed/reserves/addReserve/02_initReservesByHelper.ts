import { ethers, deployments } from "hardhat";
import { MARKET_NAME } from "../../../../helpers/env";
import {
    ConfigNames,
    loadPoolConfig,
    getReserveAddresses,
    getTreasuryAddress,
} from "../../../../helpers/market-config-helpers";
import { eNetwork, eContractid, IAaveConfiguration, IReserveParams } from "../../../../helpers/types";
import {
    configureReservesByHelper,
    initReservesByHelper,
} from "../../../../helpers/init-helpers";
import { waitForTx } from "../../../../helpers/utilities/tx";
import {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
} from "../../../../markets/aave/rateStrategies";

const strategy: IReserveParams = {
    strategy: rateStrategyVolatileOne,
    baseLTVAsCollateral: "6300",
    liquidationThreshold: "6750",
    liquidationBonus: "12100",
    liquidationProtocolFee: "1000",
    borrowingEnabled: true,
    stableBorrowRateEnabled: false,
    flashLoanEnabled: true,
    reserveDecimals: "18",
    aTokenImpl: eContractid.AToken,
    reserveFactor: "2000",
    supplyCap: "0",
    borrowCap: "0",
    debtCeiling: "0",
    borrowableIsolation: false,
};

const ReservesConfig = {
    PUZZLE: strategy,
}

const reservesAddress = {
    PUZZLE: "0x661DF2Af67eC84512baa089fdE7357019256C78b"
}

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        const network = (process.env.FORK ? process.env.FORK : (await ethers.provider.getNetwork()).name) as eNetwork;

        const poolConfig = (await loadPoolConfig(
            MARKET_NAME as ConfigNames
        )) as IAaveConfiguration;

        const {
            ATokenNamePrefix,
            StableDebtTokenNamePrefix,
            VariableDebtTokenNamePrefix,
            SymbolPrefix,
            // ReservesConfig,
        } = poolConfig;
        const treasuryAddress = await getTreasuryAddress(poolConfig, network);
        const incentivesController = await deployments.get("IncentivesProxy");

        await initReservesByHelper(
            ReservesConfig,
            reservesAddress,
            ATokenNamePrefix,
            StableDebtTokenNamePrefix,
            VariableDebtTokenNamePrefix,
            SymbolPrefix,
            deployer.address,
            treasuryAddress,
            incentivesController.address
        );
        console.log(`[Deployment] Initialized all reserves`);

        await configureReservesByHelper(ReservesConfig, reservesAddress);
        console.log(`[Deployment] Configured all reserves`);

    } catch (error) {
        console.error("Error in main function:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
