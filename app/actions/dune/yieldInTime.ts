'use server'

import { fetchDune } from './client'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchYieldInTime() {
  return fetchDune(DUNE_QUERIES.yieldInTime, row => ({
    time: new Date(String(row.time)).toLocaleDateString(),
    yield: (Number(row.yield) / 10 ** CONTRACTS.assets.unit.decimals).toFixed(2),
    total: (Number(row.cum) / 10 ** CONTRACTS.assets.unit.decimals).toFixed(2),
  }))
}
