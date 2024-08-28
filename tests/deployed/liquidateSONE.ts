import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { MAX_UINT_AMOUNT } from "../../helpers/constants";

const poolAbi = [
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
    "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
    "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
    "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
    "function liquidationCall(address collateralAsset, address debtAsset, address user, uint256 debtToCover, bool receiveAToken)"
];

const tokenAbi = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)"
];

const faucetAbi = [
    "function mint(address token, address to, uint256 amount) returns (uint256)"
];

const contractAddress = '0x30CAA8bc19b341E8bCF395eA873bcD018B6e7278';
const faucetAddress = '0xA775F5915Ac4EC05b95a81331B149a0b5f44b331';
const addressesProviderAddress = '0x71bd6B2cE137F96Ad532c36424776f691F2148d0';
const collateralAsset = '0x1EEe4f9128B0f7fcFfE0C0BdE005a96D3a5EF4b8'; // WETH
const collateralAsset2 = "0x3d434EE76D5d4E488D4469bCC9a01Af74BBE50C6" //WBTC
const borrowAsset = '0x97f7Cec3Ac337679814C24D6A9D6359Adee75bae';    // SONE

// Test env: need to set the price oracle to custom oracle for set new price as tester want.
describe("Liquidation Test", () => {
    let borrower: Signer;
    let liquidator: Signer;
    let contract: Contract;
    let collateralToken: Contract;
    let collateralToken2: Contract
    let borrowToken: Contract;
    let faucetContract: Contract;
    let priceOracle: Contract;
    let addressesProvider: Contract;

    beforeEach(async () => {
        [borrower, liquidator] = await ethers.getSigners();
        contract = await ethers.getContractAt(poolAbi, contractAddress);
        collateralToken = await ethers.getContractAt(tokenAbi, collateralAsset);
        collateralToken2 = await ethers.getContractAt(tokenAbi, collateralAsset2);
        borrowToken = await ethers.getContractAt(tokenAbi, borrowAsset);
        faucetContract = await ethers.getContractAt(faucetAbi, faucetAddress);

        addressesProvider = await ethers.getContractAt("IPoolAddressesProvider", addressesProviderAddress);
        const priceOracleAddress = await addressesProvider.getPriceOracle();
        priceOracle = await ethers.getContractAt("PriceOracle", priceOracleAddress);
        console.log("The oracle used for custom test:", priceOracle.address);
    });

    it("should successfully liquidate a position", async () => {
        const borrowerAddress = await borrower.getAddress();
        const liquidatorAddress = await liquidator.getAddress();

        const collateralAmount = ethers.utils.parseEther('1');  // 1 WETH
        const collateral2Amount = ethers.utils.parseUnits('1', 8);  // 1 WBTC 
        const borrowAmount = ethers.utils.parseEther('1000');
        const borrowAmount2 = ethers.utils.parseEther('5000');

        // set collateral price and SONE price
        const normalWethPrice = ethers.utils.parseUnits('3500', 8); // $3500 per ETH, with 8 decimals
        await priceOracle.setAssetPrice(collateralAsset, normalWethPrice);
        console.log("Normal WETH price set:", ethers.utils.formatUnits(normalWethPrice, 8), "USD");

        const normalWbtcPrice = ethers.utils.parseUnits('50000', 8); // $50000 per BTC, with 8 decimals
        await priceOracle.setAssetPrice(collateralAsset2, normalWbtcPrice);
        console.log("Normal WBTC price set:", ethers.utils.formatUnits(normalWbtcPrice, 8), "USD");

        const normalDaiPrice = ethers.utils.parseUnits('1', 8); // $1 per DAI, with 8 decimals
        await priceOracle.setAssetPrice(borrowAsset, "100000000");
        console.log("Normal DAI price set:", ethers.utils.formatUnits(normalDaiPrice, 8), "USD");

        // borrower mint and supply WETH into pool then borrow SONE
        await faucetContract.mint(collateralAsset, borrowerAddress, collateralAmount);
        await collateralToken.connect(borrower).approve(contractAddress, MAX_UINT_AMOUNT);
        await contract.connect(borrower).supply(collateralAsset, collateralAmount, borrowerAddress, 0);
        console.log("Collateral supplied:", ethers.utils.formatEther(collateralAmount), "WETH");
        await contract.connect(borrower).borrow(borrowAsset, borrowAmount, 2, 0, borrowerAddress);
        console.log("Borrower borrowed:", ethers.utils.formatEther(borrowAmount), "SONE");

        // liquidator mint and supply WBTC into pool then borrow SONE
        await faucetContract.mint(collateralAsset2, liquidatorAddress, collateral2Amount);
        await collateralToken2.connect(liquidator).approve(contractAddress, MAX_UINT_AMOUNT);
        await contract.connect(liquidator).supply(collateralAsset2, collateral2Amount, liquidatorAddress, 0);
        console.log("Collateral2 supplied:", ethers.utils.formatUnits(collateral2Amount, 8), "WBTC");
        await contract.connect(liquidator).borrow(borrowAsset, borrowAmount2, 2, 0, liquidatorAddress);
        console.log("Liquidator borrowed:", ethers.utils.formatEther(borrowAmount2), "SONE");
        await borrowToken.connect(liquidator).approve(contractAddress, MAX_UINT_AMOUNT);

        // WETH price go down
        const lowWethPrice = ethers.utils.parseUnits('1', 8);
        await priceOracle.setAssetPrice(collateralAsset, lowWethPrice);
        console.log("Low WETH price set:", ethers.utils.formatUnits(normalWethPrice, 8), "USD");

        // check health factor
        const { healthFactor } = await contract.getUserAccountData(borrowerAddress);
        console.log("Health Factor:", ethers.utils.formatUnits(healthFactor, 18));

        // borrower should can be liquidate
        console.log("Performing liquidation...");
        await contract.connect(liquidator).liquidationCall(
            collateralAsset,
            borrowAsset,
            borrowerAddress,
            borrowAmount,
            false
        );
        console.log("Liquidation completed");

    });
});