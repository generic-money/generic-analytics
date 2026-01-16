'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchDepositsInTime() {
  return fetchDune(DUNE_QUERIES.depositsInTime, row => ({
    time: new Date(String(row.time)).toLocaleDateString(),
    usdc: Number(row.usdc) / 10 ** CONTRACTS.assets.usdc.decimals,
    usdt: Number(row.usdt) / 10 ** CONTRACTS.assets.usdt.decimals,
    usds: Number(row.usds) / 10 ** CONTRACTS.assets.usds.decimals,
  }))
}
