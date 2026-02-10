'use server'

import { VaultContract } from '@/app/types/vaults'

export async function fetchMerkleRewards(vault: VaultContract) {
  return fetch(`https://api.merkl.xyz/v4/users/${vault.address}/rewards?chainId=1&breakdownPage=0`)
    .then(res => res.json())
    .then(data => data.find((entry: any) => entry.chain.id == 1)?.rewards || [])
    .then(rewards => rewards.map((reward: any) => ({
      amount: reward.amount / (10 ** reward.token.decimals),
      pending: reward.pending,
      token: {
        symbol: reward.token.symbol,
        decimals: reward.token.decimals,
        price: reward.token.price,
      }
    })))
}
