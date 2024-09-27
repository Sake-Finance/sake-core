import { ethers } from "hardhat";

async function main() {
    console.log("Deploying MockAggregator...");

    // Get the contract factory
    const MockAggregator = await ethers.getContractFactory("MockAggregator");

    const BigNumber = ethers.BigNumber;
    const price = BigNumber.from(63000).mul(BigNumber.from(10).pow(8));
    const mockAggregator = await MockAggregator.deploy(price);

    // Wait for the contract to be deployed
    await mockAggregator.deployed();

    console.log("MockAggregator deployed to:", mockAggregator.address);
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });