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
HARDHAT_NETWORK=soneium npx hardhat deploy --reset      

# verify 
npx hardhat --network soneium etherscan-verify --api-url SONEIUM_API_URL

# verify single contract (Optional)
npx hardhat verify --network soneium 0xD1C1419d19A8FDff2700A085B0062C11A1944F7f "0x44612500AA5D0F54C8ba6F043B4844fB49B3D362"
```

### Contract Address 
[Check Here](https://dev-docs.sakefinance.com/docs/dev-docs/contract-addresses/)