/*
import hre from "hardhat";
const { ethers } = hre;
const { provider } = ethers;
import { BigNumber as BN, BigNumberish, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai from "chai";
const { expect, assert } = chai;
*/
import hre from "hardhat";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
const BN = ethers.BigNumber;

const { AddressZero, WeiPerEther, MaxUint256, Zero } = ethers.constants;
const { formatUnits } = ethers.utils;

const MAIN_POOL_PROXY_ADDRESS = "0x3C3987A310ee13F7B8cBBe21D97D4436ba5E4B5f";
const MAIN_POOL_IMPLEMENTATION_ADDRESS = "0x7d4FFcE767430D1077333622718B5F28E23D3180";

const ADDRESS_PROVIDER_ADDRESS = "0x73a35ca19Da0357651296c40805c31585f19F741"; // also pool proxy admin
const TIMELOCK_ADDRESS = "0xAF4c640E8e15Ff2cd7fB7645Ddd9861882cFeC28"; // also owner of address provider

const BORROW_LOGIC       = "0x545541a451471A26d1fF29c9821D0ea97325f10E";
const BRIDGE_LOGIC       = "0x4E041B5019CeD3479A35f6C1AD29f81d1cE70109";
const EMODE_LOGIC        = "0xAa9e5105ACC5E612b0c27a17f4a671991A79D6c7";
const FLASHLOAN_LOGIC    = "0xFa5778871E17D7163202b67853661c95978BF56B";
const LIQUIDATION_LOGIC  = "0xf4a9BA6E61e29E6D5C89D9EB60a73Add6A9e7402";
const POOL_LOGIC         = "0x213b3586Dd60a5135684222c6fa610e7bc275F9b";
const SUPPLY_LOGIC       = "0x51a0D90D3E09a52de6AF2b2cD099991e127E1f2b";

const WETH_ADDRESS          = "0x4200000000000000000000000000000000000006"
const AWETH_ADDRESS         = "0x4DC7c9eC156188Ea46F645E8407738C32c2B5B58"
const VDWETH_ADDRESS        = "0x310DDe1DB3611d78B24DC17460dd1beb15354000"

const USDC_ADDRESS          = "0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369"
const AUSDC_ADDRESS         = "0x4491B60c8fdD668FcC2C4dcADf9012b3fA71a726"
const VDUSDC_ADDRESS        = "0xe0c2e7DDA57ae7caf8D61D5B5f3395a0928cc331"

const USDT_ADDRESS          = "0x3A337a6adA9d885b6Ad95ec48F9b75f197b5AE35"
const AUSDT_ADDRESS         = "0xe4dD5EF3c90136f72A163904d2A7E9de3771Ece7"
const VDUSDT_ADDRESS        = "0x91872142444Dd849c6BC5e3f0Bf28600a612bC76"

const USDT0_ADDRESS         = "0x102d758f688a4C1C5a80b116bD945d4455460282"
const AUSDT0_ADDRESS        = "0xC04D50506986504f992Fe4e68F98A6e23C11Bcef"
const VDUSDT0_ADDRESS       = "0x3d15Ff402140eE524981d512E079aB1354aA115B"

const ASTR_ADDRESS          = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441"
const AASTR_ADDRESS         = "0xA0b7108f28b4449354152334E14140b7A6d2070B"
const VDASTR_ADDRESS        = "0xc51FcFe6e8E4B95f818d0a7b635901E7C3E03c12"

const SOLVBTC_ADDRESS       = "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77"
const ASOLVBTC_ADDRESS      = "0xE11d68AC80d6D8CCbaC28ed5D0f80bd6477BFe41"
const VDSOLVBTC_ADDRESS     = "0xcC388DAc15CEB26f4d668664e458F40c49Ccb2AE"

const XSOLVBTC_ADDRESS      = "0xCC0966D8418d412c599A6421b760a847eB169A8c"
const AXSOLVBTC_ADDRESS     = "0xA95F849718acfFC6cE1736416aaFB4d14A998AF3"
const VDXSOLVBTC_ADDRESS    = "0x7e1f9ba9F9Db09cD0294e5ebdC551e42a727D045"

const SOLVBTCJUP_ADDRESS    = "0xAffEb8576b927050f5a3B6fbA43F360D2883A118"
const ASOLVBTCJUP_ADDRESS   = "0xE41959F80437496a9B2241609E6e7F3feeFA4C3A"
const VDSOLVBTCJUP_ADDRESS  = "0x40b49B84bA6Aa416980A76FaEBe2F5828dB701ff"

const SSUPERUSD_ADDRESS     = "0x139450C2dCeF827C9A2a0Bb1CB5506260940c9fd"
const ASSUPERUSD_ADDRESS    = "0xEB2dc4d4B64D1c2e2270C5AB57DdBa4c428f5b15"
const VDSSUPERUSD_ADDRESS   = "0x3595987f1C30583474a4D8958294D9e0Ece962C6"

const PUFETH_ADDRESS        = "0x6c460b2c6D6719562D5dA43E5152B375e79B9A8B"
const APUFETH_ADDRESS       = "0x0526CF96Ad808f8E11A5a9F1012edf67F4BAf519"
const VDPUFETH_ADDRESS      = "0x2b510b2fDF38148C7EbCa0a9B9777Fbd9AAaDAdd"

const WSTUSR_ADDRESS        = "0x2a52B289bA68bBd02676640aA9F605700c9e5699"
const AWSTUSR_ADDRESS       = "0x55CdA22e998589add9707a83E85AE04877eA1bCf"
const VDWSTUSR_ADDRESS      = "0xe67BAceBF6956cba28Ada8B54B626E0250DD9f58"

const SONE_ADDRESS          = "0xf24e57b1cb00d98C31F04f86328e22E8fcA457fb"
const ASONE_ADDRESS         = "0x9FE39076043D19B87247DE15095b4e9b3c7d6f61"
const VDSONE_ADDRESS        = "0xEC00bF784A650aC162599efe651a18b31Ce0847F"

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

describe("MainPool23", function () {
    let signer: SignerWithAddress;
    let rateSetter: SignerWithAddress;
    let user1: SignerWithAddress;
    let timelockSigner: SignerWithAddress;
    let provider: any;

    let poolProxy1: any; // proxy with original L2Pool
    let poolProxy2: any; // proxy with MainPool2
    let poolProxy3: any; // proxy with MainPool3
    
    let poolImpl1: any; // L2Pool impl
    let poolImpl2: any; // MainPool2 impl
    let poolImpl3: any; // MainPool3 impl

    //let poolProxy: any;
    let addressProvider: any;
    
    let weth: any;
    let aweth: any;
    let vdweth: any;

    let usdc: any;
    let ausdc: any;
    let vdusdc: any;

    let usdt: any;
    let ausdt: any;
    let vdusdt: any;

    let usdt0: any;
    let ausdt0: any;
    let vdusdt0: any;

    let astr: any;
    let aastr: any;
    let vdastr: any;

    let solvbtc: any;
    let asolvbtc: any;
    let vdsolvbtc: any;

    let xsolvbtc: any;
    let axsolvbtc: any;
    let vdxsolvbtc: any;

    let solvbtcjup: any;
    let asolvbtcjup: any;
    let vdsolvbtcjup: any;

    let ssuperusd: any;
    let assuperusd: any;
    let vdssuperusd: any;

    let pufeth: any;
    let apufeth: any;
    let vdpufeth: any;

    let wstusr: any;
    let awstusr: any;
    let vdwstusr: any;

    let sone: any;
    let asone: any;
    let vdsone: any;




    let balances0: any;
    let balances1: any;
    let balances2: any;
    let indexes0: any;
    let indexes1: any;
    let indexes2: any;

    before(async function () {
        console.log(`testing MainPool23`);
        //let network = await provider.getNetwork()
        //let chainID = network.chainId
        //console.log('current network')
        //console.log(network)
        //console.log(chainID)

        console.log('getting signers')
        let signers = await ethers.getSigners()
        //console.log('signers')
        //console.log(signers)
        //[signer, user1] = await ethers.getSigners();
        signer = signers[0]
        rateSetter = signers[1]
        user1 = signers[2]
        provider = signer.provider
        /*
        console.log(`trying to fork network soneium ${process.env.SONEIUM_URL}`);
        //[signer] = await ethers.getSigners();

        const blockNumber = 20600773; // later than the latest needed contract deployment
        // Run tests against forked soneium mainnet
        await hre.network.provider.request({
        //await provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: process.env.SONEIUM_URL,
                        blockNumber,
                    },
                },
            ],
        });
        */

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [TIMELOCK_ADDRESS],
        });
        timelockSigner = provider.getSigner(TIMELOCK_ADDRESS);
        //console.log('funding 1')
        await user1.sendTransaction({
            to: TIMELOCK_ADDRESS,
            value: WeiPerEther.mul(1),
            data: "0x"
        })
        //console.log('funding 2')
        
    })
    it("get existing contracts", async function () {
        await expectDeployed(MAIN_POOL_PROXY_ADDRESS);
        await expectDeployed(MAIN_POOL_IMPLEMENTATION_ADDRESS);
        await expectDeployed(ADDRESS_PROVIDER_ADDRESS);
        await expectDeployed(TIMELOCK_ADDRESS);

        await expectDeployed(BORROW_LOGIC);
        await expectDeployed(BRIDGE_LOGIC);
        await expectDeployed(EMODE_LOGIC);
        await expectDeployed(FLASHLOAN_LOGIC);
        await expectDeployed(LIQUIDATION_LOGIC);
        await expectDeployed(POOL_LOGIC);
        await expectDeployed(SUPPLY_LOGIC);

        await expectDeployed(WETH_ADDRESS);
        await expectDeployed(AWETH_ADDRESS);
        await expectDeployed(VDWETH_ADDRESS);

        await expectDeployed(USDC_ADDRESS);
        await expectDeployed(AUSDC_ADDRESS);
        await expectDeployed(VDUSDC_ADDRESS);

        await expectDeployed(USDT_ADDRESS);
        await expectDeployed(AUSDT_ADDRESS);
        await expectDeployed(VDUSDT_ADDRESS);

        await expectDeployed(USDT0_ADDRESS);
        await expectDeployed(AUSDT0_ADDRESS);
        await expectDeployed(VDUSDT0_ADDRESS);

        await expectDeployed(ASTR_ADDRESS);
        await expectDeployed(AASTR_ADDRESS);
        await expectDeployed(VDASTR_ADDRESS);

        await expectDeployed(SOLVBTC_ADDRESS);
        await expectDeployed(ASOLVBTC_ADDRESS);
        await expectDeployed(VDSOLVBTC_ADDRESS);

        await expectDeployed(XSOLVBTC_ADDRESS);
        await expectDeployed(AXSOLVBTC_ADDRESS);
        await expectDeployed(VDXSOLVBTC_ADDRESS);

        await expectDeployed(SOLVBTCJUP_ADDRESS);
        await expectDeployed(ASOLVBTCJUP_ADDRESS);
        await expectDeployed(VDSOLVBTCJUP_ADDRESS);

        await expectDeployed(SSUPERUSD_ADDRESS);
        await expectDeployed(ASSUPERUSD_ADDRESS);
        await expectDeployed(VDSSUPERUSD_ADDRESS);

        await expectDeployed(PUFETH_ADDRESS);
        await expectDeployed(APUFETH_ADDRESS);
        await expectDeployed(VDPUFETH_ADDRESS);

        await expectDeployed(WSTUSR_ADDRESS);
        await expectDeployed(AWSTUSR_ADDRESS);
        await expectDeployed(VDWSTUSR_ADDRESS);

        await expectDeployed(SONE_ADDRESS);
        await expectDeployed(ASONE_ADDRESS);
        await expectDeployed(VDSONE_ADDRESS);

        poolProxy1 = await ethers.getContractAt("L2Pool", MAIN_POOL_PROXY_ADDRESS);
        addressProvider = await ethers.getContractAt("PoolAddressesProvider", ADDRESS_PROVIDER_ADDRESS);

        weth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", WETH_ADDRESS);
        aweth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AWETH_ADDRESS);
        vdweth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDWETH_ADDRESS);

        usdc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", USDC_ADDRESS);
        ausdc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AUSDC_ADDRESS);
        vdusdc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDUSDC_ADDRESS);

        usdt = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", USDT_ADDRESS);
        ausdt = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AUSDT_ADDRESS);
        vdusdt = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDUSDT_ADDRESS);

        usdt0 = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", USDT0_ADDRESS);
        ausdt0 = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AUSDT0_ADDRESS);
        vdusdt0 = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDUSDT0_ADDRESS);

        astr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASTR_ADDRESS);
        aastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AASTR_ADDRESS);
        vdastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDASTR_ADDRESS);

        solvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", SOLVBTC_ADDRESS);
        asolvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASOLVBTC_ADDRESS);
        vdsolvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDSOLVBTC_ADDRESS);

        xsolvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", XSOLVBTC_ADDRESS);
        axsolvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AXSOLVBTC_ADDRESS);
        vdxsolvbtc = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDXSOLVBTC_ADDRESS);

        solvbtcjup = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", SOLVBTCJUP_ADDRESS);
        asolvbtcjup = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASOLVBTCJUP_ADDRESS);
        vdsolvbtcjup = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDSOLVBTCJUP_ADDRESS);

        ssuperusd = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", SSUPERUSD_ADDRESS);
        assuperusd = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASSUPERUSD_ADDRESS);
        vdssuperusd = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDSSUPERUSD_ADDRESS);

        pufeth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", PUFETH_ADDRESS);
        apufeth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", APUFETH_ADDRESS);
        vdpufeth = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDPUFETH_ADDRESS);

        wstusr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", WSTUSR_ADDRESS);
        awstusr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AWSTUSR_ADDRESS);
        vdwstusr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDWSTUSR_ADDRESS);

        sone = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", SONE_ADDRESS);
        asone = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASONE_ADDRESS);
        vdsone = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDSONE_ADDRESS);


    })
    it("get block number", async function () {
        var blockNumber = await provider.getBlockNumber();
        console.log(`blockNumber ${blockNumber}`);
        // 20601548
        // 20601606
        // not pinned, changes every run
    })
    it("get balances before upgrade", async function () {
        balances0 = await getAndLogBalances();
    })
    it("get indexes before upgrade", async function () {
        indexes0 = await getAndLogIndexes(poolProxy1);
    })
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
        poolImpl2 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS, rateSetter.address);
        await poolImpl2.deployed();
        expect(await poolImpl2.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
        expect(await poolImpl2.rateZeroer()).eq(rateSetter.address);
    })
    it("can use timelock signer to upgrade implementation", async function () {
        console.log(`setting pool impl to ${poolImpl2.address}`)
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl2.address);
        console.log(`set pool impl`)

        poolProxy2 = await ethers.getContractAt("MainPool2", MAIN_POOL_PROXY_ADDRESS);
    })
    it("get balances after upgrade - not zeroed yet", async function () {
        balances1 = await getAndLogBalances();
    })
    it("get indexes after upgrade - not zeroed yet", async function () {
        indexes1 = await getAndLogIndexes(poolProxy2);
    })
    it("non rate setter cannot zero current interest rates", async function () {
        //await poolProxy2.connect(user1).zeroInterestRates(ASTR_ADDRESS);
        await expect(poolProxy2.connect(user1).setRateZero(ASTR_ADDRESS)).to.be.reverted
    })
    it("cannot zero current interest rates of unlisted asset", async function () {
        //await poolProxy2.connect(rateSetter).zeroInterestRates(user1.address);
        await expect(poolProxy2.connect(rateSetter).setRateZero(user1.address)).to.be.reverted
    })
    it("can zero current interest rates", async function () {
        //poolProxy2 = await ethers.getContractAt("MainPool2", MAIN_POOL_PROXY_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(WETH_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(USDC_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(USDT_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(USDT0_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(ASTR_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(SOLVBTC_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(XSOLVBTC_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(SOLVBTCJUP_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(SSUPERUSD_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(PUFETH_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(WSTUSR_ADDRESS);
        await poolProxy2.connect(rateSetter).setRateZero(SONE_ADDRESS);
    })
    it("cannot revert to previous implementation", async function () {
        //let tx = await addressProvider.connect(timelockSigner).setPoolImpl(MAIN_POOL_IMPLEMENTATION_ADDRESS);
        await expect(addressProvider.connect(timelockSigner).setPoolImpl(MAIN_POOL_IMPLEMENTATION_ADDRESS)).to.be.reverted;
    })
    /*
    it("can use timelock signer to revert implementation", async function () {
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(MAIN_POOL_IMPLEMENTATION_ADDRESS);
    })
    */

    it("deploy MainPool3 implementation", async function () {
        let libraries = {
            "BorrowLogic": BORROW_LOGIC,
            "BridgeLogic": BRIDGE_LOGIC,
            "EModeLogic": EMODE_LOGIC,
            "FlashLoanLogic": FLASHLOAN_LOGIC,
            "LiquidationLogic": LIQUIDATION_LOGIC,
            "PoolLogic": POOL_LOGIC,
            "SupplyLogic": SUPPLY_LOGIC,
        }
        let poolZeroFactory = await ethers.getContractFactory("MainPool3", { libraries });
        poolImpl3 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS);
        await poolImpl3.deployed();
        expect(await poolImpl3.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
    })
    it("can use timelock signer to upgrade to implementation 3", async function () {
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl3.address);
        poolProxy3 = await ethers.getContractAt("MainPool3", MAIN_POOL_PROXY_ADDRESS);
    })

    it("get balances after upgrade and zeroed", async function () {
        balances2 = await getAndLogBalances();
    })
    it("get indexes after upgrade and zeroed", async function () {
        indexes2 = await getAndLogIndexes(poolProxy3);
    })
    it("log balance diffs", async function () {
        console.log("before and after 1")
        getAndLogBalancesDiff(balances0, balances1)
        console.log("before and after 2")
        getAndLogBalancesDiff(balances1, balances2)
    })
    it("log new balances", async function () {
        csvifyBalances(balances2)
    })
    it("log new indexes", async function () {
        //csvifyIndexes(indexes2)
        console.log('logging indexes before and after upgrade')
        console.log(`block 0: number ${indexes0.block.number} timestamp ${(new Date(indexes0.block.timestamp * 1000)).toLocaleString()}`)
        console.log(`block 1: number ${indexes1.block.number} timestamp ${(new Date(indexes1.block.timestamp * 1000)).toLocaleString()}`)
        console.log(`block 2: number ${indexes2.block.number} timestamp ${(new Date(indexes2.block.timestamp * 1000)).toLocaleString()}`)

        console.log('\n\nreserve data WETH\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataWeth.liquidityIndex.toString())
        console.log(indexes1.reserveDataWeth.liquidityIndex.toString())
        console.log(indexes2.reserveDataWeth.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataWeth.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataWeth.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataWeth.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeWeth.toString())
        console.log(indexes1.reserveNormalizedIncomeWeth.toString())
        console.log(indexes2.reserveNormalizedIncomeWeth.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtWeth.toString())
        console.log(indexes1.reserveNormalizedVariableDebtWeth.toString())
        console.log(indexes2.reserveNormalizedVariableDebtWeth.toString())
        console.log('aWETH total supply')
        console.log(formatUnits(indexes0.awethSupply, 18))
        console.log(formatUnits(indexes1.awethSupply, 18))
        console.log(formatUnits(indexes2.awethSupply, 18))
        console.log('vdWETH total supply')
        console.log(formatUnits(indexes0.vdwethSupply, 18))
        console.log(formatUnits(indexes1.vdwethSupply, 18))
        console.log(formatUnits(indexes2.vdwethSupply, 18))

        console.log('\n\nreserve data USDC\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataUsdc.liquidityIndex.toString())
        console.log(indexes1.reserveDataUsdc.liquidityIndex.toString())
        console.log(indexes2.reserveDataUsdc.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataUsdc.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataUsdc.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataUsdc.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeUsdc.toString())
        console.log(indexes1.reserveNormalizedIncomeUsdc.toString())
        console.log(indexes2.reserveNormalizedIncomeUsdc.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtUsdc.toString())
        console.log(indexes1.reserveNormalizedVariableDebtUsdc.toString())
        console.log(indexes2.reserveNormalizedVariableDebtUsdc.toString())
        console.log('aUSDC total supply')
        console.log(formatUnits(indexes0.ausdcSupply, 18))
        console.log(formatUnits(indexes1.ausdcSupply, 18))
        console.log(formatUnits(indexes2.ausdcSupply, 18))
        console.log('vdUSDC total supply')
        console.log(formatUnits(indexes0.vdusdcSupply, 18))
        console.log(formatUnits(indexes1.vdusdcSupply, 18))
        console.log(formatUnits(indexes2.vdusdcSupply, 18))

        console.log('\n\nreserve data USDT\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataUsdt.liquidityIndex.toString())
        console.log(indexes1.reserveDataUsdt.liquidityIndex.toString())
        console.log(indexes2.reserveDataUsdt.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataUsdt.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataUsdt.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataUsdt.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeUsdt.toString())
        console.log(indexes1.reserveNormalizedIncomeUsdt.toString())
        console.log(indexes2.reserveNormalizedIncomeUsdt.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtUsdt.toString())
        console.log(indexes1.reserveNormalizedVariableDebtUsdt.toString())
        console.log(indexes2.reserveNormalizedVariableDebtUsdt.toString())
        console.log('aUSDT total supply')
        console.log(formatUnits(indexes0.ausdtSupply, 18))
        console.log(formatUnits(indexes1.ausdtSupply, 18))
        console.log(formatUnits(indexes2.ausdtSupply, 18))
        console.log('vdUSDT total supply')
        console.log(formatUnits(indexes0.vdusdtSupply, 18))
        console.log(formatUnits(indexes1.vdusdtSupply, 18))
        console.log(formatUnits(indexes2.vdusdtSupply, 18))

        console.log('\n\nreserve data USDT0\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataUsdt0.liquidityIndex.toString())
        console.log(indexes1.reserveDataUsdt0.liquidityIndex.toString())
        console.log(indexes2.reserveDataUsdt0.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataUsdt0.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataUsdt0.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataUsdt0.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeUsdt0.toString())
        console.log(indexes1.reserveNormalizedIncomeUsdt0.toString())
        console.log(indexes2.reserveNormalizedIncomeUsdt0.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtUsdt0.toString())
        console.log(indexes1.reserveNormalizedVariableDebtUsdt0.toString())
        console.log(indexes2.reserveNormalizedVariableDebtUsdt0.toString())
        console.log('aUSDT0 total supply')
        console.log(formatUnits(indexes0.ausdt0Supply, 18))
        console.log(formatUnits(indexes1.ausdt0Supply, 18))
        console.log(formatUnits(indexes2.ausdt0Supply, 18))
        console.log('vdUSDT0 total supply')
        console.log(formatUnits(indexes0.vdusdt0Supply, 18))
        console.log(formatUnits(indexes1.vdusdt0Supply, 18))
        console.log(formatUnits(indexes2.vdusdt0Supply, 18))

        console.log('\n\nreserve data ASTR\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataAstr.liquidityIndex.toString())
        console.log(indexes1.reserveDataAstr.liquidityIndex.toString())
        console.log(indexes2.reserveDataAstr.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataAstr.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataAstr.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataAstr.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeAstr.toString())
        console.log(indexes1.reserveNormalizedIncomeAstr.toString())
        console.log(indexes2.reserveNormalizedIncomeAstr.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtAstr.toString())
        console.log(indexes1.reserveNormalizedVariableDebtAstr.toString())
        console.log(indexes2.reserveNormalizedVariableDebtAstr.toString())
        console.log('aASTR total supply')
        console.log(formatUnits(indexes0.aastrSupply, 18))
        console.log(formatUnits(indexes1.aastrSupply, 18))
        console.log(formatUnits(indexes2.aastrSupply, 18))
        console.log('vdASTR total supply')
        console.log(formatUnits(indexes0.vdastrSupply, 18))
        console.log(formatUnits(indexes1.vdastrSupply, 18))
        console.log(formatUnits(indexes2.vdastrSupply, 18))

        console.log('\n\nreserve data SOLVBTC\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataSolvbtc.liquidityIndex.toString())
        console.log(indexes1.reserveDataSolvbtc.liquidityIndex.toString())
        console.log(indexes2.reserveDataSolvbtc.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataSolvbtc.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataSolvbtc.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataSolvbtc.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeSolvbtc.toString())
        console.log(indexes1.reserveNormalizedIncomeSolvbtc.toString())
        console.log(indexes2.reserveNormalizedIncomeSolvbtc.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtSolvbtc.toString())
        console.log(indexes1.reserveNormalizedVariableDebtSolvbtc.toString())
        console.log(indexes2.reserveNormalizedVariableDebtSolvbtc.toString())
        console.log('aSOLVBTC total supply')
        console.log(formatUnits(indexes0.asolvbtcSupply, 18))
        console.log(formatUnits(indexes1.asolvbtcSupply, 18))
        console.log(formatUnits(indexes2.asolvbtcSupply, 18))
        console.log('vdSOLVBTC total supply')
        console.log(formatUnits(indexes0.vdsolvbtcSupply, 18))
        console.log(formatUnits(indexes1.vdsolvbtcSupply, 18))
        console.log(formatUnits(indexes2.vdsolvbtcSupply, 18))

        console.log('\n\nreserve data XSOLVBTC\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataXsolvbtc.liquidityIndex.toString())
        console.log(indexes1.reserveDataXsolvbtc.liquidityIndex.toString())
        console.log(indexes2.reserveDataXsolvbtc.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataXsolvbtc.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataXsolvbtc.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataXsolvbtc.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeXsolvbtc.toString())
        console.log(indexes1.reserveNormalizedIncomeXsolvbtc.toString())
        console.log(indexes2.reserveNormalizedIncomeXsolvbtc.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtXsolvbtc.toString())
        console.log(indexes1.reserveNormalizedVariableDebtXsolvbtc.toString())
        console.log(indexes2.reserveNormalizedVariableDebtXsolvbtc.toString())
        console.log('aXSOLVBTC total supply')
        console.log(formatUnits(indexes0.axsolvbtcSupply, 18))
        console.log(formatUnits(indexes1.axsolvbtcSupply, 18))
        console.log(formatUnits(indexes2.axsolvbtcSupply, 18))
        console.log('vdXSOLVBTC total supply')
        console.log(formatUnits(indexes0.vdxsolvbtcSupply, 18))
        console.log(formatUnits(indexes1.vdxsolvbtcSupply, 18))
        console.log(formatUnits(indexes2.vdxsolvbtcSupply, 18))

        console.log('\n\nreserve data SOLVBTCJUP\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataSolvbtcjup.liquidityIndex.toString())
        console.log(indexes1.reserveDataSolvbtcjup.liquidityIndex.toString())
        console.log(indexes2.reserveDataSolvbtcjup.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataSolvbtcjup.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataSolvbtcjup.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataSolvbtcjup.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeSolvbtcjup.toString())
        console.log(indexes1.reserveNormalizedIncomeSolvbtcjup.toString())
        console.log(indexes2.reserveNormalizedIncomeSolvbtcjup.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtSolvbtcjup.toString())
        console.log(indexes1.reserveNormalizedVariableDebtSolvbtcjup.toString())
        console.log(indexes2.reserveNormalizedVariableDebtSolvbtcjup.toString())
        console.log('aSOLVBTCJUP total supply')
        console.log(formatUnits(indexes0.asolvbtcjupSupply, 18))
        console.log(formatUnits(indexes1.asolvbtcjupSupply, 18))
        console.log(formatUnits(indexes2.asolvbtcjupSupply, 18))
        console.log('vdSOLVBTCJUP total supply')
        console.log(formatUnits(indexes0.vdsolvbtcjupSupply, 18))
        console.log(formatUnits(indexes1.vdsolvbtcjupSupply, 18))
        console.log(formatUnits(indexes2.vdsolvbtcjupSupply, 18))

        console.log('\n\nreserve data SSUPERUSD\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataSsuperusd.liquidityIndex.toString())
        console.log(indexes1.reserveDataSsuperusd.liquidityIndex.toString())
        console.log(indexes2.reserveDataSsuperusd.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataSsuperusd.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataSsuperusd.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataSsuperusd.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeSsuperusd.toString())
        console.log(indexes1.reserveNormalizedIncomeSsuperusd.toString())
        console.log(indexes2.reserveNormalizedIncomeSsuperusd.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtSsuperusd.toString())
        console.log(indexes1.reserveNormalizedVariableDebtSsuperusd.toString())
        console.log(indexes2.reserveNormalizedVariableDebtSsuperusd.toString())
        console.log('aSSUPERUSD total supply')
        console.log(formatUnits(indexes0.assuperusdSupply, 18))
        console.log(formatUnits(indexes1.assuperusdSupply, 18))
        console.log(formatUnits(indexes2.assuperusdSupply, 18))
        console.log('vdSSUPERUSD total supply')
        console.log(formatUnits(indexes0.vdssuperusdSupply, 18))
        console.log(formatUnits(indexes1.vdssuperusdSupply, 18))
        console.log(formatUnits(indexes2.vdssuperusdSupply, 18))

        console.log('\n\nreserve data PUFETH\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataPufeth.liquidityIndex.toString())
        console.log(indexes1.reserveDataPufeth.liquidityIndex.toString())
        console.log(indexes2.reserveDataPufeth.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataPufeth.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataPufeth.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataPufeth.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomePufeth.toString())
        console.log(indexes1.reserveNormalizedIncomePufeth.toString())
        console.log(indexes2.reserveNormalizedIncomePufeth.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtPufeth.toString())
        console.log(indexes1.reserveNormalizedVariableDebtPufeth.toString())
        console.log(indexes2.reserveNormalizedVariableDebtPufeth.toString())
        console.log('aPUFETH total supply')
        console.log(formatUnits(indexes0.apufethSupply, 18))
        console.log(formatUnits(indexes1.apufethSupply, 18))
        console.log(formatUnits(indexes2.apufethSupply, 18))
        console.log('vdPUFETH total supply')
        console.log(formatUnits(indexes0.vdpufethSupply, 18))
        console.log(formatUnits(indexes1.vdpufethSupply, 18))
        console.log(formatUnits(indexes2.vdpufethSupply, 18))

        console.log('\n\nreserve data WSTUSR\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataWstusr.liquidityIndex.toString())
        console.log(indexes1.reserveDataWstusr.liquidityIndex.toString())
        console.log(indexes2.reserveDataWstusr.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataWstusr.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataWstusr.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataWstusr.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeWstusr.toString())
        console.log(indexes1.reserveNormalizedIncomeWstusr.toString())
        console.log(indexes2.reserveNormalizedIncomeWstusr.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtWstusr.toString())
        console.log(indexes1.reserveNormalizedVariableDebtWstusr.toString())
        console.log(indexes2.reserveNormalizedVariableDebtWstusr.toString())
        console.log('aWSTUSR total supply')
        console.log(formatUnits(indexes0.awstusrSupply, 18))
        console.log(formatUnits(indexes1.awstusrSupply, 18))
        console.log(formatUnits(indexes2.awstusrSupply, 18))
        console.log('vdWSTUSR total supply')
        console.log(formatUnits(indexes0.vdwstusrSupply, 18))
        console.log(formatUnits(indexes1.vdwstusrSupply, 18))
        console.log(formatUnits(indexes2.vdwstusrSupply, 18))

        console.log('\n\nreserve data SONE\n')
        console.log('liquidity index')
        console.log(indexes0.reserveDataSone.liquidityIndex.toString())
        console.log(indexes1.reserveDataSone.liquidityIndex.toString())
        console.log(indexes2.reserveDataSone.liquidityIndex.toString())
        console.log('variable borrow index')
        console.log(indexes0.reserveDataSone.variableBorrowIndex.toString())
        console.log(indexes1.reserveDataSone.variableBorrowIndex.toString())
        console.log(indexes2.reserveDataSone.variableBorrowIndex.toString())
        console.log('normalized income')
        console.log(indexes0.reserveNormalizedIncomeSone.toString())
        console.log(indexes1.reserveNormalizedIncomeSone.toString())
        console.log(indexes2.reserveNormalizedIncomeSone.toString())
        console.log('normalized variable debt')
        console.log(indexes0.reserveNormalizedVariableDebtSone.toString())
        console.log(indexes1.reserveNormalizedVariableDebtSone.toString())
        console.log(indexes2.reserveNormalizedVariableDebtSone.toString())
        console.log('aSONE total supply')
        console.log(formatUnits(indexes0.asoneSupply, 18))
        console.log(formatUnits(indexes1.asoneSupply, 18))
        console.log(formatUnits(indexes2.asoneSupply, 18))
        console.log('vdSONE total supply')
        console.log(formatUnits(indexes0.vdsoneSupply, 18))
        console.log(formatUnits(indexes1.vdsoneSupply, 18))
        console.log(formatUnits(indexes2.vdsoneSupply, 18))

        console.log(`\n`)
    })
    

    async function getAndLogIndexes(poolContract:any) {
        let block = await ethers.provider.getBlock("latest")
        //console.log(`block number ${block.number} timestamp ${(new Date(block.timestamp * 1000)).toLocaleString()}`)
        let reserveDataWeth = await poolContract.getReserveData(WETH_ADDRESS)
        let reserveDataUsdc = await poolContract.getReserveData(USDC_ADDRESS)
        let reserveDataUsdt = await poolContract.getReserveData(USDT_ADDRESS)
        let reserveDataUsdt0 = await poolContract.getReserveData(USDT0_ADDRESS)
        let reserveDataAstr = await poolContract.getReserveData(ASTR_ADDRESS)
        let reserveDataSolvbtc = await poolContract.getReserveData(SOLVBTC_ADDRESS)
        let reserveDataXsolvbtc = await poolContract.getReserveData(XSOLVBTC_ADDRESS)
        let reserveDataSolvbtcjup = await poolContract.getReserveData(SOLVBTCJUP_ADDRESS)
        let reserveDataSsuperusd = await poolContract.getReserveData(SSUPERUSD_ADDRESS)
        let reserveDataPufeth = await poolContract.getReserveData(PUFETH_ADDRESS)
        let reserveDataWstusr = await poolContract.getReserveData(WSTUSR_ADDRESS)
        let reserveDataSone = await poolContract.getReserveData(SONE_ADDRESS)
        let reserveNormalizedIncomeWeth = await poolContract.getReserveNormalizedIncome(WETH_ADDRESS)
        let reserveNormalizedIncomeUsdc = await poolContract.getReserveNormalizedIncome(USDC_ADDRESS)
        let reserveNormalizedIncomeUsdt = await poolContract.getReserveNormalizedIncome(USDT_ADDRESS)
        let reserveNormalizedIncomeUsdt0 = await poolContract.getReserveNormalizedIncome(USDT0_ADDRESS)
        let reserveNormalizedIncomeAstr = await poolContract.getReserveNormalizedIncome(ASTR_ADDRESS)
        let reserveNormalizedIncomeSolvbtc = await poolContract.getReserveNormalizedIncome(SOLVBTC_ADDRESS)
        let reserveNormalizedIncomeXsolvbtc = await poolContract.getReserveNormalizedIncome(XSOLVBTC_ADDRESS)
        let reserveNormalizedIncomeSolvbtcjup = await poolContract.getReserveNormalizedIncome(SOLVBTCJUP_ADDRESS)
        let reserveNormalizedIncomeSsuperusd = await poolContract.getReserveNormalizedIncome(SSUPERUSD_ADDRESS)
        let reserveNormalizedIncomePufeth = await poolContract.getReserveNormalizedIncome(PUFETH_ADDRESS)
        let reserveNormalizedIncomeWstusr = await poolContract.getReserveNormalizedIncome(WSTUSR_ADDRESS)
        let reserveNormalizedIncomeSone = await poolContract.getReserveNormalizedIncome(SONE_ADDRESS)
        let reserveNormalizedVariableDebtWeth = await poolContract.getReserveNormalizedVariableDebt(WETH_ADDRESS)
        let reserveNormalizedVariableDebtUsdc = await poolContract.getReserveNormalizedVariableDebt(USDC_ADDRESS)
        let reserveNormalizedVariableDebtUsdt = await poolContract.getReserveNormalizedVariableDebt(USDT_ADDRESS)
        let reserveNormalizedVariableDebtUsdt0 = await poolContract.getReserveNormalizedVariableDebt(USDT0_ADDRESS)
        let reserveNormalizedVariableDebtAstr = await poolContract.getReserveNormalizedVariableDebt(ASTR_ADDRESS)
        let reserveNormalizedVariableDebtSolvbtc = await poolContract.getReserveNormalizedVariableDebt(SOLVBTC_ADDRESS)
        let reserveNormalizedVariableDebtXsolvbtc = await poolContract.getReserveNormalizedVariableDebt(XSOLVBTC_ADDRESS)
        let reserveNormalizedVariableDebtSolvbtcjup = await poolContract.getReserveNormalizedVariableDebt(SOLVBTCJUP_ADDRESS)
        let reserveNormalizedVariableDebtSsuperusd = await poolContract.getReserveNormalizedVariableDebt(SSUPERUSD_ADDRESS)
        let reserveNormalizedVariableDebtPufeth = await poolContract.getReserveNormalizedVariableDebt(PUFETH_ADDRESS)
        let reserveNormalizedVariableDebtWstusr = await poolContract.getReserveNormalizedVariableDebt(WSTUSR_ADDRESS)
        let reserveNormalizedVariableDebtSone = await poolContract.getReserveNormalizedVariableDebt(SONE_ADDRESS)
        let awethSupply = await aweth.totalSupply()
        let ausdcSupply = await ausdc.totalSupply()
        let ausdtSupply = await ausdt.totalSupply()
        let ausdt0Supply = await ausdt0.totalSupply()
        let aastrSupply = await aastr.totalSupply()
        let asolvbtcSupply = await asolvbtc.totalSupply()
        let axsolvbtcSupply = await axsolvbtc.totalSupply()
        let asolvbtcjupSupply = await asolvbtcjup.totalSupply()
        let assuperusdSupply = await assuperusd.totalSupply()
        let apufethSupply = await apufeth.totalSupply()
        let awstusrSupply = await awstusr.totalSupply()
        let asoneSupply = await asone.totalSupply()
        let vdwethSupply = await vdweth.totalSupply()
        let vdusdcSupply = await vdusdc.totalSupply()
        let vdusdtSupply = await vdusdt.totalSupply()
        let vdusdt0Supply = await vdusdt0.totalSupply()
        let vdastrSupply = await vdastr.totalSupply()
        let vdsolvbtcSupply = await vdsolvbtc.totalSupply()
        let vdxsolvbtcSupply = await vdxsolvbtc.totalSupply()
        let vdsolvbtcjupSupply = await vdsolvbtcjup.totalSupply()
        let vdssuperusdSupply = await vdssuperusd.totalSupply()
        let vdpufethSupply = await vdpufeth.totalSupply()
        let vdwstusrSupply = await vdwstusr.totalSupply()
        let vdsoneSupply = await vdsone.totalSupply()
        let res = { block, reserveDataWeth, reserveDataUsdc, reserveDataUsdt, reserveDataUsdt0, reserveDataAstr, reserveDataSolvbtc, reserveDataXsolvbtc, reserveDataSolvbtcjup, reserveDataSsuperusd, reserveDataPufeth, reserveDataWstusr, reserveDataSone, reserveNormalizedIncomeWeth, reserveNormalizedIncomeUsdc, reserveNormalizedIncomeUsdt, reserveNormalizedIncomeUsdt0, reserveNormalizedIncomeAstr, reserveNormalizedIncomeSolvbtc, reserveNormalizedIncomeXsolvbtc, reserveNormalizedIncomeSolvbtcjup, reserveNormalizedIncomeSsuperusd, reserveNormalizedIncomePufeth, reserveNormalizedIncomeWstusr, reserveNormalizedIncomeSone, reserveNormalizedVariableDebtWeth, reserveNormalizedVariableDebtUsdc, reserveNormalizedVariableDebtUsdt, reserveNormalizedVariableDebtUsdt0, reserveNormalizedVariableDebtAstr, reserveNormalizedVariableDebtSolvbtc, reserveNormalizedVariableDebtXsolvbtc, reserveNormalizedVariableDebtSolvbtcjup, reserveNormalizedVariableDebtSsuperusd, reserveNormalizedVariableDebtPufeth, reserveNormalizedVariableDebtWstusr, reserveNormalizedVariableDebtSone, awethSupply, ausdcSupply, ausdtSupply, ausdt0Supply, aastrSupply, asolvbtcSupply, axsolvbtcSupply, asolvbtcjupSupply, assuperusdSupply, apufethSupply, awstusrSupply, asoneSupply, vdwethSupply, vdusdcSupply, vdusdtSupply, vdusdt0Supply, vdastrSupply, vdsolvbtcSupply, vdxsolvbtcSupply, vdsolvbtcjupSupply, vdssuperusdSupply, vdpufethSupply, vdwstusrSupply, vdsoneSupply }
        return res
    }

    async function getAndLogBalances() {
        let balances = []
        for(let userIndex = 0; userIndex < users.length; userIndex++) {
            let user = users[userIndex]
            let thisUserBalances = []
            thisUserBalances.push(await weth.balanceOf(user))
            thisUserBalances.push(await aweth.balanceOf(user))
            thisUserBalances.push(await vdweth.balanceOf(user))
            thisUserBalances.push(await usdc.balanceOf(user))
            thisUserBalances.push(await ausdc.balanceOf(user))
            thisUserBalances.push(await vdusdc.balanceOf(user))
            thisUserBalances.push(await usdt.balanceOf(user))
            thisUserBalances.push(await ausdt.balanceOf(user))
            thisUserBalances.push(await vdusdt.balanceOf(user))
            thisUserBalances.push(await usdt0.balanceOf(user))
            thisUserBalances.push(await ausdt0.balanceOf(user))
            thisUserBalances.push(await vdusdt0.balanceOf(user))
            thisUserBalances.push(await astr.balanceOf(user))
            thisUserBalances.push(await aastr.balanceOf(user))
            thisUserBalances.push(await vdastr.balanceOf(user))
            thisUserBalances.push(await solvbtc.balanceOf(user))
            thisUserBalances.push(await asolvbtc.balanceOf(user))
            thisUserBalances.push(await vdsolvbtc.balanceOf(user))
            thisUserBalances.push(await xsolvbtc.balanceOf(user))
            thisUserBalances.push(await axsolvbtc.balanceOf(user))
            thisUserBalances.push(await vdxsolvbtc.balanceOf(user))
            thisUserBalances.push(await solvbtcjup.balanceOf(user))
            thisUserBalances.push(await asolvbtcjup.balanceOf(user))
            thisUserBalances.push(await vdsolvbtcjup.balanceOf(user))
            thisUserBalances.push(await ssuperusd.balanceOf(user))
            thisUserBalances.push(await assuperusd.balanceOf(user))
            thisUserBalances.push(await vdssuperusd.balanceOf(user))
            thisUserBalances.push(await pufeth.balanceOf(user))
            thisUserBalances.push(await apufeth.balanceOf(user))
            thisUserBalances.push(await vdpufeth.balanceOf(user))
            thisUserBalances.push(await wstusr.balanceOf(user))
            thisUserBalances.push(await awstusr.balanceOf(user))
            thisUserBalances.push(await vdwstusr.balanceOf(user))
            thisUserBalances.push(await sone.balanceOf(user))
            thisUserBalances.push(await asone.balanceOf(user))
            thisUserBalances.push(await vdsone.balanceOf(user))
            balances.push(thisUserBalances)

            console.log('\n')
            console.log(`balances of user ${userIndex} ${user}`)
            console.log('')
            console.log(`WETH          : ${formatBalance(thisUserBalances[0])}`)
            console.log(`AWETH         : ${formatBalance(thisUserBalances[1])}`)
            console.log(`VDWETH        : ${formatBalance(thisUserBalances[2])}`)
            console.log('')
            console.log(`USDC          : ${formatBalance(thisUserBalances[3])}`)
            console.log(`AUSDC         : ${formatBalance(thisUserBalances[4])}`)
            console.log(`VDUSDC        : ${formatBalance(thisUserBalances[5])}`)
            console.log('')
            console.log(`USDT          : ${formatBalance(thisUserBalances[6])}`)
            console.log(`AUSDT         : ${formatBalance(thisUserBalances[7])}`)
            console.log(`VDUSDT        : ${formatBalance(thisUserBalances[8])}`)
            console.log('')
            console.log(`USDT0         : ${formatBalance(thisUserBalances[9])}`)
            console.log(`AUSDT0        : ${formatBalance(thisUserBalances[10])}`)
            console.log(`VDUSDT0       : ${formatBalance(thisUserBalances[11])}`)
            console.log('')
            console.log(`ASTR          : ${formatBalance(thisUserBalances[12])}`)
            console.log(`AASTR         : ${formatBalance(thisUserBalances[13])}`)
            console.log(`VDASTR        : ${formatBalance(thisUserBalances[14])}`)
            console.log('')
            console.log(`SOLVBTC       : ${formatBalance(thisUserBalances[15])}`)
            console.log(`ASOLVBTC      : ${formatBalance(thisUserBalances[16])}`)
            console.log(`VDSOLVBTC     : ${formatBalance(thisUserBalances[17])}`)
            console.log('')
            console.log(`XSOLVBTC      : ${formatBalance(thisUserBalances[18])}`)
            console.log(`AXSOLVBTC     : ${formatBalance(thisUserBalances[19])}`)
            console.log(`VDXSOLVBTC    : ${formatBalance(thisUserBalances[20])}`)
            console.log('')
            console.log(`SOLVBTCJUP    : ${formatBalance(thisUserBalances[21])}`)
            console.log(`ASOLVBTCJUP   : ${formatBalance(thisUserBalances[22])}`)
            console.log(`VDSOLVBTCJUP  : ${formatBalance(thisUserBalances[23])}`)
            console.log('')
            console.log(`SSUPERUSD     : ${formatBalance(thisUserBalances[24])}`)
            console.log(`ASSUPERUSD    : ${formatBalance(thisUserBalances[25])}`)
            console.log(`VDSSUPERUSD   : ${formatBalance(thisUserBalances[26])}`)
            console.log('')
            console.log(`PUFETH        : ${formatBalance(thisUserBalances[27])}`)
            console.log(`APUFETH       : ${formatBalance(thisUserBalances[28])}`)
            console.log(`VDPUFETH      : ${formatBalance(thisUserBalances[29])}`)
            console.log('')
            console.log(`WSTUSR        : ${formatBalance(thisUserBalances[30])}`)
            console.log(`AWSTUSR       : ${formatBalance(thisUserBalances[31])}`)
            console.log(`VDWSTUSR      : ${formatBalance(thisUserBalances[32])}`)
            console.log('')
            console.log(`SONE          : ${formatBalance(thisUserBalances[33])}`)
            console.log(`ASONE         : ${formatBalance(thisUserBalances[34])}`)
            console.log(`VDSONE        : ${formatBalance(thisUserBalances[35])}`)
            console.log('')
        }
        return balances
    }

    function getAndLogBalancesDiff(balancesBefore:any, balancesAfter:any) {
        for(let userIndex = 0; userIndex < users.length; userIndex++) {
            let user = users[userIndex]
            let balsBefore = balancesBefore[userIndex]
            let balsAfter = balancesAfter[userIndex]
            console.log(`balance of user ${userIndex} ${user} before and after`)
            console.log('')
            console.log(`WETH          : ${formatBalance(balsBefore[0])} ${formatBalance(balsAfter[0])} ${formatBalance(balsAfter[0].sub(balsBefore[0]))}`)
            console.log(`AWETH         : ${formatBalance(balsBefore[1])} ${formatBalance(balsAfter[1])} ${formatBalance(balsAfter[1].sub(balsBefore[1]))}`)
            console.log(`VDWETH        : ${formatBalance(balsBefore[2])} ${formatBalance(balsAfter[2])} ${formatBalance(balsAfter[2].sub(balsBefore[2]))}`)
            console.log('')
            console.log(`USDC          : ${formatBalance(balsBefore[3])} ${formatBalance(balsAfter[3])} ${formatBalance(balsAfter[3].sub(balsBefore[3]))}`)
            console.log(`AUSDC         : ${formatBalance(balsBefore[4])} ${formatBalance(balsAfter[4])} ${formatBalance(balsAfter[4].sub(balsBefore[4]))}`)
            console.log(`VDUSDC        : ${formatBalance(balsBefore[5])} ${formatBalance(balsAfter[5])} ${formatBalance(balsAfter[5].sub(balsBefore[5]))}`)
            console.log('')
            console.log(`USDT          : ${formatBalance(balsBefore[6])} ${formatBalance(balsAfter[6])} ${formatBalance(balsAfter[6].sub(balsBefore[6]))}`)
            console.log(`AUSDT         : ${formatBalance(balsBefore[7])} ${formatBalance(balsAfter[7])} ${formatBalance(balsAfter[7].sub(balsBefore[7]))}`)
            console.log(`VDUSDT        : ${formatBalance(balsBefore[8])} ${formatBalance(balsAfter[8])} ${formatBalance(balsAfter[8].sub(balsBefore[8]))}`)
            console.log('')
            console.log(`USDT0         : ${formatBalance(balsBefore[9])} ${formatBalance(balsAfter[9])} ${formatBalance(balsAfter[9].sub(balsBefore[9]))}`)
            console.log(`AUSDT0        : ${formatBalance(balsBefore[10])} ${formatBalance(balsAfter[10])} ${formatBalance(balsAfter[10].sub(balsBefore[10]))}`)
            console.log(`VDUSDT0       : ${formatBalance(balsBefore[11])} ${formatBalance(balsAfter[11])} ${formatBalance(balsAfter[11].sub(balsBefore[11]))}`)
            console.log('')
            console.log(`ASTR          : ${formatBalance(balsBefore[12])} ${formatBalance(balsAfter[12])} ${formatBalance(balsAfter[12].sub(balsBefore[12]))}`)
            console.log(`AASTR         : ${formatBalance(balsBefore[13])} ${formatBalance(balsAfter[13])} ${formatBalance(balsAfter[13].sub(balsBefore[13]))}`)
            console.log(`VDASTR        : ${formatBalance(balsBefore[14])} ${formatBalance(balsAfter[14])} ${formatBalance(balsAfter[14].sub(balsBefore[14]))}`)
            console.log('')
            console.log(`SOLVBTC       : ${formatBalance(balsBefore[15])} ${formatBalance(balsAfter[15])} ${formatBalance(balsAfter[15].sub(balsBefore[15]))}`)
            console.log(`ASOLVBTC      : ${formatBalance(balsBefore[16])} ${formatBalance(balsAfter[16])} ${formatBalance(balsAfter[16].sub(balsBefore[16]))}`)
            console.log(`VDSOLVBTC     : ${formatBalance(balsBefore[17])} ${formatBalance(balsAfter[17])} ${formatBalance(balsAfter[17].sub(balsBefore[17]))}`)
            console.log('')
            console.log(`XSOLVBTC      : ${formatBalance(balsBefore[18])} ${formatBalance(balsAfter[18])} ${formatBalance(balsAfter[18].sub(balsBefore[18]))}`)
            console.log(`AXSOLVBTC     : ${formatBalance(balsBefore[19])} ${formatBalance(balsAfter[19])} ${formatBalance(balsAfter[19].sub(balsBefore[19]))}`)
            console.log(`VDXSOLVBTC    : ${formatBalance(balsBefore[20])} ${formatBalance(balsAfter[20])} ${formatBalance(balsAfter[20].sub(balsBefore[20]))}`)
            console.log('')
            console.log(`SOLVBTCJUP    : ${formatBalance(balsBefore[21])} ${formatBalance(balsAfter[21])} ${formatBalance(balsAfter[21].sub(balsBefore[21]))}`)
            console.log(`ASOLVBTCJUP   : ${formatBalance(balsBefore[22])} ${formatBalance(balsAfter[22])} ${formatBalance(balsAfter[22].sub(balsBefore[22]))}`)
            console.log(`VDSOLVBTCJUP  : ${formatBalance(balsBefore[23])} ${formatBalance(balsAfter[23])} ${formatBalance(balsAfter[23].sub(balsBefore[23]))}`)
            console.log('')
            console.log(`SSUPERUSD     : ${formatBalance(balsBefore[24])} ${formatBalance(balsAfter[24])} ${formatBalance(balsAfter[24].sub(balsBefore[24]))}`)
            console.log(`ASSUPERUSD    : ${formatBalance(balsBefore[25])} ${formatBalance(balsAfter[25])} ${formatBalance(balsAfter[25].sub(balsBefore[25]))}`)
            console.log(`VDSSUPERUSD   : ${formatBalance(balsBefore[26])} ${formatBalance(balsAfter[26])} ${formatBalance(balsAfter[26].sub(balsBefore[26]))}`)
            console.log('')
            console.log(`PUFETH        : ${formatBalance(balsBefore[27])} ${formatBalance(balsAfter[27])} ${formatBalance(balsAfter[27].sub(balsBefore[27]))}`)
            console.log(`APUFETH       : ${formatBalance(balsBefore[28])} ${formatBalance(balsAfter[28])} ${formatBalance(balsAfter[28].sub(balsBefore[28]))}`)
            console.log(`VDPUFETH      : ${formatBalance(balsBefore[29])} ${formatBalance(balsAfter[29])} ${formatBalance(balsAfter[29].sub(balsBefore[29]))}`)
            console.log('')
            console.log(`WSTUSR        : ${formatBalance(balsBefore[30])} ${formatBalance(balsAfter[30])} ${formatBalance(balsAfter[30].sub(balsBefore[30]))}`)
            console.log(`AWSTUSR       : ${formatBalance(balsBefore[31])} ${formatBalance(balsAfter[31])} ${formatBalance(balsAfter[31].sub(balsBefore[31]))}`)
            console.log(`VDWSTUSR      : ${formatBalance(balsBefore[32])} ${formatBalance(balsAfter[32])} ${formatBalance(balsAfter[32].sub(balsBefore[32]))}`)
            console.log('')
            console.log(`SONE          : ${formatBalance(balsBefore[33])} ${formatBalance(balsAfter[33])} ${formatBalance(balsAfter[33].sub(balsBefore[33]))}`)
            console.log(`ASONE         : ${formatBalance(balsBefore[34])} ${formatBalance(balsAfter[34])} ${formatBalance(balsAfter[34].sub(balsBefore[34]))}`)
            console.log(`VDSONE        : ${formatBalance(balsBefore[35])} ${formatBalance(balsAfter[35])} ${formatBalance(balsAfter[35].sub(balsBefore[35]))}`)
            console.log('')
        }
    }

    function csvifyBalances(balances:any) {
        console.log(`user,aWETH,aUSDC,aUSDT,aUSDT0,aASTR,aSOLVBTC,aXSOLVBTC,aSOLVBTCJUP,aSSUPERUSD,aPUFETH,aWSTUSR,aSONE,vdWETH,vdUSDC,vdUSDT,vdUSDT0,vdASTR,vdSOLVBTC,vdXSOLVBTC,vdSOLVBTCJUP,vdSSUPERUSD,vdPUFETH,vdWSTUSR,vdSONE`)
        for(let userIndex = 0; userIndex < users.length; userIndex++) {
            let user = users[userIndex]
            let b = balances[userIndex]
            console.log(`${user},${formatUnits(b[1])},${formatUnits(b[4])},${formatUnits(b[7])},${formatUnits(b[10])},${formatUnits(b[13])},${formatUnits(b[16])},${formatUnits(b[19])},${formatUnits(b[22])},${formatUnits(b[25])},${formatUnits(b[28])},${formatUnits(b[31])},${formatUnits(b[34])},${formatUnits(b[2])},${formatUnits(b[5])},${formatUnits(b[8])},${formatUnits(b[11])},${formatUnits(b[14])},${formatUnits(b[17])},${formatUnits(b[20])},${formatUnits(b[23])},${formatUnits(b[26])},${formatUnits(b[29])},${formatUnits(b[32])},${formatUnits(b[35])}`)
        }
    }

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

    function padLeft(s:string, len:number, fill=' ') {
        while(s.length < len) s = fill + s;
        return s;
    }

    function formatBalance(b:any) {
        let bn = BN.from(b)
        if(bn.eq(0)) return padLeft('0', 30)
        return padLeft(formatUnits(bn, 18), 30)
        //return ethers.utils.formatUnits(b, 18);
    }

})


