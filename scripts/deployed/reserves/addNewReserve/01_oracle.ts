// npx hardhat run scripts/deployed/reserves/addNewReserve/01_oracle.ts --network minato 
import { ethers, deployments, run } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../../../helpers/env";
import { PythAggregatorV3Deployment, AaveOracle } from "../../../../typechain";
import { ORACLE_ID, } from "../../../../helpers/deploy-ids";
import { waitForTx } from "../../../../helpers/utilities/tx";

const pythContract = "0x2880aB155794e7179c9eE2e38200202908C17B43"; // minato 
const newPythFeedIds = [
    "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853",
];
const assets = ["0x5d912103bb5Be3Ad4a6cBeb374A48a02F9B5d7Df"];
const chainlinkAggregator = ["0x1e13086Ca715865e4d89b280e3BB6371dD48DabA"]

async function deployPythAggregators() {
    const [deployer] = await ethers.getSigners();

    // Deploy PythAggregatorV3Deployment contract
    const { deploy } = deployments;
    const pythAggregatorDeployment = await deploy('PythAggregatorV3Deployment', {
        from: deployer.address,
        args: [],
        ...COMMON_DEPLOY_PARAMS,
    });

    console.log(`PythAggregatorV3Deployment deployed at: ${pythAggregatorDeployment.address}`);

    // Get the deployed contract instance
    const pythAggregatorDeploymentContract = await ethers.getContractAt(
        'PythAggregatorV3Deployment',
        pythAggregatorDeployment.address
    ) as PythAggregatorV3Deployment;

    // Call deployAggregators function and wait for the transaction to be mined
    console.log("Deploying individual Pyth aggregators...");
    const tx = await pythAggregatorDeploymentContract.deployAggregators(pythContract, newPythFeedIds);
    const receipt = await tx.wait();

    // Get the deployed aggregator addresses from the event logs
    const deployedEvent = receipt.events?.find(e => e.event === 'AggregatorsDeployed');

    if (!deployedEvent) {
        throw new Error('AggregatorsDeployed event not found in transaction receipt');
    }

    const pythAggregators = deployedEvent.args?.aggregators;

    if (pythAggregators.length != 1) {
        throw new Error('Failed to deploy Pyth aggregators: Empty or undefined aggregators array');
    }

    // console.log("Verifying individual Pyth aggregators...");
    // for (let i = 0; i < pythAggregators.length; i++) {
    //     try {
    //         await run("verify:verify", {
    //             address: pythAggregators[i],
    //             constructorArguments: [pythContract, newPythFeedIds[i]],
    //         });
    //         console.log(`Pyth aggregator at ${pythAggregators[i]} verified successfully`);
    //     } catch (error) {
    //         console.error(`Error verifying Pyth aggregator at ${pythAggregators[i]}:`, error);
    //     }
    // }

    return pythAggregators;
}


async function getOracleInstance(): Promise<AaveOracle> {
    const [deployer] = await ethers.getSigners();
    const oracleArtifact = await deployments.get(ORACLE_ID);
    const oracleInstance = (await ethers.getContractAt(
        oracleArtifact.abi,
        oracleArtifact.address
    )).connect(deployer) as AaveOracle;

    return oracleInstance;
}

async function main() {
    try {
        const pythAggregators = await deployPythAggregators();

        console.log("Deployed Pyth Aggregators:", pythAggregators);

        const oracleInstance = await getOracleInstance();

        console.log("Oracle instance address:", oracleInstance.address);

        await waitForTx(
            await oracleInstance.setPythAssetSources(assets, pythAggregators)
        );

        await waitForTx(
            await oracleInstance.setChainlinkAssetSources(assets, chainlinkAggregator)
        );

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
