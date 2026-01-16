'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchUnitsInTime() {
  return fetchDune(DUNE_QUERIES.unitsInTime, row => ({
    time: new Date(String(row.time)).toLocaleDateString(),
    units: Number(row.cum) / 10 ** CONTRACTS.assets.unit.decimals,
  }))
}
