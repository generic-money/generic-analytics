import { encodeFunctionData, Address } from 'viem'
import { controllerAbi } from '@/public/abi/Controller.abi'
import { CONTRACTS } from '@/config/constants'
import { VaultKey } from '@/app/types/vaults'

export interface SellRewardsTransaction {
  to: Address
  value: number
  data: string
}

interface OneInchSwapResponse {
  tx: {
    data: string
  }
  dstAmount: string
}

/**
 * Fetches swap data from 1inch API
 */
async function fetch1inchSwapData(
  srcToken: Address,
  dstToken: Address,
  amount: bigint,
): Promise<OneInchSwapResponse> {
  const apiUrl = new URL('https://api.1inch.com/swap/v6.1/1/swap')
  apiUrl.searchParams.set('src', srcToken)
  apiUrl.searchParams.set('dst', dstToken)
  apiUrl.searchParams.set('amount', amount.toString())
  apiUrl.searchParams.set('from', '0x0000000000000000000000000000000000000000')
  apiUrl.searchParams.set('origin', '0x0000000000000000000000000000000000000000')
  apiUrl.searchParams.set('slippage', '1')
  apiUrl.searchParams.set('disableEstimate', 'true')

  const response = await fetch(apiUrl.toString(), {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`
    }
  })

  if (!response.ok) {
    throw new Error(`1inch API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Builds a transaction to sell rewards from a vault
 */
export async function buildSellRewardsTx(
  rewardTokenAddress: Address,
  vaultAddress: Address,
  rewardAmount: bigint,
  destinationToken: Address,
): Promise<SellRewardsTransaction[]> {
  // Fetch swap data from 1inch
  const swapData = await fetch1inchSwapData(
    rewardTokenAddress,
    destinationToken,
    rewardAmount,
  )

  const txData = encodeFunctionData({
    abi: controllerAbi,
    functionName: 'sellRewards',
    args: [
      rewardTokenAddress,
      vaultAddress,
      BigInt(swapData.dstAmount),
      swapData.tx.data as `0x${string}`,
    ]
  })

  return [
    {
      to: CONTRACTS.ethereum.controller.address,
      data: txData,
      value: 0
    }
  ]
}

/**
 * Downloads a transaction as a JSON file
 */
export function downloadTransactionJson(
  transactions: SellRewardsTransaction[],
  vaultKey: VaultKey
): void {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sell-rewards-${vaultKey}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Builds and downloads a sell rewards transaction
 */
export async function buildAndDownloadSellTx(
  rewardTokenAddress: Address,
  vaultAddress: Address,
  vaultKey: VaultKey,
  rewardAmount: bigint,
  destinationToken: Address,
): Promise<void> {
  const transaction = await buildSellRewardsTx(
    rewardTokenAddress,
    vaultAddress,
    rewardAmount,
    destinationToken,
  )
  downloadTransactionJson(transaction, vaultKey)
}
