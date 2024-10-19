import { HardhatRuntimeEnvironment } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';

async function checkTransaction(hre: HardhatRuntimeEnvironment, txHash: string) {
    const provider = hre.ethers.provider;

    try {
        const receipt = await provider.getTransactionReceipt(txHash);

        if (receipt && receipt.status === 0) {
            console.log('Transaction failed');

            const tx = await provider.getTransaction(txHash);
            const code = await provider.call({
                to: tx.to,
                from: tx.from,
                data: tx.data,
                value: tx.value,
            }, tx.blockNumber);

            let reason = hre.ethers.utils.toUtf8String('0x' + code.slice(138));
            reason = reason.replace(/\0/g, '');

            console.log('Failure reason:', reason);

            console.log('Transaction details:');
            console.log('From:', tx.from);
            console.log('To:', tx.to);
            console.log('Value:', hre.ethers.utils.formatEther(tx.value), 'ETH');
        } else {
            console.log('Transaction succeeded or not found');
        }
    } catch (error) {
        console.error('Error checking transaction:', error);
    }
}

if (require.main === module) {
    const hre = require("hardhat");
    const txHash = '0x4d9717fe0000d8aef219f5d01f12de8b429a19686856f0d16a4a62c9064755ab';
    checkTransaction(hre, txHash)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
