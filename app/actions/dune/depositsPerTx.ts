'use server'

import { fetchDune } from './fetchDune'
import { DUNE_QUERIES, CONTRACTS } from '@/config/constants'

export async function fetchDepositsPerTx() {
  return fetchDune(DUNE_QUERIES.depositsPerTx, row => ({
    tx: String(row.tx),
    time: new Date(String(row.time)).toLocaleString(),
    usdc: Number(row.usdc) / 10 ** CONTRACTS.ethereum.assets.usdc.decimals,
    usdt: Number(row.usdt) / 10 ** CONTRACTS.ethereum.assets.usdt.decimals,
    usds: Number(row.usds) / 10 ** CONTRACTS.ethereum.assets.usds.decimals,
  }))
}
