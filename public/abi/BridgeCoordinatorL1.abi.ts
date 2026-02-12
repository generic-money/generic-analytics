export const bridgeCoordinatorL1Abi = [
      {
        type: "function",
        name: "ADAPTER_MANAGER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "EMERGENCY_MANAGER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "PREDEPOSIT_MANAGER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "bridge",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "onBehalf",
                type: "address",
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "sourceWhitelabel",
                type: "address",
                internalType: "address"
            },
            {
                name: "destinationWhitelabel",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "bridgeParams",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        outputs: [
            {
                name: "messageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        name: "bridgePredeposit",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "owner",
                type: "address",
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "bridgeParams",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        outputs: [
            {
                name: "messageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        name: "decodeOmnichainAddress",
        inputs: [
            {
                name: "oAddr",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "pure"
    },
    {
        type: "function",
        name: "enablePredeposits",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "enablePredepositsDispatch",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "whitelabel",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "enablePredepositsWithdraw",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "encodeBridgeMessage",
        inputs: [
            {
                name: "message",
                type: "tuple",
                internalType: "struct BridgeMessage",
                components: [
                    {
                        name: "sender",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "recipient",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "sourceWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "destinationWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "amount",
                        type: "uint256",
                        internalType: "uint256"
                    }
                ]
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        stateMutability: "pure"
    },
    {
        type: "function",
        name: "encodeOmnichainAddress",
        inputs: [
            {
                name: "addr",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "pure"
    },
    {
        type: "function",
        name: "failedMessageExecutions",
        inputs: [
            {
                name: "messageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "messageHash",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "forceRemoveLocalBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "forceRemoveRemoteBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "genericUnit",
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
        name: "getChainIdForNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
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
        name: "getChainPredepositState",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "uint8",
                internalType: "enum PredepositCoordinator.PredepositState"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getPredeposit",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "sender",
                type: "address",
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                internalType: "bytes32"
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
        name: "getRoleAdmin",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getTotalPredeposits",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
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
        name: "getWhitelabelForNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "grantRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "hasRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "initialize",
        inputs: [
            {
                name: "_genericUnit",
                type: "address",
                internalType: "address"
            },
            {
                name: "_admin",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "isLocalBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "isRemoteBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "nonce",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint64",
                internalType: "uint64"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "outboundLocalBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            }
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IBridgeAdapter"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "outboundRemoteBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "predeposit",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "onBehalf",
                type: "address",
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "renounceRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "callerConfirmation",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "revokeRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "rollback",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "originalChainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "originalMessageData",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "originalMessageId",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "bridgeParams",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        outputs: [
            {
                name: "rollbackMessageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "payable"
    },
    {
        type: "function",
        name: "setChainIdToNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setIsLocalBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                internalType: "contract IBridgeAdapter"
            },
            {
                name: "isAdapter",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setIsRemoteBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "isAdapter",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setOutboundLocalBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                internalType: "contract IBridgeAdapter"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setOutboundRemoteBridgeAdapter",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setWhitelabelForNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "whitelabel",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "settleInboundMessage",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "remoteSender",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "messageData",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "messageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "supportsBridgeTypeFor",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "supportsInterface",
        inputs: [
            {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "trySettleInboundMessage",
        inputs: [
            {
                name: "messageData",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "messageId",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "withdrawPredeposit",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "recipient",
                type: "address",
                internalType: "address"
            },
            {
                name: "whitelabel",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "event",
        name: "BridgeRollbackedOut",
        inputs: [
            {
                name: "rollbackedMessageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "BridgedIn",
        inputs: [
            {
                name: "remoteSender",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "recipient",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageData",
                type: "tuple",
                indexed: false,
                internalType: "struct BridgeMessage",
                components: [
                    {
                        name: "sender",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "recipient",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "sourceWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "destinationWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "amount",
                        type: "uint256",
                        internalType: "uint256"
                    }
                ]
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "BridgedOut",
        inputs: [
            {
                name: "sender",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageData",
                type: "tuple",
                indexed: false,
                internalType: "struct BridgeMessage",
                components: [
                    {
                        name: "sender",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "recipient",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "sourceWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "destinationWhitelabel",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "amount",
                        type: "uint256",
                        internalType: "uint256"
                    }
                ]
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "ChainIdAssignedToNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "chainId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Initialized",
        inputs: [
            {
                name: "version",
                type: "uint64",
                indexed: false,
                internalType: "uint64"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "LocalBridgeAdapterUpdated",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "isAdapter",
                type: "bool",
                indexed: false,
                internalType: "bool"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "LocalOutboundBridgeAdapterUpdated",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "adapter",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "MessageExecutionFailed",
        inputs: [
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "MessageIn",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "srcChainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageData",
                type: "bytes",
                indexed: false,
                internalType: "bytes"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "MessageOut",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "destChainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageData",
                type: "bytes",
                indexed: false,
                internalType: "bytes"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "PredepositBridgedOut",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "messageId",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "PredepositStateChanged",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "newState",
                type: "uint8",
                indexed: false,
                internalType: "enum PredepositCoordinator.PredepositState"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "PredepositWithdrawn",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "recipient",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Predeposited",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "sender",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "remoteRecipient",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RemoteBridgeAdapterUpdated",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "isAdapter",
                type: "bool",
                indexed: false,
                internalType: "bool"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RemoteOutboundBridgeAdapterUpdated",
        inputs: [
            {
                name: "bridgeType",
                type: "uint16",
                indexed: true,
                internalType: "uint16"
            },
            {
                name: "chainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "adapter",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleGranted",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleRevoked",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "WhitelabelAssignedToNickname",
        inputs: [
            {
                name: "chainNickname",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "whitelabel",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "error",
        name: "AccessControlBadConfirmation",
        inputs: []
    },
    {
        type: "error",
        name: "AccessControlUnauthorizedAccount",
        inputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            },
            {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidAmount",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidFailedMessageData",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidMessageType",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidOnBehalf",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidRecipient",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_InvalidRemoteRecipient",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_NoFailedMessageExecution",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeMessage_NoSenderToRollback",
        inputs: []
    },
    {
        type: "error",
        name: "BridgeTypeMismatch",
        inputs: []
    },
    {
        type: "error",
        name: "CallerNotSelf",
        inputs: []
    },
    {
        type: "error",
        name: "CoordinatorMismatch",
        inputs: []
    },
    {
        type: "error",
        name: "IncorrectEscrowBalance",
        inputs: []
    },
    {
        type: "error",
        name: "InvalidInitialization",
        inputs: []
    },
    {
        type: "error",
        name: "IsNotAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "IsOutboundAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "NoOutboundLocalBridgeAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "NoOutboundRemoteBridgeAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "NotInitializing",
        inputs: []
    },
    {
        type: "error",
        name: "OnlyLocalAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "OnlyRemoteAdapter",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ChainIdAlreadySet",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ChainIdZero",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_DispatchNotEnabled",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_InvalidStateTransition",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_NotEnabled",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_WithdrawalsNotEnabled",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ZeroAmount",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ZeroOnBehalf",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ZeroRecipient",
        inputs: []
    },
    {
        type: "error",
        name: "Predeposit_ZeroRemoteRecipient",
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
        name: "UnsupportedMessageType",
        inputs: [
            {
                name: "messageType",
                type: "uint8",
                internalType: "uint8"
            }
        ]
    },
    {
        type: "error",
        name: "ZeroAdmin",
        inputs: []
    },
    {
        type: "error",
        name: "ZeroGenericUnit",
        inputs: []
    }
] as const;