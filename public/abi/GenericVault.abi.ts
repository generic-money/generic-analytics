export const genericVaultAbi = [
    {
        type: "function",
        name: "NORMALIZED_ASSET_DECIMALS",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint8",
                internalType: "uint8"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "VERSION",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "string",
                internalType: "string"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "allocate",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "asset",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "autoAllocationThreshold",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "controller",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "controllerDeposit",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "controllerWithdraw",
        inputs: [
            {
                name: "asset_",
                type: "address",
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "convertToAssets",
        inputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "convertToShares",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "deallocate",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "deposit",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "manager",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "maxDeposit",
        inputs: [
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "maxMint",
        inputs: [
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "maxRedeem",
        inputs: [
            {
                name: "owner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "maxWithdraw",
        inputs: [
            {
                name: "owner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "mint",
        inputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "previewDeposit",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "previewMint",
        inputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "previewRedeem",
        inputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "previewWithdraw",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "redeem",
        inputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setAutoAllocationThreshold",
        inputs: [
            {
                name: "threshold",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "share",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "strategy",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "totalAssets",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "totalNormalizedAssets",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "withdraw",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "shares",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "event",
        name: "Allocate",
        inputs: [
            {
                name: "strategy",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "ControllerDeposit",
        inputs: [
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "ControllerWithdraw",
        inputs: [
            {
                name: "asset",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "receiver",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Deallocate",
        inputs: [
            {
                name: "strategy",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Deposit",
        inputs: [
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "shares",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "SetAutoAllocationThreshold",
        inputs: [
            {
                name: "threshold",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Withdraw",
        inputs: [
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "receiver",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "assets",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "shares",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "error",
        name: "AssetDecimalsTooHigh",
        inputs: []
    },
    {
        type: "error",
        name: "CallerNotController",
        inputs: []
    },
    {
        type: "error",
        name: "CallerNotManager",
        inputs: []
    },
    {
        type: "error",
        name: "MismatchedAsset",
        inputs: []
    },
    {
        type: "error",
        name: "NoDecimals",
        inputs: []
    },
    {
        type: "error",
        name: "ReentrancyGuardReentrantCall",
        inputs: []
    },
    {
        type: "error",
        name: "SafeERC20FailedOperation",
        inputs: [
            {
                name: "token",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "ZeroAsset",
        inputs: []
    },
    {
        type: "error",
        name: "ZeroAssetsOrShares",
        inputs: []
    },
    {
        type: "error",
        name: "ZeroController",
        inputs: []
    },
    {
        type: "error",
        name: "ZeroStrategy",
        inputs: []
    }
] as const;