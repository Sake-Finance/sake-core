import {
  isTestnetMarket,
  loadPoolConfig,
} from "./../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MARKET_NAME } from "../helpers/env";
import { getPoolConfiguratorProxy, waitForTx } from "../helpers";
import {
  getFaucet,
} from "./../helpers/contract-getters";
/**
 * The following script runs after the deployment starts
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log("=== Post deployment hook ===");
  const poolConfig = loadPoolConfig(MARKET_NAME);

  console.log("- Enable stable borrow in selected assets");
  await hre.run("review-stable-borrow", { fix: true, vvv: true });

  console.log("- Review rate strategies");
  await hre.run("review-rate-strategies");

  console.log("- Setup Debt Ceiling");
  await hre.run("setup-debt-ceiling");

  console.log("- Setup Borrowable assets in Isolation Mode");
  await hre.run("setup-isolation-mode");

  console.log("- Setup E-Modes");
  await hre.run("setup-e-modes");

  console.log("- Setup Liquidation protocol fee");
  await hre.run("setup-liquidation-protocol-fee");

  if (isTestnetMarket(poolConfig)) {
    // Disable faucet minting and borrowing of wrapped native token
    // await hre.run("disable-faucet-native-testnets");
    // console.log("- Minting and borrowing of wrapped native token disabled");

    // Unpause pool
    const poolConfigurator = await getPoolConfiguratorProxy();
    await waitForTx(await poolConfigurator.setPoolPause(false));
    console.log("- Pool unpaused and accepting deposits.");

    // Setup faucet
    const faucetContract = await getFaucet();

    const assetsToAdd = [
      '0x4200000000000000000000000000000000000006', // WETH
      '0x26e6f7c7047252DdE3dcBF26AA492e6a264Db655', // ASTR
      '0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391', // USDC.e
    ];

    for (const asset of assetsToAdd) {
      const isListed = await faucetContract.isAssetListed(asset);
      if (!isListed) {
        console.log(`Adding asset ${asset} to the faucet...`);
        await waitForTx(await faucetContract.addAsset(asset));
      } else {
        console.log(`Asset ${asset} is already listed in the faucet. Skipping...`);
      }
    }

    console.log('- Added assets to faucet');

    // Set cooldown period to 3600 seconds (1 hour)
    await waitForTx(await faucetContract.setCooldownPeriod(3600));
    console.log('- Set cooldown period to 3600 seconds');

    // Set limit decimal to 1
    await waitForTx(await faucetContract.setLimitDecimal(1));
    console.log('- Set limit decimal to 1');

    // Set maximum mint amount to 1
    await waitForTx(await faucetContract.setMaximumMintAmount(1));
    console.log('- Set maximum mint amount to 1');

    // Set permissioned to false
    await waitForTx(await faucetContract.setPermissioned(false));
    console.log('- Set permissioned to false');
  }

  if (process.env.TRANSFER_OWNERSHIP === "true") {
    await hre.run("transfer-protocol-ownership");
    await hre.run("renounce-pool-admin");
    await hre.run("view-protocol-roles");
  }

  await hre.run("print-deployments");
};

func.tags = ["after-deploy"];
func.runAtTheEnd = true;
export default func;
