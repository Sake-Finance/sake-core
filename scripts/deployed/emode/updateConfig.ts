import { ethers } from "hardhat";
import { poolConfiguratorAddress, poolAddress } from "../addressList"
import { poolABI, poolConfiguratorABI } from "../abi"

const eModeCategory = 3; // The eMode category to update
const newLTV = 8000; // The new LTV value (90% in basis points)

async function updateEModeCategoryLTV() {
    const [signer] = await ethers.getSigners();

    const pool = new ethers.Contract(poolAddress, poolABI, signer);
    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);

    try {
        // Get current eMode category data
        const currentCategoryData = await pool.getEModeCategoryData(eModeCategory);
        console.log(`Current LTV for eMode category ${eModeCategory}: ${currentCategoryData.ltv}`);

        // Update the LTV while keeping other parameters the same
        const tx = await poolConfigurator.setEModeCategory(
            eModeCategory,
            newLTV,
            currentCategoryData.liquidationThreshold,
            currentCategoryData.liquidationBonus,
            currentCategoryData.priceSource,
            currentCategoryData.label
        );
        await tx.wait();
        console.log(`Successfully updated eMode category ${eModeCategory} LTV from ${currentCategoryData.ltv} to ${newLTV}`);

        // Verify the update
        const updatedCategoryData = await pool.getEModeCategoryData(eModeCategory);
        if (updatedCategoryData.ltv === newLTV) {
            console.log(`Verified: eMode category ${eModeCategory} LTV is now ${newLTV}`);
        } else {
            console.log(`Verification failed: eMode category ${eModeCategory} LTV is ${updatedCategoryData.ltv}, expected ${newLTV}`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

updateEModeCategoryLTV()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
