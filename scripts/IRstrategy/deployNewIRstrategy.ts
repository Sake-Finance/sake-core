// npx hardhat run scripts/IRstrategy/deployNewIRstrategy.ts --network minato
import { ethers, deployments } from "hardhat";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { rateStrategyVolatileTwo } from "../../markets/aave/rateStrategies";

async function main() {
    const { deploy } = deployments;
    const [deployer] = await ethers.getSigners();

    // Get the PoolAddressesProvider address
    const addressProviderArtifact = await deployments.get(
        POOL_ADDRESSES_PROVIDER_ID
    );

    // Deploy the new rate strategy
    const strategyData = rateStrategyVolatileTwo;
    const args = [
        addressProviderArtifact.address,
        strategyData.optimalUsageRatio,
        strategyData.baseVariableBorrowRate,
        strategyData.variableRateSlope1,
        strategyData.variableRateSlope2,
        strategyData.stableRateSlope1,
        strategyData.stableRateSlope2,
        strategyData.baseStableRateOffset,
        strategyData.stableRateExcessOffset,
        strategyData.optimalStableToTotalDebtRatio,
    ];

    await deploy(`ReserveStrategy-${strategyData.name}`, {
        from: deployer.address,
        args: args,
        contract: "DefaultReserveInterestRateStrategy",
        log: true,
    });

    console.log(`Successfully deployed new rate strategy: ${strategyData.name}`);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });