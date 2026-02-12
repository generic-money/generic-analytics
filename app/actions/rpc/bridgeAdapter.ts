'use server'

import { getClient } from './client'
import { bridgeAdapterAbi } from '@/public/abi/BridgeAdapter.abi'

export async function fetchEstimateBridgeFee(adapter: `0x${string}`, params: { chainId: bigint, message: `0x${string}`, bridgeParams: `0x${string}` }) {
  return getClient().readContract({
    address: adapter,
    abi: bridgeAdapterAbi,
    functionName: 'estimateBridgeFee',
    args: [params.chainId, params.message, params.bridgeParams],
  })
}
