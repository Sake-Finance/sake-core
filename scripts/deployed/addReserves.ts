import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
    // Configurator address
    const configuratorAddress = "0xF02149ddE0F290D9Dd11b0d69AE426441A16F059";
    const aTokenImpl = "0x7C7C1b2b7Fbb159BF9189aaFaaEde60E510c71Ab"
    const stableDebtTokenImpl = "0xCd5318b4CE04509a5CBfC5bF90d51Ca00115dF08"
    const variableDebtTokenImpl = "0x3708cBf234c8aE304Bc42106B451bF1817D27D07"
    const treasury = "0xF23fEbfE1585D717310B868ac003876f67b28Fbe"
    const incentivesController = "0x02FC8Df315700A4c1E347c2e5046EFB420b20462" //treasury controller

    // WBERA
    // const decimals = 18;
    // const interestRateStrategyAddress = "0x7D08748A4c10Bd508F272B4b7Cec5589412B9b45" //rateStrategies.ts
    // const underlyingAsset = "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8"
    // // refer to init-helper.ts
    // const aTokenName = "AgentFi aToken WBERA"
    // const aTokenSymbol = "aWBERA"
    // const variableDebtTokenName = "AgentFi Variable Debt WBERA"
    // const variableDebtTokenSymbol = "variableDebtWBERA"
    // const stableDebtTokenName = "AgentFi Stable Debt WBERA"
    // const stableDebtTokenSymbol = "stableDebtWBERA"

    // HONEY
    const decimals = 18;
    const interestRateStrategyAddress = "0x6316b9a641BdC26A70897d96C36ce914876f6228" // Assuming same as WBERA, update if different
    const underlyingAsset = "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03"
    // refer to init-helper.ts
    const aTokenName = "AgentFi aToken HONEY"
    const aTokenSymbol = "aHONEY"
    const variableDebtTokenName = "AgentFi Variable Debt HONEY"
    const variableDebtTokenSymbol = "variableDebtHONEY"
    const stableDebtTokenName = "AgentFi Stable Debt HONEY"
    const stableDebtTokenSymbol = "stableDebtHONEY"


    // Connect to the Configurator contract
    const configurator = await ethers.getContractAt("PoolConfigurator", configuratorAddress);

    // Define the initInputParams
    const initInputParams = [{
        aTokenImpl: aTokenImpl,
        stableDebtTokenImpl: stableDebtTokenImpl,
        variableDebtTokenImpl: variableDebtTokenImpl,
        underlyingAssetDecimals: decimals,
        interestRateStrategyAddress: interestRateStrategyAddress,
        underlyingAsset: underlyingAsset,
        treasury: treasury,
        incentivesController: incentivesController,
        aTokenName: aTokenName,
        aTokenSymbol: aTokenSymbol,
        variableDebtTokenName: variableDebtTokenName,
        variableDebtTokenSymbol: variableDebtTokenSymbol,
        stableDebtTokenName: stableDebtTokenName,
        stableDebtTokenSymbol: stableDebtTokenSymbol,
        params: "0x10",
    }];

    // Get the signer (make sure it's the assetListingAdmin)
    const [signer] = await ethers.getSigners();

    // Call initReserves function
    const tx = await configurator.connect(signer).initReserves(initInputParams);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log("Reserve added successfully");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });