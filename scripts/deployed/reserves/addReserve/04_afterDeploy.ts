
import { waitForTx } from "../../../../helpers/utilities/tx";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
    getFaucet,
} from "../../../../helpers/contract-getters";

const asset = "0x59861C030fFCC2704dE4d293F4D3B7409026EeA2"

export async function afterDeploy(hre: HardhatRuntimeEnvironment) {

    console.log("- Enable stable borrow in selected assets");
    await hre.run("review-stable-borrow", { fix: true, vvv: true });

    console.log("- Review rate strategies");
    await hre.run("review-rate-strategies");

    console.log("- Setup Debt Ceiling");
    await hre.run("setup-debt-ceiling");

    // console.log("- Setup Borrowable assets in Isolation Mode");
    // await hre.run("setup-isolation-mode");

    // console.log("- Setup E-Modes");
    // await hre.run("setup-e-modes");

    console.log("- Setup Liquidation protocol fee");
    await hre.run("setup-liquidation-protocol-fee");

    const faucetContract = await getFaucet();

    await waitForTx(await faucetContract.addAsset(asset));

    console.log("After deploy tasks completed successfully");
}

// This allows the script to be run directly from the command line
if (require.main === module) {
    const hre = require("hardhat");
    afterDeploy(hre)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
