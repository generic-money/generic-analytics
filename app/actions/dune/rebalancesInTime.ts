'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchRebalancesInTime() {
  return fetchDune(DUNE_QUERIES.rebalancesInTime, row => ({
    time: row.time,
    fromVault: row.fromVault,
    toVault: row.toVault,
    fromAmount: Number(row.fromAmount) / 10 ** getVaultDecimals(row.fromVault),
    toAmount: Number(row.toAmount) / 10 ** getVaultDecimals(row.toVault),
  }))
}

function getVaultDecimals(vault: `0x${string}`) {
  switch (vault) {
    case CONTRACTS.ethereum.vaults.usdc.address:
      return CONTRACTS.ethereum.vaults.usdc.decimals
    case CONTRACTS.ethereum.vaults.usdt.address:
      return CONTRACTS.ethereum.vaults.usdt.decimals
    case CONTRACTS.ethereum.vaults.usds.address:
      return CONTRACTS.ethereum.vaults.usds.decimals
    default:
      return 0
  }
}
