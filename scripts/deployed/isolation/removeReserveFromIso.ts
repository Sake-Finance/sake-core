import { ethers } from "hardhat";
import { poolConfiguratorAddress, dataProviderAddress } from "../addressList";
import { poolConfiguratorABI, aaveProtocolDataProviderABI } from "../abi"

const assetAddress = "0x58A8D5B5B6D90a3A541413e4E441a093634b067b"; // Replace with the actual asset address

async function removeReserveFromIsolation() {
    const [signer] = await ethers.getSigners();

    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);
    const dataProvider = new ethers.Contract(dataProviderAddress, aaveProtocolDataProviderABI, signer);

    try {
        // Check if the asset is in isolation mode using getDebtCeiling()
        const debtCeiling = await dataProvider.getDebtCeiling(assetAddress);
        const isIsolated = debtCeiling.gt(0);

        console.log(`Asset isolation mode status: ${isIsolated ? "Isolated" : "Not isolated"}`);
        console.log(`Current debt ceiling: ${ethers.utils.formatUnits(debtCeiling, 18)}`);

        if (!isIsolated) {
            console.log("Asset is not in isolation mode. No action needed.");
            return;
        }

        // Remove the asset from isolation mode by setting debt ceiling to 0
        const tx = await poolConfigurator.setDebtCeiling(assetAddress, 0);
        await tx.wait();

        console.log(`Asset ${assetAddress} removed from isolation mode`);

        // Verify the new debt ceiling
        const updatedDebtCeiling = await dataProvider.getDebtCeiling(assetAddress);
        console.log(`New debt ceiling: ${ethers.utils.formatUnits(updatedDebtCeiling, 18)}`);

    } catch (error) {
        console.error("Error removing reserve from isolation:", error);
    }
}

removeReserveFromIsolation()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
