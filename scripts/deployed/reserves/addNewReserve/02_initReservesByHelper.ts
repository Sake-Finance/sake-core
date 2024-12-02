//  npx hardhat run scripts/deployed/reserves/addNewReserve/02_initReservesByHelper.ts --network minato
import { ethers, deployments } from "hardhat";
import { MARKET_NAME } from "../../../../helpers/env";
import {
    ConfigNames,
    loadPoolConfig,
    getTreasuryAddress,
} from "../../../../helpers/market-config-helpers";
import { eNetwork, eContractid, IAaveConfiguration, IReserveParams } from "../../../../helpers/types";
import {
    configureReservesByHelper,
    initReservesByHelper,
} from "../../../../helpers/init-helpers";

import {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
} from "../../../../markets/aave/rateStrategies";

const strategy: IReserveParams = {
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

const ReservesConfig = {
    vASTR: strategy,
}

const reservesAddress = {
    vASTR: "0x5d912103bb5Be3Ad4a6cBeb374A48a02F9B5d7Df"
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
