import { Chain, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export function getClient(chain: Chain = mainnet) {
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: chain,
    transport: http(chain.id == 1 ? 'https://ethereum.publicnode.com' : chain.rpcUrls.default.http[0]),
  })
}
