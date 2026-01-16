'use server'

import { fetchDune } from './client'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchPredepositsInTime() {
  return fetchDune(DUNE_QUERIES.predepositsInTime, row => ({
    time: new Date(String(row.time)).toLocaleDateString(),
    chainNickname: row.chainNickname,
    amount: (Number(row.amount) / 10 ** CONTRACTS.assets.unit.decimals).toFixed(2),
    total: (Number(row.total) / 10 ** CONTRACTS.assets.unit.decimals).toFixed(2),
  }))
}
