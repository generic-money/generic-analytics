'use server'

import { getClient } from './client'
import { bridgeCoordinatorL1Abi } from '@/public/abi/BridgeCoordinatorL1.abi'
import { CONTRACTS } from '@/config/constants'

export async function fetchTotalPredeposits(chainNickname: `0x${string}`) {
  return getClient().readContract({
    address: CONTRACTS.ethereum.bridgeCoordinator.address,
    abi: bridgeCoordinatorL1Abi,
    functionName: 'getTotalPredeposits',
    args: [chainNickname],
  }).then(res => Number(res) / 10 ** CONTRACTS.ethereum.assets.unit.decimals)
}

export async function fetchEncodeBridgeMessage(params: { sender: `0x${string}`, recipient: `0x${string}`, sourceWhitelabel: `0x${string}`, destinationWhitelabel: `0x${string}`, amount: bigint }) {
  return getClient().readContract({
    address: CONTRACTS.ethereum.bridgeCoordinator.address,
    abi: bridgeCoordinatorL1Abi,
    functionName: 'encodeBridgeMessage',
    args: [params],
  })
}
