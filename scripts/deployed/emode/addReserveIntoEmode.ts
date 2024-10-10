import { ethers } from "hardhat";
import { poolConfiguratorAddress, dataProviderAddress } from "../addressList"
import { poolConfiguratorABI, aaveProtocolDataProviderABI } from "../abi"
const assetAddress = "0x32B8254F669A5Fa56fD4AcfA141eD7243eb767b5"; // Replace with the asset address
const eModeCategory = 3; // Replace with the desired eMode category ID

async function addAssetToEModeAndVerify() {
    const [signer] = await ethers.getSigners();

    const poolConfigurator = new ethers.Contract(poolConfiguratorAddress, poolConfiguratorABI, signer);

    const dataProvider = new ethers.Contract(dataProviderAddress, aaveProtocolDataProviderABI, signer);

    try {
        // Set the asset's eMode category
        const tx = await poolConfigurator.setAssetEModeCategory(assetAddress, eModeCategory);
        await tx.wait();
        console.log(`Successfully added asset ${assetAddress} to eMode category ${eModeCategory}`);

        // Verify the asset's eMode category using AaveProtocolDataProvider
        const eModeConfigured = await dataProvider.getReserveEModeCategory(assetAddress);

        if (eModeConfigured == eModeCategory) {
            console.log(`Verified: Asset ${assetAddress} is now in eMode category ${eModeCategory}`);
        } else {
            console.log(`Verification failed: Asset ${assetAddress} is in eMode category ${eModeConfigured}, expected ${eModeCategory}`);
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
