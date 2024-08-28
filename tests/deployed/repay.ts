import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { MAX_UINT_AMOUNT } from "../../helpers/constants";

const poolAbi = [
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
    "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
    "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
    "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)"
];

const tokenAbi = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

const faucetAbi = [
    "function mint(address token, address to, uint256 amount) returns (uint256)"
];

const contractAddress = '0xD1C1419d19A8FDff2700A085B0062C11A1944F7f';
const faucetAddress = '0x5560eC508d7Cc65889D3Acc2d7A449A071C8bE31';
const collateralAsset = '0x31f37f7E861f5B7C2f71f95EC43e1580c7d62E52'; // WETH
const borrowAsset = '0x85456B37fE7cB3f0FC0F515b836A4e1e7dF74d5D';    // DAI

describe("Supply and Borrow Test", () => {
    let signer: Signer;
    let account1: Signer;
    let contract: Contract;
    let collateralToken: Contract;
    let borrowToken: Contract;
    let faucetContract: Contract;

    beforeEach(async () => {
        [signer, account1] = await ethers.getSigners();
        contract = await ethers.getContractAt(poolAbi, contractAddress);
        collateralToken = await ethers.getContractAt(tokenAbi, collateralAsset);
        borrowToken = await ethers.getContractAt(tokenAbi, borrowAsset);
        faucetContract = await ethers.getContractAt(faucetAbi, faucetAddress);
    });

    it("should successfully supply DAI and WETH, then borrow and repay DAI", async () => {
        const signerAddress = await signer.getAddress();
        const account1Address = await account1.getAddress();
        console.log("Signer address:", signerAddress);
        console.log("Account1 address:", account1Address);

        const daiAmount = ethers.utils.parseEther('100');
        const wethAmount = ethers.utils.parseEther('1');
        const borrowAmount = ethers.utils.parseEther('50');

        // Mint 100 DAI to account1
        await faucetContract.mint(borrowAsset, account1Address, daiAmount);
        console.log('100 DAI minted to account1');

        // Account1 approves the contract to spend DAI
        await borrowToken.connect(account1).approve(contractAddress, MAX_UINT_AMOUNT);
        console.log('Account1 approved contract to spend', ethers.utils.formatEther(daiAmount), 'DAI');

        // Account1 supplies 100 DAI
        await contract.connect(account1).supply(borrowAsset, daiAmount, account1Address, 0);
        console.log('Account1 supplied', ethers.utils.formatEther(daiAmount), 'DAI');

        // Mint 1 WETH to signer
        await faucetContract.mint(collateralAsset, signerAddress, wethAmount);
        console.log('1 WETH minted to signer');

        // Signer approves the contract to spend WETH
        await collateralToken.approve(contractAddress, MAX_UINT_AMOUNT);
        console.log('Signer approved contract to spend WETH');

        // Log the approved balance
        const approvedBalance = await collateralToken.allowance(signerAddress, contractAddress);
        console.log('Approved WETH balance:', ethers.utils.formatEther(approvedBalance));

        // Signer supplies 1 WETH
        await contract.supply(collateralAsset, wethAmount, signerAddress, 0);
        console.log('Signer supplied 1 WETH');

        // Check user account data before borrowing
        const accountData = await contract.getUserAccountData(signerAddress);
        console.log('User account data before borrowing:');
        console.log('Total collateral:', ethers.utils.formatEther(accountData.totalCollateralBase));
        console.log('Total debt:', ethers.utils.formatEther(accountData.totalDebtBase));
        console.log('Available borrows:', ethers.utils.formatEther(accountData.availableBorrowsBase));

        // Check initial borrowed token balance
        const initialBalance = await borrowToken.balanceOf(signerAddress);
        console.log("Initial DAI balance:", ethers.utils.formatEther(initialBalance));

        // Signer borrows 50 DAI
        const borrowTx = await contract.borrow(borrowAsset, borrowAmount, 2, 0, signerAddress);
        await borrowTx.wait();
        console.log('Signer borrowed 50 DAI');

        // Check borrowed token balance after borrowing
        const finalBalance = await borrowToken.balanceOf(signerAddress);
        console.log("Final DAI balance:", ethers.utils.formatEther(finalBalance));

        // Assert that the final balance is equal to initial balance plus borrowed amount
        expect(finalBalance).to.equal(initialBalance.add(borrowAmount));

        // Repay part
        console.log('\nRepaying the borrowed DAI');

        // Approve the contract to spend DAI for repayment
        await borrowToken.approve(contractAddress, MAX_UINT_AMOUNT);
        console.log('Approved contract to spend DAI for repayment');

        // Repay the borrowed amount
        const repayTx = await contract.repay(borrowAsset, borrowAmount, 2, signerAddress);
        await repayTx.wait();
        console.log('Repaid', ethers.utils.formatEther(borrowAmount), 'DAI');

        // Check borrowed token balance after repayment
        const balanceAfterRepay = await borrowToken.balanceOf(signerAddress);
        console.log("DAI balance after repayment:", ethers.utils.formatEther(balanceAfterRepay));

        // Check user account data after repayment
        const accountDataAfterRepay = await contract.getUserAccountData(signerAddress);
        console.log('User account data after repayment:');
        console.log('Total collateral:', ethers.utils.formatEther(accountDataAfterRepay.totalCollateralBase));
        console.log('Total debt:', ethers.utils.formatEther(accountDataAfterRepay.totalDebtBase));
        console.log('Available borrows:', ethers.utils.formatEther(accountDataAfterRepay.availableBorrowsBase));

        // Assert that the debt has been repaid
        expect(accountDataAfterRepay.totalDebtBase).to.be.closeTo(ethers.BigNumber.from(0), ethers.utils.parseEther('0.01'));
    });
});