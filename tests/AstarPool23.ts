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

const ASTAR_POOL_PROXY_ADDRESS = "0x0Bd12d3C4E794cf9919618E2bC71Bdd0C4FF1cF6";
const ASTAR_POOL_IMPLEMENTATION_ADDRESS = "0x6Ef6724fb2d75Bb7F8fCA25C8fC8bab5f1FD15Bc";

const ADDRESS_PROVIDER_ADDRESS = "0x1a6c44EdDA729a7a9EE0eE3EAB24e4AC31503E77"; // also pool proxy admin
const TIMELOCK_ADDRESS = "0xAF4c640E8e15Ff2cd7fB7645Ddd9861882cFeC28"; // also owner of address provider

const BORROW_LOGIC = "0x6B39dDF39D931e0B298Ab94919D305868EC98B01";
const BRIDGE_LOGIC = "0x23A490AE21CD3fBbc3A216a372580836c1a79C2e";
const EMODE_LOGIC = "0x6f1d59f20E1082C1A45D0ddfb6286Bc85d83c674";
const FLASHLOAN_LOGIC = "0x3474214b16AF7185157caEC2F6e1c3fc770088Bd";
const LIQUIDATION_LOGIC = "0x81c57f6cC56C2C717939A5154dB24B93C292330D";
const POOL_LOGIC = "0x113f7B5A45D49b38e264C4FF78537A22E9996D69";
const SUPPLY_LOGIC = "0xfe30C424e4A19c33839D02de11746B3EBA521D35";

const ASTR_ADDRESS = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441"
const AASTR_ADDRESS = "0x36ed877D3BbB868eAe4A89D6705e55a3Ed2B66DC"
const VDASTR_ADDRESS = "0xDbbE40d007F12b74b0A06153753aFdD26a0dfB5B"

const NSASTR_ADDRESS = "0xc67476893C166c537afd9bc6bc87b3f228b44337"
const ANSASTR_ADDRESS = "0x8007b302B5208a2f75Faa241f7B2653ac61e1df0"
const VDNSASTR_ADDRESS = "0xC905AA400b788A74C6EC369F1Df152AB08d8d654"

const WSTASTR_ADDRESS = "0x3b0DC2daC9498A024003609031D973B1171dE09E"
const AWSTASTR_ADDRESS = "0x8B76ac181fd1E8CE6F6338b58Afa60bd1911FBf4"
const VDWSTASTR_ADDRESS = "0x5795F80B2d74B682278230F3CEaAfc4E5CF51350"

let users = [ // some users to check balances
"0x78e25A7E0302319749469e37f3395340C848C32E",
"0x4acc24595C589f6790EB80909FaD67A276C06AF9",
"0x129DdF9c3958D5ae6A5A61a40110bEB8D7ca8E7d",
]

describe("AstarPool23", function () {
    let signer: SignerWithAddress;
    let rateSetter: SignerWithAddress;
    let user1: SignerWithAddress;
    let timelockSigner: SignerWithAddress;
    let provider: any;

    let poolProxy1: any; // proxy with original L2Pool
    let poolProxy2: any; // proxy with AstarPool2
    let poolProxy3: any; // proxy with AstarPool3
    
    let poolImpl1: any; // L2Pool impl
    let poolImpl2: any; // AstarPool2 impl
    let poolImpl3: any; // AstarPool3 impl

    //let poolProxy: any;
    let addressProvider: any;
    

    let astr: any;
    let aastr: any;
    let vdastr: any;

    let nsastr: any;
    let ansastr: any;
    let vdnsastr: any;

    let wstastr: any;
    let awstastr: any;
    let vdwstastr: any;

    let balances0: any;
    let balances1: any;
    let balances2: any;

    before(async function () {
        console.log(`testing AstarPool23`);
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

        const blockNumber = 10272250; // later than the latest needed contract deployment
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
        await expectDeployed(ASTAR_POOL_PROXY_ADDRESS);
        await expectDeployed(ASTAR_POOL_IMPLEMENTATION_ADDRESS);
        await expectDeployed(ADDRESS_PROVIDER_ADDRESS);
        await expectDeployed(TIMELOCK_ADDRESS);

        await expectDeployed(BORROW_LOGIC);
        await expectDeployed(BRIDGE_LOGIC);
        await expectDeployed(EMODE_LOGIC);
        await expectDeployed(FLASHLOAN_LOGIC);
        await expectDeployed(LIQUIDATION_LOGIC);
        await expectDeployed(POOL_LOGIC);
        await expectDeployed(SUPPLY_LOGIC);

        await expectDeployed(ASTR_ADDRESS);
        await expectDeployed(AASTR_ADDRESS);
        await expectDeployed(VDASTR_ADDRESS);

        await expectDeployed(NSASTR_ADDRESS);
        await expectDeployed(ANSASTR_ADDRESS);
        await expectDeployed(VDNSASTR_ADDRESS);
        
        await expectDeployed(WSTASTR_ADDRESS);
        await expectDeployed(AWSTASTR_ADDRESS);
        await expectDeployed(VDWSTASTR_ADDRESS);

        poolProxy1 = await ethers.getContractAt("L2Pool", ASTAR_POOL_PROXY_ADDRESS);
        addressProvider = await ethers.getContractAt("PoolAddressesProvider", ADDRESS_PROVIDER_ADDRESS);
        
        astr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ASTR_ADDRESS);
        aastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AASTR_ADDRESS);
        vdastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDASTR_ADDRESS);

        nsastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", NSASTR_ADDRESS);
        ansastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", ANSASTR_ADDRESS);
        vdnsastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDNSASTR_ADDRESS);

        wstastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", WSTASTR_ADDRESS);
        awstastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", AWSTASTR_ADDRESS);
        vdwstastr = await ethers.getContractAt("@aave/aave-token/contracts/open-zeppelin/ERC20.sol:ERC20", VDWSTASTR_ADDRESS);
    })
    
    it("get balances before upgrade", async function () {
        balances0 = await getAndLogBalances();
    })
    it("deploy AstarPool2 implementation", async function () {
        let libraries = {
            "BorrowLogic": BORROW_LOGIC,
            "BridgeLogic": BRIDGE_LOGIC,
            "EModeLogic": EMODE_LOGIC,
            "FlashLoanLogic": FLASHLOAN_LOGIC,
            "LiquidationLogic": LIQUIDATION_LOGIC,
            "PoolLogic": POOL_LOGIC,
            "SupplyLogic": SUPPLY_LOGIC,
        }
        let poolZeroFactory = await ethers.getContractFactory("AstarPool2", { libraries });
        poolImpl2 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS, rateSetter.address);
        await poolImpl2.deployed();
        expect(await poolImpl2.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
        expect(await poolImpl2.rateZeroer()).eq(rateSetter.address);
    })
    it("can use timelock signer to upgrade implementation", async function () {
        console.log(`setting pool impl to ${poolImpl2.address}`)
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl2.address);
        console.log(`set pool impl`)

        poolProxy2 = await ethers.getContractAt("AstarPool2", ASTAR_POOL_PROXY_ADDRESS);
    })
    it("get balances after upgrade - not zeroed yet", async function () {
        balances1 = await getAndLogBalances();
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
        //poolProxy2 = await ethers.getContractAt("AstarPool2", ASTAR_POOL_PROXY_ADDRESS);
        let tx1 = await poolProxy2.connect(rateSetter).setRateZero(ASTR_ADDRESS);
        let tx2 = await poolProxy2.connect(rateSetter).setRateZero(NSASTR_ADDRESS);
        let tx3 = await poolProxy2.connect(rateSetter).setRateZero(WSTASTR_ADDRESS);
    })
    it("cannot revert to previous implementation", async function () {
        //let tx = await addressProvider.connect(timelockSigner).setPoolImpl(ASTAR_POOL_IMPLEMENTATION_ADDRESS);
        await expect(addressProvider.connect(timelockSigner).setPoolImpl(ASTAR_POOL_IMPLEMENTATION_ADDRESS)).to.be.reverted;
    })
    /*
    it("can use timelock signer to revert implementation", async function () {
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(ASTAR_POOL_IMPLEMENTATION_ADDRESS);
    })
    */

    it("deploy AstarPool3 implementation", async function () {
        let libraries = {
            "BorrowLogic": BORROW_LOGIC,
            "BridgeLogic": BRIDGE_LOGIC,
            "EModeLogic": EMODE_LOGIC,
            "FlashLoanLogic": FLASHLOAN_LOGIC,
            "LiquidationLogic": LIQUIDATION_LOGIC,
            "PoolLogic": POOL_LOGIC,
            "SupplyLogic": SUPPLY_LOGIC,
        }
        let poolZeroFactory = await ethers.getContractFactory("AstarPool3", { libraries });
        poolImpl3 = await poolZeroFactory.deploy(ADDRESS_PROVIDER_ADDRESS);
        await poolImpl3.deployed();
        expect(await poolImpl3.ADDRESSES_PROVIDER()).eq(ADDRESS_PROVIDER_ADDRESS);
    })
    it("can use timelock signer to upgrade to implementation 3", async function () {
        let tx = await addressProvider.connect(timelockSigner).setPoolImpl(poolImpl3.address);
    })

    it("get balances after upgrade and zeroed", async function () {
        balances2 = await getAndLogBalances();
    })
    it("log balance diffs", async function () {
        console.log("before and after 1")
        getAndLogBalancesDiff(balances0, balances1)
        console.log("before and after 2")
        getAndLogBalancesDiff(balances1, balances2)
    })
    
    async function getAndLogBalances() {
        let balances = []
        for(let userIndex = 0; userIndex < users.length; userIndex++) {
            let user = users[userIndex]
            let thisUserBalances = []
            thisUserBalances.push(await astr.balanceOf(user))
            thisUserBalances.push(await aastr.balanceOf(user))
            thisUserBalances.push(await vdastr.balanceOf(user))
            thisUserBalances.push(await nsastr.balanceOf(user))
            thisUserBalances.push(await ansastr.balanceOf(user))
            thisUserBalances.push(await vdnsastr.balanceOf(user))
            thisUserBalances.push(await wstastr.balanceOf(user))
            thisUserBalances.push(await awstastr.balanceOf(user))
            thisUserBalances.push(await vdwstastr.balanceOf(user))
            balances.push(thisUserBalances)

            console.log('\n')
            console.log(`balances of user ${userIndex} ${user}`)
            console.log('')
            console.log(`ASTR       : ${formatBalance(thisUserBalances[0])}`)
            console.log(`AASTR      : ${formatBalance(thisUserBalances[1])}`)
            console.log(`VDASTR     : ${formatBalance(thisUserBalances[2])}`)
            console.log('')
            console.log(`NSASTR     : ${formatBalance(thisUserBalances[3])}`)
            console.log(`ANSASTR    : ${formatBalance(thisUserBalances[4])}`)
            console.log(`VDNSASTR   : ${formatBalance(thisUserBalances[5])}`)
            console.log('')
            console.log(`WSTASTR    : ${formatBalance(thisUserBalances[6])}`)
            console.log(`AWSTASTR   : ${formatBalance(thisUserBalances[7])}`)
            console.log(`VDWSTASTR  : ${formatBalance(thisUserBalances[8])}`)
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
            console.log(`ASTR       : ${formatBalance(balsBefore[0])} ${formatBalance(balsAfter[0])} ${formatBalance(balsAfter[0].sub(balsBefore[0]))}`)
            console.log(`AASTR      : ${formatBalance(balsBefore[1])} ${formatBalance(balsAfter[1])} ${formatBalance(balsAfter[1].sub(balsBefore[1]))}`)
            console.log(`VDASTR     : ${formatBalance(balsBefore[2])} ${formatBalance(balsAfter[2])} ${formatBalance(balsAfter[2].sub(balsBefore[2]))}`)
            console.log('')
            console.log(`NSASTR     : ${formatBalance(balsBefore[3])} ${formatBalance(balsAfter[3])} ${formatBalance(balsAfter[3].sub(balsBefore[3]))}`)
            console.log(`ANSASTR    : ${formatBalance(balsBefore[4])} ${formatBalance(balsAfter[4])} ${formatBalance(balsAfter[4].sub(balsBefore[4]))}`)
            console.log(`VDNSASTR   : ${formatBalance(balsBefore[5])} ${formatBalance(balsAfter[5])} ${formatBalance(balsAfter[5].sub(balsBefore[5]))}`)
            console.log('')
            console.log(`WSTASTR    : ${formatBalance(balsBefore[6])} ${formatBalance(balsAfter[6])} ${formatBalance(balsAfter[6].sub(balsBefore[6]))}`)
            console.log(`AWSTASTR   : ${formatBalance(balsBefore[7])} ${formatBalance(balsAfter[7])} ${formatBalance(balsAfter[7].sub(balsBefore[7]))}`)
            console.log(`VDWSTASTR  : ${formatBalance(balsBefore[8])} ${formatBalance(balsAfter[8])} ${formatBalance(balsAfter[8].sub(balsBefore[8]))}`)
            console.log('')
        }
        //let diffs = []
        /*
        let balancesDiff = []
        for(let userIndex = 0; userIndex < users.length; userIndex++) {
            let thisUserBalancesDiff = []
            for(let balanceIndex = 0; balanceIndex < balances1[userIndex].length; balanceIndex++) {
                thisUserBalancesDiff.push(balances2[userIndex][balanceIndex].sub(balances1[userIndex][balanceIndex]))
            }
            balancesDiff.push(thisUserBalancesDiff)
        }
        return balancesDiff
        */
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


