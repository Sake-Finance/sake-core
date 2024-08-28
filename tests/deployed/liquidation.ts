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

const contractAddress = '0xD1C1419d19A8FDff2700A085B0062C11A1944F7f';
const faucetAddress = '0x5560eC508d7Cc65889D3Acc2d7A449A071C8bE31';
const addressesProviderAddress = '0x44612500AA5D0F54C8ba6F043B4844fB49B3D362';
const collateralAsset = '0x31f37f7E861f5B7C2f71f95EC43e1580c7d62E52'; // WETH
const borrowAsset = '0x85456B37fE7cB3f0FC0F515b836A4e1e7dF74d5D';    // DAI

// Test env: need to set the price oracle to custom oracle for set new price as tester want.
describe("Liquidation Test", () => {
    let borrower: Signer;
    let liquidator: Signer;
    let contract: Contract;
    let collateralToken: Contract;
    let borrowToken: Contract;
    let faucetContract: Contract;
    let priceOracle: Contract;
    let addressesProvider: Contract;

    beforeEach(async () => {
        [borrower, liquidator] = await ethers.getSigners();
        contract = await ethers.getContractAt(poolAbi, contractAddress);
        collateralToken = await ethers.getContractAt(tokenAbi, collateralAsset);
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

        const collateralAmount = ethers.utils.parseEther('0.00001');  // 1 WETH
        const borrowAmount = ethers.utils.parseEther('5000');    // 5000 DAI

        console.log("Borrower address:", borrowerAddress);
        console.log("Liquidator address:", liquidatorAddress);
        console.log("Collateral amount:", ethers.utils.formatEther(collateralAmount), "WETH");
        console.log("Borrow amount:", ethers.utils.formatEther(borrowAmount), "DAI");

        // Withdraw all existing balance
        const { totalCollateralBase } = await contract.getUserAccountData(borrowerAddress);
        if (totalCollateralBase.gt(0)) {
            // const balance = await collateralToken.balanceOf(borrowerAddress);
            await contract.connect(borrower).withdraw(collateralAsset, ethers.constants.MaxUint256, borrowerAddress);
        }

        // Mint and supply collateral
        await faucetContract.mint(collateralAsset, borrowerAddress, collateralAmount);
        await collateralToken.connect(borrower).approve(contractAddress, MAX_UINT_AMOUNT);
        await contract.connect(borrower).supply(collateralAsset, collateralAmount, borrowerAddress, 0);
        console.log("Collateral supplied:", ethers.utils.formatEther(collateralAmount), "WETH");

        // someone(in this case, liquidator) deposits DAI into the pool
        // const liquidatorDepositAmount = ethers.utils.parseEther('10000');  // 10,000 DAI
        // await faucetContract.mint(borrowAsset, liquidatorAddress, liquidatorDepositAmount);
        // await borrowToken.connect(liquidator).approve(contractAddress, MAX_UINT_AMOUNT);
        // await contract.connect(liquidator).supply(borrowAsset, liquidatorDepositAmount, liquidatorAddress, 0);
        // console.log("Liquidator deposited:", ethers.utils.formatEther(liquidatorDepositAmount), "DAI");

        // set normal price for the collateral(weth) and borrowAsset
        const normalWethPrice = ethers.utils.parseUnits('3500', 8); // $3500 per ETH, with 8 decimals
        await priceOracle.setAssetPrice(collateralAsset, "330585000000");
        console.log("Normal WETH price set:", ethers.utils.formatUnits(normalWethPrice, 8), "USD");

        const normalDaiPrice = ethers.utils.parseUnits('1', 8); // $1 per DAI, with 8 decimals
        await priceOracle.setAssetPrice(borrowAsset, "100000000");
        console.log("Normal DAI price set:", ethers.utils.formatUnits(normalDaiPrice, 8), "USD");

        // Borrow DAI
        await contract.connect(borrower).borrow(borrowAsset, borrowAmount, 2, 0, borrowerAddress);
        console.log("Borrower borrowed:", ethers.utils.formatEther(borrowAmount), "DAI");

        // Function to check health factor
        const checkHealthFactor = async () => {
            const { healthFactor } = await contract.getUserAccountData(borrowerAddress);
            console.log("Health Factor:", ethers.utils.formatUnits(healthFactor, 18));
            return healthFactor;
        };

        // set low price for the collateral(weth)
        const lowWethPrice = ethers.utils.parseUnits('1', 8); // $1000 per ETH, with 8 decimals
        await priceOracle.setAssetPrice(collateralAsset, "3305850000");
        console.log("Low WETH price set:", ethers.utils.formatUnits(lowWethPrice, 8), "USD");

        await checkHealthFactor()

        // Prepare liquidator
        const liquidationAmount = ethers.utils.parseEther('1000');  // Liquidate 1000 DAI worth
        await faucetContract.mint(borrowAsset, liquidatorAddress, liquidationAmount);
        await borrowToken.connect(liquidator).approve(contractAddress, MAX_UINT_AMOUNT);
        console.log("Liquidator prepared with:", ethers.utils.formatEther(liquidationAmount), "DAI");

        // Perform liquidation
        console.log("Performing liquidation...");
        await contract.connect(liquidator).liquidationCall(
            collateralAsset,
            borrowAsset,
            borrowerAddress,
            liquidationAmount,
            false
        );
        console.log("Liquidation completed");

        console.log("Liquidation performed");
        await checkHealthFactor()

        // Check liquidator's collateral balance
        const liquidatorCollateral = await collateralToken.balanceOf(liquidatorAddress);
        console.log("Liquidator's collateral:", ethers.utils.formatEther(liquidatorCollateral), "WETH");

        // Set the price back
        await priceOracle.setAssetPrice(collateralAsset, normalWethPrice);
    });
});