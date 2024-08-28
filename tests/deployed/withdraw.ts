import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

const poolAbi = [
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
    "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
    "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
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
//weth
const asset = '0xabb844792a092e972588Cb9b4Ffd029dd806f9DE';
//aweth
const aTokenAddress = '0xf5274d10B02c0dbB01e727C34390ad286af5Fef5';

describe("Deposit and Withdraw Test", () => {
    let signer: Signer;
    let contract: Contract;
    let tokenContract: Contract;
    let faucetContract: Contract;
    let aTokenContract: Contract;

    beforeEach(async () => {
        [signer] = await ethers.getSigners();
        contract = await ethers.getContractAt(poolAbi, contractAddress);
        tokenContract = await ethers.getContractAt(tokenAbi, asset);
        faucetContract = await ethers.getContractAt(faucetAbi, faucetAddress);
        aTokenContract = await ethers.getContractAt(tokenAbi, aTokenAddress);
    });

    it("should successfully withdraw tokens", async () => {
        const signerAddress = await signer.getAddress();
        console.log("Signer address:", signerAddress);

        const amount = ethers.utils.parseUnits('0.00000001', 18);
        console.log("Amount to deposit and withdraw:", ethers.utils.formatUnits(amount, 18));

        // Mint tokens to signer using Faucet
        const mintTx = await faucetContract.mint(asset, signerAddress, amount);
        await mintTx.wait();
        console.log('Mint transaction confirmed');

        // Approve the contract to spend tokens
        const approveTx = await tokenContract.approve(contractAddress, amount);
        await approveTx.wait();
        console.log('Approval confirmed');

        // Check signer's aToken balance before deposit
        const aTokenBalanceBeforeDeposit = await aTokenContract.balanceOf(signerAddress);
        console.log("Signer aToken balance before deposit:", ethers.utils.formatUnits(aTokenBalanceBeforeDeposit, 18));

        // Execute supply (deposit)
        const supplyTx = await contract.supply(asset, amount, signerAddress, 0);
        await supplyTx.wait();
        console.log('Supply transaction confirmed');

        // // Check signer's aToken balance after deposit
        // const aTokenBalanceAfterDeposit = await aTokenContract.balanceOf(signerAddress);
        // console.log("Signer aToken balance after deposit:", ethers.utils.formatUnits(aTokenBalanceAfterDeposit, 18));
        // expect(aTokenBalanceAfterDeposit).to.equal(aTokenBalanceBeforeDeposit.add(amount));

        // // Check signer's token balance before withdrawal
        // const balanceBeforeWithdraw = await tokenContract.balanceOf(signerAddress);
        // console.log("Signer token balance before withdrawal:", ethers.utils.formatUnits(balanceBeforeWithdraw, 18));

        // // Check signer's aToken balance before withdrawal
        // const aTokenBalanceBeforeWithdraw = await aTokenContract.balanceOf(signerAddress);
        // console.log("Signer aToken balance before withdrawal:", ethers.utils.formatUnits(aTokenBalanceBeforeWithdraw, 18));

        // // Execute withdraw
        // const withdrawTx = await contract.withdraw(asset, amount, signerAddress);
        // const withdrawReceipt = await withdrawTx.wait();
        // console.log('Withdraw transaction confirmed in block:', withdrawReceipt.blockNumber);

        // // Check signer's token balance after withdrawal
        // const balanceAfterWithdraw = await tokenContract.balanceOf(signerAddress);
        // console.log("Signer token balance after withdrawal:", ethers.utils.formatUnits(balanceAfterWithdraw, 18));
        // expect(balanceAfterWithdraw).to.equal(balanceBeforeWithdraw.add(amount));

        // // Check signer's aToken balance after withdrawal
        // const aTokenBalanceAfterWithdraw = await aTokenContract.balanceOf(signerAddress);
        // console.log("Signer aToken balance after withdrawal:", ethers.utils.formatUnits(aTokenBalanceAfterWithdraw, 18));
        // expect(aTokenBalanceAfterWithdraw).to.equal(aTokenBalanceBeforeWithdraw.sub(amount));
    });
});