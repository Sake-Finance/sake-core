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

const contractAddress = '0x30CAA8bc19b341E8bCF395eA873bcD018B6e7278';
const faucetAddress = '0xA775F5915Ac4EC05b95a81331B149a0b5f44b331';
const collateralAsset = '0x1EEe4f9128B0f7fcFfE0C0BdE005a96D3a5EF4b8'; // WETH
const borrowAsset = '0x97f7Cec3Ac337679814C24D6A9D6359Adee75bae';    // SONE

describe("Supply and Borrow and Repay Test", () => {
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

    it("should successfully supply WETH, then borrow and repay SONE", async () => {
        const signerAddress = await signer.getAddress();
        console.log("Signer address:", signerAddress);

        const wethAmount = ethers.utils.parseEther('100');
        const borrowAmount = ethers.utils.parseEther('1');

        // Mint WETH to signer
        await faucetContract.mint(collateralAsset, signerAddress, wethAmount);
        console.log('100 WETH minted to signer');

        // Signer approves the contract to spend WETH
        await collateralToken.approve(contractAddress, MAX_UINT_AMOUNT);
        console.log('Signer approved contract to spend WETH');

        // Log the approved balance
        const approvedBalance = await collateralToken.allowance(signerAddress, contractAddress);
        console.log('Approved WETH balance:', ethers.utils.formatEther(approvedBalance));

        // Signer supplies WETH
        await contract.supply(collateralAsset, wethAmount, signerAddress, 0);
        console.log('Signer supplied 100 WETH');

        // Check user account data before borrowing
        const accountData = await contract.getUserAccountData(signerAddress);
        console.log('User account data before borrowing:');
        console.log('Total collateral:', ethers.utils.formatEther(accountData.totalCollateralBase));
        console.log('Total debt:', ethers.utils.formatEther(accountData.totalDebtBase));
        console.log('Available borrows:', ethers.utils.formatEther(accountData.availableBorrowsBase));

        // Check initial borrowed token balance
        const initialBalance = await borrowToken.balanceOf(signerAddress);
        console.log("Initial SONE balance:", ethers.utils.formatEther(initialBalance));

        // Signer borrows SONE
        const borrowTx = await contract.borrow(borrowAsset, borrowAmount, 2, 0, signerAddress);
        await borrowTx.wait();
        console.log('Signer borrowed SONE');

        // Check borrowed token balance after borrowing
        const finalBalance = await borrowToken.balanceOf(signerAddress);
        console.log("Final SONE balance:", ethers.utils.formatEther(finalBalance));

        // Assert that the final balance is equal to initial balance plus borrowed amount
        expect(finalBalance).to.equal(initialBalance.add(borrowAmount));

        // Repay part
        console.log('\nRepaying the borrowed SONE');

        // Approve the contract to spend SONE for repayment
        await borrowToken.approve(contractAddress, MAX_UINT_AMOUNT);
        console.log('Approved contract to spend SONE for repayment');

        // Repay the borrowed amount
        const repayTx = await contract.repay(borrowAsset, borrowAmount, 2, signerAddress);
        await repayTx.wait();
        console.log('Repaid', ethers.utils.formatEther(borrowAmount), 'SONE');

        // Check borrowed token balance after repayment
        const balanceAfterRepay = await borrowToken.balanceOf(signerAddress);
        console.log("SONE balance after repayment:", ethers.utils.formatEther(balanceAfterRepay));

        // Check user account data after repayment
        const accountDataAfterRepay = await contract.getUserAccountData(signerAddress);
        console.log('User account data after repayment:');
        console.log('Total collateral:', ethers.utils.formatEther(accountDataAfterRepay.totalCollateralBase));
        console.log('Total debt:', ethers.utils.formatEther(accountDataAfterRepay.totalDebtBase));
        console.log('Available borrows:', ethers.utils.formatEther(accountDataAfterRepay.availableBorrowsBase));
    });
});