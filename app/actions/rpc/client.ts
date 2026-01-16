import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const client = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: mainnet,
  transport: http(),
})
