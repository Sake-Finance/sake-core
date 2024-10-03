import { ethers } from "hardhat";
import { poolConfiguratorAddress, dataProviderAddress } from "../addressList";
import { poolConfiguratorABI, aaveProtocolDataProviderABI } from "../abi"

const assetAddress = "0x58A8D5B5B6D90a3A541413e4E441a093634b067b"; // Replace with the actual asset address
const newDebtCeiling = 1000000;

async function updateDebtCeiling() {
    const [signer] = await ethers.getSigners();

    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);
    const dataProvider = new ethers.Contract(dataProviderAddress, aaveProtocolDataProviderABI, signer);

    try {
        // Check if the asset is in isolation mode using getDebtCeiling()
        const debtCeiling = await dataProvider.getDebtCeiling(assetAddress);
        const isIsolated = debtCeiling.gt(0);

        console.log(`Asset isolation mode status: ${isIsolated ? "Isolated" : "Not isolated"}`);
        console.log(`Current debt ceiling: ${ethers.utils.formatUnits(debtCeiling, 18)}`);

        // Set the new debt ceiling
        const tx = await poolConfigurator.setDebtCeiling(assetAddress, newDebtCeiling);
        await tx.wait();

        console.log(`Debt ceiling updated to ${ethers.utils.formatUnits(newDebtCeiling, 18)} for asset ${assetAddress}`);

        // Verify the new debt ceiling
        const updatedDebtCeiling = await dataProvider.getDebtCeiling(assetAddress);
        console.log(`New debt ceiling: ${ethers.utils.formatUnits(updatedDebtCeiling, 18)}`);

    } catch (error) {
        console.error("Error updating debt ceiling:", error);
    }
}

updateDebtCeiling()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
