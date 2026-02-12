export const bridgeAdapterAbi = [
  {
    type: "function",
    name: "bridge",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "remoteAdapter",
        type: "bytes32",
        internalType: "bytes32"
      },
      {
        name: "message",
        type: "bytes",
        internalType: "bytes"
      },
      {
        name: "refundAddress",
        type: "address",
        internalType: "address"
      },
      {
        name: "bridgeParams",
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
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "bridgeCoordinator",
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
    name: "bridgeType",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "estimateBridgeFee",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "message",
        type: "bytes",
        internalType: "bytes"
      },
      {
        name: "bridgeParams",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    outputs: [
      {
        name: "nativeFee",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  }
] as const;
