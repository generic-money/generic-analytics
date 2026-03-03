'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchYieldInTime() {
  return fetchDune(DUNE_QUERIES.yieldInTime, row => ({
    time: String(row.time),
    yield: Number(row.yield) / 10 ** CONTRACTS.ethereum.assets.unit.decimals,
    total: Number(row.cum) / 10 ** CONTRACTS.ethereum.assets.unit.decimals,
  }))
}
