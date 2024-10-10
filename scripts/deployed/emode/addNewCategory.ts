import { ethers } from "hardhat";
import { poolConfiguratorAddress } from "../addressList";
import { poolConfiguratorABI } from "../abi"
// New eMode category details
const newEModeCategory = {
    id: 3,
    ltv: 9000,
    liquidationThreshold: 9250,
    liquidationBonus: 10250,
    label: "Bitcoin",
    // No need to specify assets here, as they'll be added separately
};

async function addNewEModeCategory() {
    const [signer] = await ethers.getSigners();

    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);

    try {
        // Add the new eMode category
        const tx = await poolConfigurator.setEModeCategory(
            newEModeCategory.id,
            newEModeCategory.ltv,
            newEModeCategory.liquidationThreshold,
            newEModeCategory.liquidationBonus,
            ethers.constants.AddressZero, // Use zero address if no specific oracle is needed
            newEModeCategory.label
        );
        await tx.wait();
        console.log(`Successfully added new eMode category: ${newEModeCategory.label} (ID: ${newEModeCategory.id})`);

    } catch (error) {
        console.error("Error:", error);
    }
}

addNewEModeCategory()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
