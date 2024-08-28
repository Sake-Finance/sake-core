import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

const poolAbi = [
    "function setEModeCategory(uint8 categoryId, uint16 ltv, uint16 liquidationThreshold, uint16 liquidationBonus, address oracle, string calldata label)",
    "function setAssetEModeCategory(address asset, uint8 newCategoryId)",
    "function getEModeCategoryData(uint8 id) view returns (tuple(uint16 ltv, uint16 liquidationThreshold, uint16 liquidationBonus, address priceSource, string label))",
    "function getConfiguration(address asset) view returns (tuple(uint256 data))",
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
    "function withdraw(address asset, uint256 amount, address to) returns (uint256)"
];

const tokenAbi = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)"
];

const faucetAbi = [
    "function mint(address token, address to, uint256 amount) returns (uint256)"
];

const protocolDataProviderAbi = [
    "function getReserveEModeCategory(address asset) view returns (uint256)"
]

const poolConfiguratorAddress = '0x53A7a027eE44f9157FCF1dBF548DC8b1Fe651dbb';
const poolAddress = '0x30CAA8bc19b341E8bCF395eA873bcD018B6e7278';
const faucetAddress = '0xA775F5915Ac4EC05b95a81331B149a0b5f44b331';
const asset = '0x1EEe4f9128B0f7fcFfE0C0BdE005a96D3a5EF4b8'; // WETH
const aaveProtocolDataProviderAddress = '0x5e1C8295Cce6bda1692D62c1E0DD431a58Ca432A';

describe("E-Mode Test", () => {
    let signer: Signer;
    let poolConfigurator: Contract;
    let pool: Contract;
    let tokenContract: Contract;
    let faucetContract: Contract;
    let aaveProtocolDataProvider: Contract;

    beforeEach(async () => {
        [signer] = await ethers.getSigners();
        poolConfigurator = await ethers.getContractAt(poolAbi, poolConfiguratorAddress);
        pool = await ethers.getContractAt(poolAbi, poolAddress);
        tokenContract = await ethers.getContractAt(tokenAbi, asset);
        faucetContract = await ethers.getContractAt(faucetAbi, faucetAddress);
        aaveProtocolDataProvider = await ethers.getContractAt(protocolDataProviderAbi, aaveProtocolDataProviderAddress);
    });
    it("should add E-Mode category, add asset to it, and remove asset from it", async () => {
        const categoryId = 3;
        const ltv = 9000; // 90%
        const liquidationThreshold = 9500; // 95%
        const liquidationBonus = 10100; // 101%
        const oracle = ethers.constants.AddressZero; // Use zero address for this test
        const label = "Test E-Mode";

        // Add E-Mode category
        await poolConfigurator.setEModeCategory(categoryId, ltv, liquidationThreshold, liquidationBonus, oracle, label);

        // Verify E-Mode category was added
        const categoryData = await pool.getEModeCategoryData(categoryId);
        expect(categoryData.ltv).to.equal(ltv);
        expect(categoryData.liquidationThreshold).to.equal(liquidationThreshold);
        expect(categoryData.liquidationBonus).to.equal(liquidationBonus);
        expect(categoryData.priceSource).to.equal(oracle);
        expect(categoryData.label).to.equal(label);

        // Add asset to E-Mode category
        await poolConfigurator.setAssetEModeCategory(asset, categoryId);

        // Check the result by calling getAssetEModeCategory
        let assetEModeCategory = await aaveProtocolDataProvider.getReserveEModeCategory(asset);
        expect(assetEModeCategory).to.equal(categoryId, "Asset should be added to E-Mode category");

        // Remove asset from E-Mode category
        await poolConfigurator.setAssetEModeCategory(asset, 0);

        // Check the result by calling getAssetEModeCategory
        assetEModeCategory = await aaveProtocolDataProvider.getReserveEModeCategory(asset);
        expect(assetEModeCategory).to.equal(0, "Asset should be removed from E-Mode category");
    });
});
