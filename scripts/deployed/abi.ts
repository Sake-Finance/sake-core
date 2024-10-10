export const poolConfiguratorABI = [
    {
        inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "newDebtCeiling", type: "uint256" }
        ],
        name: "setDebtCeiling",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { internalType: "uint8", name: "categoryId", type: "uint8" },
            { internalType: "uint16", name: "ltv", type: "uint16" },
            { internalType: "uint16", name: "liquidationThreshold", type: "uint16" },
            { internalType: "uint16", name: "liquidationBonus", type: "uint16" },
            { internalType: "address", name: "oracle", type: "address" },
            { internalType: "string", name: "label", type: "string" }
        ],
        name: "setEModeCategory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint8", name: "newCategoryId", type: "uint8" }
        ],
        name: "setAssetEModeCategory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

export const aaveProtocolDataProviderABI = [
    {
        inputs: [{ internalType: "address", name: "asset", type: "address" }],
        name: "getReserveConfigurationData",
        outputs: [
            // ... other outputs ...
            { internalType: "uint256", name: "debtCeiling", type: "uint256" },
            { internalType: "uint256", name: "isolationModeTotalDebtAllowed", type: "uint256" },
            // ... other outputs ...
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "address", name: "asset", type: "address" }],
        name: "getDebtCeiling",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "address", name: "asset", type: "address" }],
        name: "getReserveEModeCategory",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    }
];

export const poolABI = [
    {
        inputs: [{ internalType: "uint8", name: "id", type: "uint8" }],
        name: "getEModeCategoryData",
        outputs: [
            {
                components: [
                    { internalType: "uint16", name: "ltv", type: "uint16" },
                    { internalType: "uint16", name: "liquidationThreshold", type: "uint16" },
                    { internalType: "uint16", name: "liquidationBonus", type: "uint16" },
                    { internalType: "address", name: "priceSource", type: "address" },
                    { internalType: "string", name: "label", type: "string" }
                ],
                internalType: "struct DataTypes.EModeCategory",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];