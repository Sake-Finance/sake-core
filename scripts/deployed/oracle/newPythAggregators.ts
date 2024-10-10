import { ethers, deployments, run } from "hardhat";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { PythAggregatorV3Deployment } from "../../../typechain";


async function deployPythAggregators() {
    const [deployer] = await ethers.getSigners();

    const newPythFeedIds = [
        "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", //STONE
    ];

    const pythContract = "0x2880aB155794e7179c9eE2e38200202908C17B43"; // minato 

    // Deploy PythAggregatorV3Deployment contract
    const { deploy } = deployments;
    const pythAggregatorDeployment = await deploy('PythAggregatorV3Deployment', {
        from: deployer.address,
        args: [],
        ...COMMON_DEPLOY_PARAMS,
    });

    console.log(`PythAggregatorV3Deployment deployed at: ${pythAggregatorDeployment.address}`);
    // Verify PythAggregatorV3Deployment contract
    console.log("Verifying PythAggregatorV3Deployment contract...");
    try {
        await run("verify:verify", {
            address: pythAggregatorDeployment.address,
            constructorArguments: [],
        });
        console.log("PythAggregatorV3Deployment contract verified successfully");
    } catch (error) {
        console.error("Error verifying PythAggregatorV3Deployment contract:", error);
    }

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

    if (!pythAggregators || pythAggregators.length === 0) {
        throw new Error('Failed to deploy Pyth aggregators: Empty or undefined aggregators array');
    }

    console.log('Deployed Pyth aggregators:', pythAggregators);

    console.log("Verifying individual Pyth aggregators...");
    for (let i = 0; i < pythAggregators.length; i++) {
        try {
            await run("verify:verify", {
                address: pythAggregators[i],
                constructorArguments: [pythContract, newPythFeedIds[i]],
            });
            console.log(`Pyth aggregator at ${pythAggregators[i]} verified successfully`);
        } catch (error) {
            console.error(`Error verifying Pyth aggregator at ${pythAggregators[i]}:`, error);
        }
    }

    return pythAggregators;
}

deployPythAggregators()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
