import { ethers } from "hardhat";
import { poolConfiguratorAddress, dataProviderAddress } from "../addressList"
import { poolConfiguratorABI, aaveProtocolDataProviderABI } from "../abi"
const assetAddress = "0x58A8D5B5B6D90a3A541413e4E441a093634b067b"; // Replace with the asset address

async function addAssetToEModeAndVerify() {
    const [signer] = await ethers.getSigners();

    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);

    const dataProvider = new ethers.Contract(dataProviderAddress, aaveProtocolDataProviderABI, signer);

    try {
        // Set the asset's eMode category
        const tx = await poolConfigurator.setAssetEModeCategory(assetAddress, 0);
        await tx.wait();
        console.log(`Successfully added asset ${assetAddress} to eMode category ${0}`);

        // Verify the asset's eMode category using AaveProtocolDataProvider
        const eModeConfigured = await dataProvider.getReserveEModeCategory(assetAddress);

        if (eModeConfigured === 0) {
            console.log(`Verified: Asset ${assetAddress} is now in eMode category ${0}`);
        } else {
            console.log(`Verification failed: Asset ${assetAddress} is in eMode category ${eModeConfigured}, expected ${0}`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

addAssetToEModeAndVerify()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
