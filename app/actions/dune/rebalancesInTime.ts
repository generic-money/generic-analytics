'use server'

import { fetchDune } from './client'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchRebalancesInTime() {
  return fetchDune(DUNE_QUERIES.rebalancesInTime, row => ({
    time: new Date(String(row.time)).toLocaleDateString(),
    fromVault: row.fromVault,
    toVault: row.toVault,
    fromAmount: (Number(row.fromAmount) / 10 ** getVaultDecimals(row.fromVault)).toFixed(2),
    toAmount: (Number(row.toAmount) / 10 ** getVaultDecimals(row.toVault)).toFixed(2),
  }))
}

function getVaultDecimals(vault: `0x${string}`) {
  switch (vault) {
    case CONTRACTS.vaults.usdc.address:
      return CONTRACTS.vaults.usdc.decimals
    case CONTRACTS.vaults.usdt.address:
      return CONTRACTS.vaults.usdt.decimals
    case CONTRACTS.vaults.usds.address:
      return CONTRACTS.vaults.usds.decimals
    default:
      return 0
  }
}
