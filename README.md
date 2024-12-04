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

### Comparing Differences with Aave Contracts
The Sake contracts/ directory contains three folders: `core-v3`, `periphery-v3`, and `sake`. Here's what each contains:

- core-v3: Based on [aave-v3-core](https://github.com/aave/aave-v3-core/tree/master)
- periphery-v3: Based on [aave-v3-periphery](https://github.com/aave/aave-v3-periphery)
- sake: Our custom modifications

1. Core-v3 Comparison
```CMD
# Clone the Aave V3 Core Repository first

git remote add aave-v3-core PATH_TO_AAVE_V3_CORE_CLONE

git fetch aave-v3-core

bash get-core-diff.sh

# Check core_contracts_diff_output.txt, should list the diff files name

# Check more detail from repo_diff_output.txt with the specific file
git diff main:contracts/core-v3/contracts aave-v3-core/master:contracts -- 'FILE-PATH' > core_file_diff_output.txt
```

2. Periphery-v3 Comparison

Note: We skip this comparison as our dependency import method differs from aave-v3-periphery. We import files directly from the same folder, while aave-v3-periphery imports from dependencies.

3. Deploy script Comparison

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
[Check Here](https://dev-docs.sakefinance.com/docs/dev-docs/contract-addresses/)