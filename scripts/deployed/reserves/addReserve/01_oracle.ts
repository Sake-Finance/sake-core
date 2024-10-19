import { ethers, deployments, run } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../../../helpers/env";
import { PythAggregatorV3Deployment, AaveOracle } from "../../../../typechain";
import { ORACLE_ID, } from "../../../../helpers/deploy-ids";
import { waitForTx } from "../../../../helpers/utilities/tx";

const pythContract = "0x2880aB155794e7179c9eE2e38200202908C17B43"; // minato 
const newPythFeedIds = [
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
];
const assets = ["0x661DF2Af67eC84512baa089fdE7357019256C78b"];
const chainlinkAggregator = ["0xCA50964d2Cf6366456a607E5e1DBCE381A8BA807"]

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
