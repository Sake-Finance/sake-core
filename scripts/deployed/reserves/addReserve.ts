// Add reserve:
// Files that need to be updated:

// 1. deploy/
// - 01b (add return)

// 2. helpers/
// - constants.ts

// 3. markets/
// - index.ts
// - reservesConfigs.ts

// Use the same deployments/ that were deployed, stage first

// First, run "HARDHAT_NETWORK=minato npx hardhat deploy" to get the new testnet mintable token address
// Second, Manually set the oracle
// Last, Remove "ReservesInit"(09_init_reserves tag) from deployments/ .migration, then run HARDHAT_NETWORK=minato npx hardhat deploy
// Update the deployments/