// npx hardhat run scripts/deployed/reserves/addNewReserve/00_deployMintableAsset.ts --network minato
import { ethers, deployments } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../../../helpers/env";
import {
    ConfigNames,
    loadPoolConfig,
} from "../../../../helpers/market-config-helpers";
import { IAaveConfiguration } from "../../../../helpers/types";
import {
    TESTNET_TOKEN_PREFIX,
} from "../../../../helpers/deploy-ids";

import { MARKET_NAME } from "../../../../helpers/env";
import {
    getFaucet,
} from "../../../../helpers/contract-getters";

const symbol = "test1"

async function main() {
    try {
        const { deploy } = deployments;
        const [deployer] = await ethers.getSigners();

        const poolConfig = (await loadPoolConfig(
            MARKET_NAME as ConfigNames
        )) as IAaveConfiguration;
        const reservesConfig = poolConfig.ReservesConfig;

        const faucetContract = await getFaucet();

        console.log("Deploy of TestnetERC20 contract", symbol);
        await deploy(`${symbol}${TESTNET_TOKEN_PREFIX}`, {
            from: deployer.address,
            contract: "TestnetERC20",
            args: [
                symbol,
                symbol,
                reservesConfig[symbol].reserveDecimals,
                faucetContract.address,
            ],
            ...COMMON_DEPLOY_PARAMS,
        });

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
