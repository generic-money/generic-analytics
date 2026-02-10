'use server'

import { VaultContract } from '@/app/types/vaults'

export async function fetchMorphoVaultV1(vault: VaultContract) {
  return fetch('https://api.morpho.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
      query {
        vaultByAddress(
          address: "${vault.strategy.address}"
          chainId: 1
        ) {
          address
          state {
            avgNetApy
          }
          liquidity {
            underlying
          }
        }
      }`
    }),
  })
  .then(res => res.json())
}
