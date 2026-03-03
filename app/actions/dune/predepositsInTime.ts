'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchPredepositsInTime() {
  return fetchDune(DUNE_QUERIES.predepositsInTime, row => ({
    time: String(row.time),
    chainNickname: row.chainNickname,
    amount: Number(row.amount) / 10 ** CONTRACTS.ethereum.assets.unit.decimals,
    total: Number(row.total) / 10 ** CONTRACTS.ethereum.assets.unit.decimals,
  }))
}
