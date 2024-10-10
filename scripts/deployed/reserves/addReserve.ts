// Add reserve:
// Files that need to be updated:

// 1. deploy/
// - 01b (add return)
// - 04 add pyth price feed
// - 05, open "OPEN IT WHEN ADD NEW ASSET"
// - 09, can close mint function

// 2. helpers/
// - constants.ts

// 3. markets/
// - index.ts
// - reservesConfigs.ts

// Use the same deployments/ that were deployed, stage first

// Remove "Oracles"(04), "InitOracles"(05), "ReservesInit"(09_init_reserves tag) from deployments/ .migration
// run HARDHAT_NETWORK=minato npx hardhat deploy
// run verify

// Update the deployments/