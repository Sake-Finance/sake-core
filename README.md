# Sake Finance 

## Introduction

This is a lending protocol built on Soneium, **based on Aave v3**. The project aims to bring Aave's advanced lending functionality to the Soneium ecosystem, providing users with a secure and efficient decentralized finance service. 

## Development

### Deploy

```CMD
npm i
npm run compile

# Prepare your .env based on .env.example


# deploy
HARDHAT_NETWORK=minato npx hardhat deploy --reset      

# verify 
npx hardhat --network minato etherscan-verify --api-url https://soneium-minato.blockscout.com/api

# verify single contract (Optional)
npx hardhat verify --network minato 0xD1C1419d19A8FDff2700A085B0062C11A1944F7f "0x44612500AA5D0F54C8ba6F043B4844fB49B3D362"
```

### Compare to the official aave deploy repository

[Aave V3 Deploy Repository](https://github.com/aave/aave-v3-deploy)

```CMD
# Clone the Aave V3 Deployment Repository first

git remote add aave-v3-deploy PATH_TO_AAVE_V3_DEPLOY_CLONE

git fetch aave-v3-deploy

# Double check this file before running it
bash exclude-directory-from-git-diff.sh

# Check repo_diff_output.txt, should list the diff files name

# Check more detail from repo_diff_output.txt with the specific file
git diff Sake aave-v3-deploy/main -- ':helpers/market-config-helpers.ts' > file_diff_output.txt
```

### Contract Address 
[Update Here](https://dev-docs.sakefinance.com/docs/dev-docs/contract-addresses/)


### Reminder
- Only support TestnetMintableERC20 tokens, not the real Base Sepolia tokens. You should approve and mint some TestnetMintableERC20 tokens by faucet contract before using Sake.
- In the Aave deployment mechanism, it will use "TestnetPriceAggregator" as the oracle for testnet but not ChainLink, which will always return the constant price for the asset (e.g., WETH will always be 4000). Can adjust this if needed.
- When planning to add a new asset in Sake, you should:
  - Init the reserve (PoolConfigurator.sol `initReserves()`)
  - Update the oracle (AaveOracle.sol `setAssetSources()`)

## Q&A
Q: You mentioned comparing the deployment scripts between Sake and the official Aave V3 deployment repository. Are there any different smart contracts from Aave V3 in Sake, besides the deployment changes?

A: So far, No.

Q: What are the currently supported assets?

A: WBTC / WETH / DAI / USDC / USDT, but all of them are TestnetMintableERC20, not real testnet token. 