import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

const configuratorABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            }
        ],
        "name": "dropReserve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
]
const poolConfiguratorAddress = '0xcBe11AfafAFA772195EE9f0C97DFc630da1a67C3';
const dai = "0x6146Ca12354B83aA875468256482A67f510f3cD3";

describe("drop reserve", () => {
    let signer: Signer;
    let poolConfigurator: Contract;

    beforeEach(async () => {
        [signer] = await ethers.getSigners();

        poolConfigurator = await ethers.getContractAt(configuratorABI, poolConfiguratorAddress);
    });
    it("drop reserve", async () => {

        // Add E-Mode category
        await poolConfigurator.dropReserve(dai);
    });
});