'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchDepositsInTime() {
  return fetchDune(DUNE_QUERIES.depositsInTime, row => ({
    time: row.time,
    usdc: Number(row.usdc) / 10 ** CONTRACTS.ethereum.assets.usdc.decimals,
    usdt: Number(row.usdt) / 10 ** CONTRACTS.ethereum.assets.usdt.decimals,
    usds: Number(row.usds) / 10 ** CONTRACTS.ethereum.assets.usds.decimals,
  }))
}
