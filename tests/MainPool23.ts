import hre from "hardhat";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { ZERO_BYTES_32 } from "../helpers";
import { parseUnits } from "ethers/lib/utils";
const BN = ethers.BigNumber;

const { AddressZero, WeiPerEther, MaxUint256, Zero } = ethers.constants;
const { formatUnits } = ethers.utils;

const MAIN_POOL_PROXY_ADDRESS = "0x3C3987A310ee13F7B8cBBe21D97D4436ba5E4B5f";
const MAIN_POOL_IMPLEMENTATION_ADDRESS = "0x7d4FFcE767430D1077333622718B5F28E23D3180";

const ADDRESS_PROVIDER_ADDRESS = "0x73a35ca19Da0357651296c40805c31585f19F741"; // also pool proxy admin
const POOL_CONFIGURATOR_ADDRESS = "0xaB9Cf2CEae8D559097e99e28E89A053c8Bca1a81";
const TIMELOCK_ADDRESS = "0xAF4c640E8e15Ff2cd7fB7645Ddd9861882cFeC28"; // also owner of address provider
const MULTISIG_ADDRESS = "0x7Bdf000CA60120429CBBAaB2C5f30471C6FdE12e";
const ZERO_IRM_ADDRESS = "0x189EBCA84598b3F68BbAe696F251C99549a5d479";

const BORROW_LOGIC       = "0x545541a451471A26d1fF29c9821D0ea97325f10E";
const BRIDGE_LOGIC       = "0x4E041B5019CeD3479A35f6C1AD29f81d1cE70109";
const EMODE_LOGIC        = "0xAa9e5105ACC5E612b0c27a17f4a671991A79D6c7";
const FLASHLOAN_LOGIC    = "0xFa5778871E17D7163202b67853661c95978BF56B";
const LIQUIDATION_LOGIC  = "0xf4a9BA6E61e29E6D5C89D9EB60a73Add6A9e7402";
const POOL_LOGIC         = "0x213b3586Dd60a5135684222c6fa610e7bc275F9b";
const SUPPLY_LOGIC       = "0x51a0D90D3E09a52de6AF2b2cD099991e127E1f2b";

const ERC20_ABI_NAME = "@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20";

const ASSETS = [
  { symbol: "WETH",       decimals: 18, address: "0x4200000000000000000000000000000000000006", aAddress: "0x4DC7c9eC156188Ea46F645E8407738C32c2B5B58", vdAddress: "0x310DDe1DB3611d78B24DC17460dd1beb15354000", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "USDC",       decimals: 6,  address: "0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369", aAddress: "0x4491B60c8fdD668FcC2C4dcADf9012b3fA71a726", vdAddress: "0xe0c2e7DDA57ae7caf8D61D5B5f3395a0928cc331", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "USDT",       decimals: 6,  address: "0x3A337a6adA9d885b6Ad95ec48F9b75f197b5AE35", aAddress: "0xe4dD5EF3c90136f72A163904d2A7E9de3771Ece7", vdAddress: "0x91872142444Dd849c6BC5e3f0Bf28600a612bC76", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "USDT0",      decimals: 6,  address: "0x102d758f688a4C1C5a80b116bD945d4455460282", aAddress: "0xC04D50506986504f992Fe4e68F98A6e23C11Bcef", vdAddress: "0x3d15Ff402140eE524981d512E079aB1354aA115B", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "ASTR",       decimals: 18, address: "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441", aAddress: "0xA0b7108f28b4449354152334E14140b7A6d2070B", vdAddress: "0xc51FcFe6e8E4B95f818d0a7b635901E7C3E03c12", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "SOLVBTC",    decimals: 18, address: "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77", aAddress: "0xE11d68AC80d6D8CCbaC28ed5D0f80bd6477BFe41", vdAddress: "0xcC388DAc15CEB26f4d668664e458F40c49Ccb2AE", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "XSOLVBTC",   decimals: 18, address: "0xCC0966D8418d412c599A6421b760a847eB169A8c", aAddress: "0xA95F849718acfFC6cE1736416aaFB4d14A998AF3", vdAddress: "0x7e1f9ba9F9Db09cD0294e5ebdC551e42a727D045", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "SOLVBTCJUP",  decimals: 18, address: "0xAffEb8576b927050f5a3B6fbA43F360D2883A118", aAddress: "0xE41959F80437496a9B2241609E6e7F3feeFA4C3A", vdAddress: "0x40b49B84bA6Aa416980A76FaEBe2F5828dB701ff", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "SSUPERUSD",  decimals: 18, address: "0x139450C2dCeF827C9A2a0Bb1CB5506260940c9fd", aAddress: "0xEB2dc4d4B64D1c2e2270C5AB57DdBa4c428f5b15", vdAddress: "0x3595987f1C30583474a4D8958294D9e0Ece962C6", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "PUFETH",     decimals: 18, address: "0x6c460b2c6D6719562D5dA43E5152B375e79B9A8B", aAddress: "0x0526CF96Ad808f8E11A5a9F1012edf67F4BAf519", vdAddress: "0x2b510b2fDF38148C7EbCa0a9B9777Fbd9AAaDAdd", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "WSTUSR",     decimals: 18, address: "0x2a52B289bA68bBd02676640aA9F605700c9e5699", aAddress: "0x55CdA22e998589add9707a83E85AE04877eA1bCf", vdAddress: "0xe67BAceBF6956cba28Ada8B54B626E0250DD9f58", contract: null as any, aContract: null as any, vdContract: null as any },
  { symbol: "SONE",       decimals: 18, address: "0xf24e57b1cb00d98C31F04f86328e22E8fcA457fb", aAddress: "0x9FE39076043D19B87247DE15095b4e9b3c7d6f61", vdAddress: "0xEC00bF784A650aC162599efe651a18b31Ce0847F", contract: null as any, aContract: null as any, vdContract: null as any },
];

let users = [ // some users to check balances
"0x78e25A7E0302319749469e37f3395340C848C32E",
"0x4acc24595C589f6790EB80909FaD67A276C06AF9",
"0x8D26F3b93bA28DAB2670af3283E1F1cF594d430a",
"0xCe8a3B66C5509E7be0f65485f95b69159DA870e4",
"0x2450686BCD03E91bD67c23624F9f8d92fD1c1222",
"0x00A5d5925eE03a251c2801a3bac66bFa3033394b",
"0xaBD892dd47D1497Fa76B77413eE3C56890bd00CC",
"0x129DdF9c3958D5ae6A5A61a40110bEB8D7ca8E7d",
"0xc521cDc630b7B72ABA9aDD22545181189ab91F78",
"0xe72555D0c3c9FaEbf34cCB9837b3027002e27730",
]

const OUTPUT_DIR = path.join(__dirname, "output");

// Types for structured data
interface AssetIndexes {
  liquidityIndex: string;
  variableBorrowIndex: string;
  currentLiquidityRate: string;
  currentVariableBorrowRate: string;
  currentStableBorrowRate: string;
  normalizedIncome: string;
  normalizedVarDebt: string;
  aTokenSupply: string;
  vdTokenSupply: string;
}

interface IndexSnapshot {
  blockNumber: number;
  blockTimestamp: string;
  snapshotDescription: string;
  assets: Record<string, AssetIndexes>;
}

interface UserAssetBalances {
  underlying: any; // BigNumber
  aToken: any;
  vdToken: any;
}

interface BalanceSnapshot {
  // users[address] -> assets[symbol] -> balances
  users: Record<string, Record<string, UserAssetBalances>>;
}

describe("MainPool23", function () {
  let signer: SignerWithAddress;
  let rateSetter: SignerWithAddress;
  //let repairer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let timelockSigner: SignerWithAddress;
  let multisigSigner: SignerWithAddress;
  let provider: any;

  let poolProxy1: any; // proxy with original L2Pool
  let poolProxy2: any; // proxy with MainPool2
  let poolProxy3: any; // proxy with MainPool3
  let poolProxy4: any; // proxy with MainPool4

  let poolImpl2: any; // MainPool2 impl
  let poolImpl3: any; // MainPool3 impl
  let poolImpl4: any; // MainPool4 impl

  let addressProvider: any;
  let poolConfigurator: any;

  let indexSnapshots: IndexSnapshot[] = [];
  let balanceSnapshots: BalanceSnapshot[] = [];

  before(async function () {
    console.log(`testing MainPool23`);

    console.log('getting signers')
    let signers = await ethers.getSigners()
    signer = signers[0]
    rateSetter = signers[1]
    //repairer = signers[2]
    user1 = signers[3]
    user2 = signers[4]
    user3 = signers[5]
    provider = signer.provider

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [TIMELOCK_ADDRESS],
    });
    timelockSigner = provider.getSigner(TIMELOCK_ADDRESS);
    await user1.sendTransaction({
      to: TIMELOCK_ADDRESS,
      value: WeiPerEther.mul(1),
      data: "0x"
    })

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [MULTISIG_ADDRESS],
    });
    multisigSigner = provider.getSigner(MULTISIG_ADDRESS);
    await user1.sendTransaction({
      to: MULTISIG_ADDRESS,
      value: WeiPerEther.mul(1),
      data: "0x"
    })

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  })
  describe("existing state", function () {
    it("get existing contracts", async function () {
      // Verify all infrastructure contracts
      await expectDeployed(MAIN_POOL_PROXY_ADDRESS);
      await expectDeployed(MAIN_POOL_IMPLEMENTATION_ADDRESS);
      await expectDeployed(ADDRESS_PROVIDER_ADDRESS);
      await expectDeployed(POOL_CONFIGURATOR_ADDRESS);
      await expectDeployed(TIMELOCK_ADDRESS);
      await expectDeployed(MULTISIG_ADDRESS);
      await expectDeployed(ZERO_IRM_ADDRESS);

      await expectDeployed(BORROW_LOGIC);
      await expectDeployed(BRIDGE_LOGIC);
      await expectDeployed(EMODE_LOGIC);
      await expectDeployed(FLASHLOAN_LOGIC);
      await expectDeployed(LIQUIDATION_LOGIC);
      await expectDeployed(POOL_LOGIC);
      await expectDeployed(SUPPLY_LOGIC);

      // Verify and instantiate all asset contracts
      for (const asset of ASSETS) {
        await expectDeployed(asset.address);
        await expectDeployed(asset.aAddress);
        await expectDeployed(asset.vdAddress);

        asset.contract = await ethers.getContractAt(ERC20_ABI_NAME, asset.address);
        asset.aContract = await ethers.getContractAt(ERC20_ABI_NAME, asset.aAddress);
        asset.vdContract = await ethers.getContractAt(ERC20_ABI_NAME, asset.vdAddress);
      }

      poolProxy1 = await ethers.getContractAt("L2Pool", MAIN_POOL_PROXY_ADDRESS);
      addressProvider = await ethers.getContractAt("PoolAddressesProvider", ADDRESS_PROVIDER_ADDRESS);
      poolConfigurator = await ethers.getContractAt("PoolConfigurator", POOL_CONFIGURATOR_ADDRESS);
    })
    it("get block number", async function () {
      var blockNumber = await provider.getBlockNumber();
      console.log(`blockNumber ${blockNumber}`);
      if(blockNumber != 20643802) {
        throw new Error(`Wrong block number. Run this test using this command:\nMARKET_NAME=soneium FORK=soneium FORK_BLOCK_NUMBER=20643800 npx hardhat test ./tests/MainPool23.ts`)
      }
    })
    it("get balances before upgrade", async function () {
      balanceSnapshots.push(await getBalances());
    })
    it("get indexes before upgrade", async function () {
      indexSnapshots.push(await getIndexes(poolProxy1, "before upgrade"));
    })
  })
  describe("MainPool2", function () {
    it("deploy MainPool2 implementation", async function () {
      let libraries = {
        "BorrowLogic": BORROW_LOGIC,
        "BridgeLogic": BRIDGE_LOGIC,
        "EModeLogic": EMODE_LOGIC,
        //"FlashLoanLogic": FLASHLOAN_LOGIC,
        //"LiquidationLogic": LIQUIDATION_LOGIC,
        "PoolLogic": POOL_LOGIC,
        "SupplyLogic": SUPPLY_LOGIC,
      }
      let poolZeroFactory = await ethers.getContractFactory("MainPool2", { libraries });
      poolImpl2 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS, rateSetter.address, MULTISIG_ADDRESS);
      await poolImpl2.deployed();
      expect(await poolImpl2.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
      expect(await poolImpl2.rateZeroer()).eq(rateSetter.address);
      expect(await poolImpl2.repairer()).eq(MULTISIG_ADDRESS);
    })
    it("can use timelock signer to upgrade implementation", async function () {
      console.log(`setting pool impl to ${poolImpl2.address}`)
      let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl2.address);
      console.log(`set pool impl`)

      poolProxy2 = await ethers.getContractAt("MainPool2", MAIN_POOL_PROXY_ADDRESS);
    })
    it("get balances after upgrade - not zeroed yet", async function () {
      balanceSnapshots.push(await getBalances());
    })
    it("get indexes after upgrade - not zeroed yet", async function () {
      indexSnapshots.push(await getIndexes(poolProxy2, "not yet zeroed"));
    })
    it("non rate setter cannot zero current interest rates", async function () {
      await expect(poolProxy2.connect(user1).setRateZero(ASSETS[4].address)).to.be.reverted
    })
    it("cannot zero current interest rates of unlisted asset", async function () {
      await expect(poolProxy2.connect(rateSetter).setRateZero(user1.address)).to.be.reverted
    })
    it("can set zero irm", async function () {
      for (const asset of ASSETS) {
        let reserveData = await poolProxy2.getReserveData(asset.address);
        let oldRateStrategyAddress = reserveData.interestRateStrategyAddress;
        console.log(`asset ${asset.symbol} oldRateStrategyAddress ${oldRateStrategyAddress}`)
        let tx = await poolConfigurator.connect(timelockSigner).setReserveInterestRateStrategyAddress(asset.address, ZERO_IRM_ADDRESS);
        await expect(tx).to.emit(poolConfigurator, "ReserveInterestRateStrategyChanged").withArgs(asset.address, oldRateStrategyAddress, ZERO_IRM_ADDRESS);
      }
    })
    it("can zero current interest rates", async function () {
      for (const asset of ASSETS) {
        await poolProxy2.connect(rateSetter).setRateZero(asset.address);
      }
    })
    it("get balances after upgrade and zeroed", async function () {
      balanceSnapshots.push(await getBalances());
    })
    it("get indexes after upgrade and zeroed", async function () {
      indexSnapshots.push(await getIndexes(poolProxy2, "after upgrade and zeroed"));
    })
    it("cannot revert to previous implementation", async function () {
      await expect(addressProvider.connect(timelockSigner).setPoolImpl(MAIN_POOL_IMPLEMENTATION_ADDRESS)).to.be.reverted;
    })
    it("many functions cannot be called", async function () {
      //console.log(poolProxy2)
      //console.log(ASSETS[0].address, 1, user2.address)
      //await poolProxy2.withdraw(ASSETS[0].address, 1, user2.address)
      await expect(poolProxy2.connect(user1).withdraw(ASSETS[0].address, 1, user2.address)).to.be.revertedWith("Withdrawals disabled")
      await expect(poolProxy2.connect(user1).borrow(ASSETS[0].address, 1, 0, 0, user2.address)).to.be.revertedWith("Borrows disabled")
      await expect(poolProxy2.connect(user1).liquidationCall(ASSETS[0].address, ASSETS[1].address, user2.address, 1, false)).to.be.revertedWith("Liquidations disabled")
      await expect(poolProxy2.connect(user1).flashLoan(user2.address, [], [], [], user3.address, "0x", 0)).to.be.revertedWith("Flash loans disabled")
      await expect(poolProxy2.connect(user1).flashLoanSimple(user2.address, ASSETS[0].address, 1, "0x", 0)).to.be.revertedWith("Flash loans disabled")
      await expect(poolProxy2.connect(user1).deposit(ASSETS[0].address, 1, user2.address, 0)).to.be.revertedWith("Deposits disabled")
    })
    it("non repairer cannot supply or repay", async function () {
      //console.log(ASSETS[0].address, 1, user2.address, 0)
      //await poolProxy2.supply(ASSETS[0].address, 1, user2.address, 0)
      await expect(poolProxy2.connect(user1).supply(ASSETS[0].address, 1, user2.address, 0)).to.be.revertedWith("Unauthorized")
      await expect(poolProxy2.connect(user1).supplyWithPermit(ASSETS[0].address, 1, user2.address, 0, MaxUint256, 1, ZERO_BYTES_32, ZERO_BYTES_32)).to.be.revertedWith("Unauthorized")
      await expect(poolProxy2.connect(user1).repay(ASSETS[0].address, 1, 0, user2.address)).to.be.revertedWith("Unauthorized")
      await expect(poolProxy2.connect(user1).repayWithPermit(ASSETS[0].address, 1, 0, user2.address, MaxUint256, 1, ZERO_BYTES_32, ZERO_BYTES_32)).to.be.revertedWith("Unauthorized")
      await expect(poolProxy2.connect(user1).repayWithATokens(ASSETS[0].address, 1, 0)).to.be.revertedWith("Unauthorized")
    })
    it("repairer cannot supply while reserve is paused", async function () {
      let WETH = ASSETS[0].contract;
      await WETH.connect(multisigSigner).approve(poolProxy2.address, MaxUint256);
      await expect(poolProxy2.connect(multisigSigner).supply(WETH.address, 1, user1.address, 0)).to.be.revertedWith('29')
    })
    it("timelock can unpause WETH", async function () {
      let tx = await poolConfigurator.connect(timelockSigner).setReservePause(ASSETS[0].address, false);
    })
    it("get more WETH", async function () {
      let WETH = ASSETS[0].contract;
      let amt = parseUnits("10")
      await user1.sendTransaction({to: WETH.address, value: amt})
      await WETH.connect(user1).transfer(MULTISIG_ADDRESS, amt);
    })
    it("repairer can supply", async function () {
      let user = "0xc38430C52ae5a0f43Bd69c3445f72f21Beb023Cf"
      let WETH = ASSETS[0].contract;
      let aWETH = ASSETS[0].aContract;
      let vdWETH = ASSETS[0].vdContract;
      let expectedBal0 = "0"
      let supplyAmount = parseUnits("3.390968487960375343", 18);
      let expectedBal1 = supplyAmount.add(expectedBal0)
      expect(await WETH.balanceOf(MULTISIG_ADDRESS)).gte(supplyAmount)
      let bal0 = await aWETH.balanceOf(user);
      expect(bal0).eq(expectedBal0)
      let tx = await poolProxy2.connect(multisigSigner).supply(WETH.address, supplyAmount, user, 0);
      await expect(tx).to.emit(WETH, "Transfer").withArgs(MULTISIG_ADDRESS, aWETH.address, supplyAmount);
      await expect(tx).to.emit(poolProxy2, "Supply").withArgs(WETH.address, MULTISIG_ADDRESS, user, supplyAmount, 0);
      let bal1 = await aWETH.balanceOf(user);
      expect(bal1).eq(expectedBal1)
    })
    it("repairer cannot repay while reserve is paused", async function () {
      let USDT0 = ASSETS[3].contract;
      await USDT0.connect(multisigSigner).approve(poolProxy2.address, MaxUint256);
      //let tx = await poolProxy2.connect(multisigSigner).repay(USDT0.address, 1, 0, user1.address);
      await expect(poolProxy2.connect(multisigSigner).repay(USDT0.address, 1, 2, user1.address)).to.be.revertedWith('29')
    })
    it("timelock can unpause USDT0", async function () {
      let tx = await poolConfigurator.connect(timelockSigner).setReservePause(ASSETS[3].address, false);
    })
    it("repairer can repay", async function () {
      let user = "0xB641F790b0Dd9D610E65Cee22c8f66060B6e98ed"
      let USDT0 = ASSETS[3].contract;
      let aUSDT0 = ASSETS[3].aContract;
      let vdUSDT0 = ASSETS[3].vdContract;
      let expectedBal0 = "571564383512"
      let bal0 = await vdUSDT0.balanceOf(user);
      expect(bal0).eq(expectedBal0)
      await USDT0.connect(multisigSigner).approve(poolProxy2.address, MaxUint256);
      expect(await USDT0.balanceOf(MULTISIG_ADDRESS)).gte(expectedBal0)
      let tx = await poolProxy2.connect(multisigSigner).repay(USDT0.address, expectedBal0, 2, user);
      await expect(tx).to.emit(USDT0, "Transfer").withArgs(MULTISIG_ADDRESS, aUSDT0.address, expectedBal0);
      await expect(tx).to.emit(poolProxy2, "Repay").withArgs(USDT0.address, user, MULTISIG_ADDRESS, expectedBal0, false);
      let bal1 = await vdUSDT0.balanceOf(user);
      expect(bal1).eq(0)
    })
    it("get balances after supply and repay", async function () {
      balanceSnapshots.push(await getBalances());
    })
    it("get indexes after supply and repay", async function () {
      indexSnapshots.push(await getIndexes(poolProxy2, "after supply and repay"));
    })
  })
  describe("MainPool3", function () {
    it("deploy MainPool3 implementation", async function () {
      let libraries = {
        "BorrowLogic": BORROW_LOGIC,
        "BridgeLogic": BRIDGE_LOGIC,
        "EModeLogic": EMODE_LOGIC,
        //"FlashLoanLogic": FLASHLOAN_LOGIC,
        //"LiquidationLogic": LIQUIDATION_LOGIC,
        "PoolLogic": POOL_LOGIC,
        "SupplyLogic": SUPPLY_LOGIC,
      }
      let poolZeroFactory = await ethers.getContractFactory("MainPool3", { libraries });
      poolImpl3 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS, rateSetter.address);
      await poolImpl3.deployed();
      expect(await poolImpl3.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
    })
    it("can use timelock signer to upgrade to implementation 3", async function () {
      let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl3.address);
      poolProxy3 = await ethers.getContractAt("MainPool3", MAIN_POOL_PROXY_ADDRESS);
    })
    /*
    it("get pool interface", async function () {
      //console.log(poolProxy3)
      'ADDRESSES_PROVIDER()': [Function (anonymous)],
      'BRIDGE_PROTOCOL_FEE()': [Function (anonymous)],
      'FLASHLOAN_PREMIUM_TOTAL()': [Function (anonymous)],
      'FLASHLOAN_PREMIUM_TO_PROTOCOL()': [Function (anonymous)],
      'MAX_NUMBER_RESERVES()': [Function (anonymous)],
      'MAX_STABLE_RATE_BORROW_SIZE_PERCENT()': [Function (anonymous)],
      'POOL_REVISION()': [Function (anonymous)],
      'backUnbacked(address,uint256,uint256)': [Function (anonymous)],
      'borrow(address,uint256,uint256,uint16,address)': [Function (anonymous)],
      'borrow(bytes32)': [Function (anonymous)],
      'configureEModeCategory(uint8,(uint16,uint16,uint16,address,string))': [Function (anonymous)],
      'deposit(address,uint256,address,uint16)': [Function (anonymous)],
      'dropReserve(address)': [Function (anonymous)],
      'finalizeTransfer(address,address,address,uint256,uint256,uint256)': [Function (anonymous)],
      'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)': [Function (anonymous)],
      'flashLoanSimple(address,address,uint256,bytes,uint16)': [Function (anonymous)],
      'getConfiguration(address)': [Function (anonymous)],
      'getEModeCategoryData(uint8)': [Function (anonymous)],
      'getReserveAddressById(uint16)': [Function (anonymous)],
      'getReserveData(address)': [Function (anonymous)],
      'getReserveNormalizedIncome(address)': [Function (anonymous)],
      'getReserveNormalizedVariableDebt(address)': [Function (anonymous)],
      'getReservesList()': [Function (anonymous)],
      'getUserAccountData(address)': [Function (anonymous)],
      'getUserConfiguration(address)': [Function (anonymous)],
      'getUserEMode(address)': [Function (anonymous)],
      'initReserve(address,address,address,address,address)': [Function (anonymous)],
      'initialize(address)': [Function (anonymous)],
      'liquidationCall(address,address,address,uint256,bool)': [Function (anonymous)],
      'liquidationCall(bytes32,bytes32)': [Function (anonymous)],
      'mintToTreasury(address[])': [Function (anonymous)],
      'mintUnbacked(address,uint256,address,uint16)': [Function (anonymous)],
      'rateZeroer()': [Function (anonymous)],
      'rebalanceStableBorrowRate(bytes32)': [Function (anonymous)],
      'rebalanceStableBorrowRate(address,address)': [Function (anonymous)],
      'repay(bytes32)': [Function (anonymous)],
      'repay(address,uint256,uint256,address)': [Function (anonymous)],
      'repayWithATokens(address,uint256,uint256)': [Function (anonymous)],
      'repayWithATokens(bytes32)': [Function (anonymous)],
      'repayWithPermit(bytes32,bytes32,bytes32)': [Function (anonymous)],
      'repayWithPermit(address,uint256,uint256,address,uint256,uint8,bytes32,bytes32)': [Function (anonymous)],
      'rescueTokens(address,address,uint256)': [Function (anonymous)],
      'resetIsolationModeTotalDebt(address)': [Function (anonymous)],
      'setConfiguration(address,(uint256))': [Function (anonymous)],
      'setRateZero(address)': [Function (anonymous)],
      'setReserveInterestRateStrategyAddress(address,address)': [Function (anonymous)],
      'setUserEMode(uint8)': [Function (anonymous)],
      'setUserUseReserveAsCollateral(bytes32)': [Function (anonymous)],
      'setUserUseReserveAsCollateral(address,bool)': [Function (anonymous)],
      'supply(address,uint256,address,uint16)': [Function (anonymous)],
      'supply(bytes32)': [Function (anonymous)],
      'supplyWithPermit(address,uint256,address,uint16,uint256,uint8,bytes32,bytes32)': [Function (anonymous)],
      'supplyWithPermit(bytes32,bytes32,bytes32)': [Function (anonymous)],
      'swapBorrowRateMode(bytes32)': [Function (anonymous)],
      'swapBorrowRateMode(address,uint256)': [Function (anonymous)],
      'updateBridgeProtocolFee(uint256)': [Function (anonymous)],
      'updateFlashloanPremiums(uint128,uint128)': [Function (anonymous)],
      'withdraw(address,uint256,address)': [Function (anonymous)],
      'withdraw(bytes32)': [Function (anonymous)],
      ADDRESSES_PROVIDER: [Function (anonymous)],
      BRIDGE_PROTOCOL_FEE: [Function (anonymous)],
      FLASHLOAN_PREMIUM_TOTAL: [Function (anonymous)],
      FLASHLOAN_PREMIUM_TO_PROTOCOL: [Function (anonymous)],
      MAX_NUMBER_RESERVES: [Function (anonymous)],
      MAX_STABLE_RATE_BORROW_SIZE_PERCENT: [Function (anonymous)],
      POOL_REVISION: [Function (anonymous)],
      backUnbacked: [Function (anonymous)],
      configureEModeCategory: [Function (anonymous)],
      deposit: [Function (anonymous)],
      dropReserve: [Function (anonymous)],
      finalizeTransfer: [Function (anonymous)],
      flashLoan: [Function (anonymous)],
      flashLoanSimple: [Function (anonymous)],
      getConfiguration: [Function (anonymous)],
      getEModeCategoryData: [Function (anonymous)],
      getReserveAddressById: [Function (anonymous)],
      getReserveData: [Function (anonymous)],
      getReserveNormalizedIncome: [Function (anonymous)],
      getReserveNormalizedVariableDebt: [Function (anonymous)],
      getReservesList: [Function (anonymous)],
      getUserAccountData: [Function (anonymous)],
      getUserConfiguration: [Function (anonymous)],
      getUserEMode: [Function (anonymous)],
      initReserve: [Function (anonymous)],
      initialize: [Function (anonymous)],
      mintToTreasury: [Function (anonymous)],
      mintUnbacked: [Function (anonymous)],
      rateZeroer: [Function (anonymous)],
      rescueTokens: [Function (anonymous)],
      resetIsolationModeTotalDebt: [Function (anonymous)],
      setConfiguration: [Function (anonymous)],
      setRateZero: [Function (anonymous)],
      setReserveInterestRateStrategyAddress: [Function (anonymous)],
      setUserEMode: [Function (anonymous)],
      updateBridgeProtocolFee: [Function (anonymous)],
      updateFlashloanPremiums: [Function (anonymous)]
    })
    */
    it("cannot supply while USDC is paused", async function () {
      let USDC = ASSETS[1].contract;
      await USDC.connect(user1).approve(poolProxy3.address, MaxUint256);
      await expect(poolProxy3.connect(user1).supply(USDC.address, 1, user1.address, 0)).to.be.revertedWith('29')
    })
    it("timelock can unpause USDC", async function () {
      let tx = await poolConfigurator.connect(timelockSigner).setReservePause(ASSETS[1].address, false);
    })
    it("timelock can unpause USDT", async function () {
      let tx = await poolConfigurator.connect(timelockSigner).setReservePause(ASSETS[2].address, false);
    })
    it("get USDC for user1", async function () {
      let USDC = ASSETS[1].contract;
      let supplyAmount = parseUnits("10", 6); // 10 USDC
      let multisigBal = await USDC.balanceOf(MULTISIG_ADDRESS);
      console.log(`multisig USDC balance: ${formatUnits(multisigBal, 6)}`);
      expect(multisigBal).gte(supplyAmount);
      await USDC.connect(multisigSigner).transfer(user1.address, supplyAmount);
    })
    it("users can supply", async function () {
      let user = user1
      let asset = ASSETS[1]
      let USDC = asset.contract;
      let aUSDC = asset.aContract;
      let supplyAmount = parseUnits("5", 6); // 5 USDC
      // check pre-conditions
      expect(await USDC.balanceOf(user.address)).gte(supplyAmount);
      let bal0 = await aUSDC.balanceOf(user.address);
      // approve and supply
      await USDC.connect(user).approve(poolProxy3.address, MaxUint256);
      let tx = await poolProxy3.connect(user).supply(USDC.address, supplyAmount, user.address, 0);
      // verify events
      await expect(tx).to.emit(USDC, "Transfer").withArgs(user.address, aUSDC.address, supplyAmount);
      await expect(tx).to.emit(poolProxy3, "Supply").withArgs(USDC.address, user.address, user.address, supplyAmount, 0);
      // verify balance increased
      let bal1 = await aUSDC.balanceOf(user.address);
      expect(bal1).eq(bal0.add(supplyAmount));
    })
    it("users can deposit", async function () {
      let USDC = ASSETS[1].contract;
      let aUSDC = ASSETS[1].aContract;
      let depositAmount = parseUnits("1", 6); // 1 USDC
      expect(await USDC.balanceOf(user1.address)).gte(depositAmount);
      let bal0 = await aUSDC.balanceOf(user1.address);
      let tx = await poolProxy3.connect(user1).deposit(USDC.address, depositAmount, user1.address, 0);
      await expect(tx).to.emit(poolProxy3, "Supply").withArgs(USDC.address, user1.address, user1.address, depositAmount, 0);
      let bal1 = await aUSDC.balanceOf(user1.address);
      expect(bal1).eq(bal0.add(depositAmount));
    })
    it("users can repay", async function () {
      let userAddress = "0x9E81B20E3255CdFAeBDA41d5dECBACd9fc6aE0a9"
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],
      });
      let user = provider.getSigner(userAddress);
      let asset = ASSETS[2] // USDT
      let amount = "1000000" // 1 USDT
      let USDT = asset.contract;
      let aUSDT = asset.aContract;
      let vdUSDT = asset.vdContract;
      // fund gas for impersonated account
      await user1.sendTransaction({ to: userAddress, value: WeiPerEther.mul(1), data: "0x" });
      // check pre-conditions: user has variable debt
      let debtBal0 = await vdUSDT.balanceOf(userAddress);
      console.log(`user USDT debt before repay: ${formatUnits(debtBal0, 6)}`);
      expect(debtBal0).gte(amount);
      // ensure user has USDT to repay
      let usdtBal = await USDT.balanceOf(userAddress);
      console.log(`user USDT balance: ${formatUnits(usdtBal, 6)}`);
      if (usdtBal.lt(amount)) {
        await USDT.connect(multisigSigner).transfer(userAddress, amount);
      }
      // approve and repay
      await USDT.connect(user).approve(poolProxy3.address, MaxUint256);
      let tx = await poolProxy3.connect(user).repay(USDT.address, amount, 2, userAddress);
      // verify events
      await expect(tx).to.emit(USDT, "Transfer").withArgs(userAddress, aUSDT.address, amount);
      await expect(tx).to.emit(poolProxy3, "Repay").withArgs(USDT.address, userAddress, userAddress, amount, false);
      // verify debt decreased
      let debtBal1 = await vdUSDT.balanceOf(userAddress);
      expect(debtBal1).eq(debtBal0.sub(amount));
    })
    it("users can withdraw", async function () {
      let userAddress = "0x78e25A7E0302319749469e37f3395340C848C32E"
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [userAddress],
      });
      let user = provider.getSigner(userAddress);
      let asset = ASSETS[1] // USDC
      let amount = "1000000" // 1 USDC
      let USDC = asset.contract;
      let aUSDC = asset.aContract;
      // fund gas for impersonated account
      await user1.sendTransaction({ to: userAddress, value: WeiPerEther.mul(1), data: "0x" });
      // check pre-conditions: user has aUSDC
      let aBal0 = await aUSDC.balanceOf(userAddress);
      console.log(`user aUSDC balance before withdraw: ${formatUnits(aBal0, 6)}`);
      expect(aBal0).gte(amount);
      let underlyingBal0 = await USDC.balanceOf(userAddress);
      // withdraw
      let tx = await poolProxy3.connect(user).withdraw(USDC.address, amount, userAddress);
      // verify events
      await expect(tx).to.emit(USDC, "Transfer").withArgs(aUSDC.address, userAddress, amount);
      await expect(tx).to.emit(poolProxy3, "Withdraw").withArgs(USDC.address, userAddress, userAddress, amount);
      // verify aToken balance decreased
      let aBal1 = await aUSDC.balanceOf(userAddress);
      expect(aBal1).eq(aBal0.sub(amount));
      // verify underlying balance increased
      let underlyingBal1 = await USDC.balanceOf(userAddress);
      expect(underlyingBal1).eq(underlyingBal0.add(amount));
    })
    it("users cannot borrow", async function () {
      await expect(
        poolProxy3.connect(user1).borrow(ASSETS[0].address, 1, 2, 0, user1.address)
      ).to.be.revertedWith("Borrows disabled")
    })
    it("users cannot liquidate", async function () {
      await expect(
        poolProxy3.connect(user1).liquidationCall(ASSETS[0].address, ASSETS[1].address, user2.address, 1, false)
      ).to.be.revertedWith("Liquidations disabled")
    })
    it("users cannot flash loan", async function () {
      await expect(
        poolProxy3.connect(user1).flashLoan(user2.address, [], [], [], user3.address, "0x", 0)
      ).to.be.revertedWith("Flash loans disabled")
      await expect(
        poolProxy3.connect(user1).flashLoanSimple(user2.address, ASSETS[0].address, 1, "0x", 0)
      ).to.be.revertedWith("Flash loans disabled")
    })
    it("non rate setter cannot zero rates", async function () {
      await expect(poolProxy3.connect(user1).setRateZero(ASSETS[0].address)).to.be.revertedWith("Unauthorized")
    })
    it("rate setter can zero rates", async function () {
      await poolProxy3.connect(rateSetter).setRateZero(ASSETS[0].address);
      let reserveData = await poolProxy3.getReserveData(ASSETS[0].address);
      expect(reserveData.currentLiquidityRate).eq(0);
      expect(reserveData.currentVariableBorrowRate).eq(0);
    })
    it("get balances after MainPool3 operations", async function () {
      balanceSnapshots.push(await getBalances());
    })
    it("get indexes after MainPool3 operations", async function () {
      indexSnapshots.push(await getIndexes(poolProxy3, "after MainPool3 operations"));
    })
  })
  describe("MainPool4", function () {
    it("deploy MainPool4 implementation", async function () {
      let libraries = {
        "BorrowLogic": BORROW_LOGIC,
        "BridgeLogic": BRIDGE_LOGIC,
        "EModeLogic": EMODE_LOGIC,
        "FlashLoanLogic": FLASHLOAN_LOGIC,
        "LiquidationLogic": LIQUIDATION_LOGIC,
        "PoolLogic": POOL_LOGIC,
        "SupplyLogic": SUPPLY_LOGIC,
      }
      let poolZeroFactory = await ethers.getContractFactory("MainPool4", { libraries });
      poolImpl4 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS);
      await poolImpl4.deployed();
      expect(await poolImpl4.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
    })
    it("can use timelock signer to upgrade to implementation 4", async function () {
      let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl4.address);
      poolProxy4 = await ethers.getContractAt("MainPool4", MAIN_POOL_PROXY_ADDRESS);
    })
  })
  describe("outputs", function () {
    it("write indexes CSV", async function () {
      writeIndexesCsv(indexSnapshots);
    })
    it("write balances CSV", async function () {
      writeBalancesCsv(balanceSnapshots);
    })
    it("write balance diffs CSV", async function () {
      writeBalanceDiffsCsv(balanceSnapshots);
    })
  })

  // =========================================================================
  // Data collection
  // =========================================================================

  async function getIndexes(poolContract: any, snapshotDescription: string): Promise<IndexSnapshot> {
    let block = await ethers.provider.getBlock("latest");
    let assets: Record<string, AssetIndexes> = {};

    for (const asset of ASSETS) {
      let reserveData = await poolContract.getReserveData(asset.address);
      let normalizedIncome = await poolContract.getReserveNormalizedIncome(asset.address);
      let normalizedVarDebt = await poolContract.getReserveNormalizedVariableDebt(asset.address);
      let aSupply = await asset.aContract.totalSupply();
      let vdSupply = await asset.vdContract.totalSupply();

      assets[asset.symbol] = {
        liquidityIndex: reserveData.liquidityIndex.toString(),
        variableBorrowIndex: reserveData.variableBorrowIndex.toString(),
        currentLiquidityRate: reserveData.currentLiquidityRate.toString(),
        currentVariableBorrowRate: reserveData.currentVariableBorrowRate.toString(),
        currentStableBorrowRate: reserveData.currentStableBorrowRate.toString(),
        normalizedIncome: normalizedIncome.toString(),
        normalizedVarDebt: normalizedVarDebt.toString(),
        aTokenSupply: aSupply.toString(),
        vdTokenSupply: vdSupply.toString(),
      };
    }

    return {
      blockNumber: block.number,
      blockTimestamp: new Date(block.timestamp * 1000).toLocaleString(),
      snapshotDescription,
      assets,
    };
  }

  async function getBalances(): Promise<BalanceSnapshot> {
    let result: Record<string, Record<string, UserAssetBalances>> = {};

    for (const userAddr of users) {
      result[userAddr] = {};
      for (const asset of ASSETS) {
        result[userAddr][asset.symbol] = {
          underlying: await asset.contract.balanceOf(userAddr),
          aToken: await asset.aContract.balanceOf(userAddr),
          vdToken: await asset.vdContract.balanceOf(userAddr),
        };
      }
    }

    return { users: result };
  }

  // =========================================================================
  // CSV writers
  // =========================================================================

  function writeIndexesCsv(snapshots: IndexSnapshot[]) {
    //const snapshotHeaders = snapshots.map((s, i) => `snapshot${i} (block ${s.blockNumber})`);
    //const header = `asset,metric,${snapshotHeaders.join(",")}`;
    //const rows: string[] = [header];

    const metrics: (keyof AssetIndexes)[] = [
      "liquidityIndex",
      "variableBorrowIndex",
      "currentLiquidityRate",
      "currentVariableBorrowRate",
      "currentStableBorrowRate",
      "normalizedIncome",
      "normalizedVarDebt",
      "aTokenSupply",
      "vdTokenSupply",
    ];
    const header = `snapshot,description,${metrics.join(",")}`;
    
    /*
    for (const asset of ASSETS) {
        for (const metric of metrics) {
            const values = snapshots.map(s => s.assets[asset.symbol][metric]);
            rows.push(`${asset.symbol},${metric},${values.join(",")}`);
        }
    }
    const filePath = path.join(OUTPUT_DIR, "indexes.csv");
    fs.writeFileSync(filePath, rows.join("\n") + "\n");
    console.log(`Wrote ${filePath}`);
    */
    for (const asset of ASSETS) {
      const rows: string[] = [header];

      for (let i = 0; i < snapshots.length; i++) {
        const snap = snapshots[i];
        const values = metrics.map(metric => snap.assets[asset.symbol][metric]);
        rows.push(`${i},${snap.snapshotDescription},${values.join(",")}`);
      }

      const filePath = path.join(OUTPUT_DIR, `indexes_${asset.symbol}.csv`);
      fs.writeFileSync(filePath, rows.join("\n") + "\n");
      console.log(`Wrote ${filePath}`);
    }
  }

  function writeBalancesCsv(snapshots: BalanceSnapshot[]) {
    const header = "snapshot,user,asset,underlying,aToken,vdToken";
    const rows: string[] = [header];

    for (let i = 0; i < snapshots.length; i++) {
      const snap = snapshots[i];
      for (const userAddr of users) {
        for (const asset of ASSETS) {
          const b = snap.users[userAddr][asset.symbol];
          rows.push(`${i},${userAddr},${asset.symbol},${formatUnits(b.underlying, asset.decimals)},${formatUnits(b.aToken, asset.decimals)},${formatUnits(b.vdToken, asset.decimals)}`);
        }
      }
    }

    const filePath = path.join(OUTPUT_DIR, "balances.csv");
    fs.writeFileSync(filePath, rows.join("\n") + "\n");
    console.log(`Wrote ${filePath}`);
  }

  function writeBalanceDiffsCsv(snapshots: BalanceSnapshot[]) {
    const header = "transition,user,asset,aToken_before,aToken_after,aToken_diff,vdToken_before,vdToken_after,vdToken_diff";
    const rows: string[] = [header];

    for (let i = 1; i < snapshots.length; i++) {
      const before = snapshots[i - 1];
      const after = snapshots[i];
      const label = `${i - 1}->${i}`;

      for (const userAddr of users) {
        for (const asset of ASSETS) {
          const bBefore = before.users[userAddr][asset.symbol];
          const bAfter = after.users[userAddr][asset.symbol];
          const aDiff = bAfter.aToken.sub(bBefore.aToken);
          const vdDiff = bAfter.vdToken.sub(bBefore.vdToken);

          rows.push(`${label},${userAddr},${asset.symbol},${formatUnits(bBefore.aToken, asset.decimals)},${formatUnits(bAfter.aToken, asset.decimals)},${formatUnits(aDiff, asset.decimals)},${formatUnits(bBefore.vdToken, asset.decimals)},${formatUnits(bAfter.vdToken, asset.decimals)},${formatUnits(vdDiff, asset.decimals)}`);
        }
      }
    }

    const filePath = path.join(OUTPUT_DIR, "balance_diffs.csv");
    fs.writeFileSync(filePath, rows.join("\n") + "\n");
    console.log(`Wrote ${filePath}`);
  }

  // =========================================================================
  // Utilities
  // =========================================================================

  // reverts if no code was deployed at the given address and block
  // or if the address is invalid
  async function expectDeployed(address: string, blockTag="latest") {
    expect(await isDeployed(address, blockTag), `no contract deployed at ${address}`).to.be.true;
  }

  // returns true if code is deployed at the given address and block
  // returns false if the address is invalid or no code was deployed yet
  async function isDeployed(address: string, blockTag:any="latest") {
    try {
      // safety checks
      if(address === undefined || address === null) return false;
      if(address.length !== 42) return false;
      if(address == ethers.constants.AddressZero) return false;
      if((await provider.getCode(address, blockTag)).length <= 2) return false;
      return true;
    } catch (e: any) {
      throw e;
    }
  }

})
