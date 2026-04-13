'use server'

import { encodeFunctionData, Address, parseUnits } from 'viem'
import { controllerAbi } from '@/public/abi/Controller.abi'
import { genericUSDAbi } from '@/public/abi/GenericUSD.abi'
import { bridgeCoordinatorL1Abi } from '@/public/abi/BridgeCoordinatorL1.abi'
import { BridgeAdapter, CONTRACTS, YIELD_DESTINATIONS, type YieldDestinationKey } from '@/config/constants'
import { fetchEstimateBridgeFee } from '@/app/actions/rpc/bridgeAdapter'
import { fetchEncodeBridgeMessage } from '@/app/actions/rpc/bridgeCoordinator'

export interface TxBuilderTransaction {
  to: Address
  value: number
  data: string
}

interface DestinationBreakdown {
  destination: {
    id: string
    name: string
    address: string
  }
  yieldAmount: number
  supply: number
  proportion: number
}

interface ChainYield {
  key: YieldDestinationKey
  supply: number
  yieldAmount: number
  destinations: DestinationBreakdown[]
}

interface YieldTargetRow {
  chainKey: YieldDestinationKey
  chainName: string
  chainId: number
  destinationName: string
  destinationAddress: string
  yieldAmount: number
}

interface YieldDistributionArtifacts {
  yieldTargets: YieldTargetRow[]
  ethereumDestinations: { address: Address; amount: bigint }[]
  peripheryTargetsByChain: Map<YieldDestinationKey, { address: Address; amount: bigint }[]>
  bridgeAmountsByChain: Map<number, bigint>
  bridgeRecipientsByChain: Map<number, string>
  bridgeByChain: Map<number, BridgeAdapter>
  destinationWhitelabelsByChain: Map<number, string>
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Converts decimal USD values to 18-decimal wei amount for tx payloads.
const toWei = (value: number): bigint => {
  return parseUnits(value.toFixed(18), 18)
}

function buildYieldDistributionArtifacts(yieldResults: ChainYield[]): YieldDistributionArtifacts {
  const yieldTargets: YieldTargetRow[] = []
  const ethereumDestinations: { address: Address; amount: bigint }[] = []
  const peripheryTargetsByChain = new Map<YieldDestinationKey, { address: Address; amount: bigint }[]>()
  const bridgeAmountsByChain = new Map<number, bigint>()
  const bridgeRecipientsByChain = new Map<number, string>()
  const bridgeByChain = new Map<number, BridgeAdapter>()
  const destinationWhitelabelsByChain = new Map<number, string>()

  for (const chain of yieldResults) {
    const yieldDest = YIELD_DESTINATIONS[chain.key]
    const chainTargets: { address: Address; amount: bigint }[] = []

    for (const dest of chain.destinations) {
      yieldTargets.push({
        chainKey: chain.key,
        chainName: yieldDest.name,
        chainId: yieldDest.chainId,
        destinationName: dest.destination.name,
        destinationAddress: dest.destination.address,
        yieldAmount: dest.yieldAmount,
      })

      const hasValidAddress = dest.destination.address !== ZERO_ADDRESS
      if (!hasValidAddress || dest.yieldAmount <= 0) {
        continue
      }

      const amount = toWei(dest.yieldAmount)
      chainTargets.push({
        address: dest.destination.address as Address,
        amount,
      })

      if (yieldDest.chainId === 1 && dest.destination.address !== CONTRACTS.ethereum.dao.address) {
        ethereumDestinations.push({
          address: dest.destination.address as Address,
          amount,
        })
      }
    }

    if (chainTargets.length > 0) {
      peripheryTargetsByChain.set(chain.key, chainTargets)
    }

    if (yieldDest.chainId === 1 || chainTargets.length === 0) {
      continue
    }

    if (!yieldDest.distributor) {
      throw new Error(`Chain ${yieldDest.name} (${yieldDest.chainId}): No distributor configured for non-Ethereum chain`)
    }
    if (!yieldDest.distributor.address || yieldDest.distributor.bridge === undefined) {
      throw new Error(`Chain ${yieldDest.name} (${yieldDest.chainId}): Distributor is configured but missing address or bridgeType`)
    }
    if (!yieldDest.distributor.whitelabel?.address) {
      throw new Error(`Chain ${yieldDest.name} (${yieldDest.chainId}): Distributor is configured but missing whitelabel address`)
    }

    bridgeRecipientsByChain.set(yieldDest.chainId, yieldDest.distributor.address)
    bridgeByChain.set(yieldDest.chainId, yieldDest.distributor.bridge)
    destinationWhitelabelsByChain.set(yieldDest.chainId, yieldDest.distributor.whitelabel.address)

    const totalChainAmount = chainTargets.reduce((sum, target) => sum + target.amount, BigInt(0))
    if (totalChainAmount > BigInt(0)) {
      const existing = bridgeAmountsByChain.get(yieldDest.chainId) || BigInt(0)
      bridgeAmountsByChain.set(yieldDest.chainId, existing + totalChainAmount)
    }
  }

  return {
    yieldTargets,
    ethereumDestinations,
    peripheryTargetsByChain,
    bridgeAmountsByChain,
    bridgeRecipientsByChain,
    bridgeByChain,
    destinationWhitelabelsByChain,
  }
}

/**
 * Estimates the bridge fee for a given chain and amount
 */
async function estimateBridgeFee(
  bridge: BridgeAdapter,
  chainId: number,
  amount: bigint,
  sender: `0x${string}`,
  remoteRecipient: `0x${string}`,
  sourceWhitelabel: `0x${string}`,
  destinationWhitelabel: `0x${string}`
): Promise<bigint> {
  const bridgeAdapterAddress = bridge.address.ethereum as `0x${string}`

  const message = await fetchEncodeBridgeMessage({
    sender: sender,
    recipient: remoteRecipient,
    sourceWhitelabel: sourceWhitelabel,
    destinationWhitelabel: destinationWhitelabel,
    amount
  })

  // Estimate the fee
  const fee = await fetchEstimateBridgeFee(bridgeAdapterAddress, {
    chainId: BigInt(chainId),
    message,
    bridgeParams: '0x' as `0x${string}`
  })

  return fee
}

export async function buildYieldDistributionTxBatch(
  yieldResults: ChainYield[],
  totalYield: number,
  distributingYield: number,
  existingSafetyBuffer: number,
  artifacts?: YieldDistributionArtifacts
): Promise<TxBuilderTransaction[]> {
  const transactions: TxBuilderTransaction[] = []
  const computedArtifacts = artifacts ?? buildYieldDistributionArtifacts(yieldResults)

  // Preserve existing buffer and add the undistributed remainder.
  const newSafetyBufferYieldDeduction = existingSafetyBuffer + (totalYield - distributingYield)

  // 1. Set safety buffer: existing buffer + (distributable - distributing)
  transactions.push({
    to: CONTRACTS.ethereum.controller.address,
    value: 0,
    data: encodeFunctionData({
      abi: controllerAbi,
      functionName: 'setSafetyBufferYieldDeduction',
      args: [toWei(newSafetyBufferYieldDeduction)]
    })
  })

  // 2. Distribute yield on controller
  transactions.push({
    to: CONTRACTS.ethereum.controller.address,
    value: 0,
    data: encodeFunctionData({
      abi: controllerAbi,
      functionName: 'distributeYield',
      args: []
    })
  })

  // 3. Aprove unit tokens GUSD
  transactions.push({
    to: CONTRACTS.ethereum.assets.unit.address,
    value: 0,
    data: encodeFunctionData({
      abi: genericUSDAbi,
      functionName: 'approve',
      args: [CONTRACTS.ethereum.assets.gusd.address, toWei(distributingYield)]
    })
  })

  // 4. Wrap unit tokens into GUSD
  transactions.push({
    to: CONTRACTS.ethereum.assets.gusd.address,
    value: 0,
    data: encodeFunctionData({
      abi: genericUSDAbi,
      functionName: 'wrap',
      args: [CONTRACTS.ethereum.dao.address, toWei(distributingYield)]
    })
  })

  // 5. Build list of Ethereum destinations (direct transfers)
  // Add transfer transactions for Ethereum destinations
  for (const dest of computedArtifacts.ethereumDestinations) {
    transactions.push({
      to: CONTRACTS.ethereum.assets.gusd.address,
      value: 0,
      data: encodeFunctionData({
        abi: genericUSDAbi,
        functionName: 'transfer',
        args: [dest.address, dest.amount]
      })
    })
  }

  // 6. Build list of bridge transactions (grouped by chain)
  // Note: Multiple destinations on the same chain are merged into a single bridge transaction
  // If a chain has a periphery distributor configured, bridge to that distributor address
  // Otherwise, bridge to the first destination on that chain

  // Approve GUSD to the bridge coordinator for the total amount being bridged across all chains
  const totalBridgeAmount = [...computedArtifacts.bridgeAmountsByChain.values()].reduce(
    (sum, amount) => sum + amount,
    BigInt(0)
  )
  if (totalBridgeAmount > BigInt(0)) {
    transactions.push({
      to: CONTRACTS.ethereum.assets.gusd.address,
      value: 0,
      data: encodeFunctionData({
        abi: genericUSDAbi,
        functionName: 'approve',
        args: [CONTRACTS.ethereum.bridgeCoordinator.address, totalBridgeAmount]
      })
    })
  }

  // Add bridge transactions with estimated fees
  for (const [chainId, amount] of computedArtifacts.bridgeAmountsByChain.entries()) {
    const remoteRecipient = computedArtifacts.bridgeRecipientsByChain.get(chainId)
    const bridge = computedArtifacts.bridgeByChain.get(chainId)
    const destinationWhitelabel = computedArtifacts.destinationWhitelabelsByChain.get(chainId)

    if (!remoteRecipient) {
      throw new Error(`No recipient found for chain ${chainId}`)
    }

    if (bridge === undefined) {
      throw new Error(`No bridge found for chain ${chainId}`)
    }

    if (!destinationWhitelabel) {
      throw new Error(`No destination whitelabel found for chain ${chainId}`)
    }

    // Convert address to bytes32 (pad left with zeros)
    const senderBytes32 = `0x${CONTRACTS.ethereum.dao.address.slice(2).padStart(64, '0')}` as `0x${string}`
    const remoteRecipientBytes32 = `0x${remoteRecipient.slice(2).padStart(64, '0')}` as `0x${string}`
    const sourceWhitelabelBytes32 = `0x${CONTRACTS.ethereum.assets.gusd.address.slice(2).padStart(64, '0')}` as `0x${string}`
    const destinationWhitelabelBytes32 = `0x${destinationWhitelabel.slice(2).padStart(64, '0')}` as `0x${string}`

    // Estimate bridge fee
    const bridgeFee = await estimateBridgeFee(
      bridge,
      chainId,
      amount,
      senderBytes32,
      remoteRecipientBytes32,
      sourceWhitelabelBytes32,
      destinationWhitelabelBytes32
    )

    // Note: When a distributor is configured, the bridge sends funds to the distributor contract
    // on the remote chain, which then handles distribution to final destinations.
    const bridgeData = encodeFunctionData({
      abi: bridgeCoordinatorL1Abi,
      functionName: 'bridge',
      args: [
        bridge.id, // use configured bridgeType from distributor
        BigInt(chainId),
        CONTRACTS.ethereum.dao.address, // onBehalf
        remoteRecipientBytes32, // yield distributor
        CONTRACTS.ethereum.assets.gusd.address, // sourceWhitelabel
        destinationWhitelabelBytes32, // destinationWhitelabel from yield destination config
        amount,
        '0x' as `0x${string}` // empty bridgeParams
      ]
    })

    transactions.push({
      to: CONTRACTS.ethereum.bridgeCoordinator.address,
      value: Number(bridgeFee), // Add estimated bridge fee in wei
      data: bridgeData
    })
  }

  return transactions
}

/**
 * Builds yield distribution transactions and returns them (to be downloaded on client)
 */
export async function buildYieldDistributionTxs(
  yieldResults: ChainYield[],
  totalYield: number,
  distributingYield: number,
  existingSafetyBuffer: number
): Promise<TxBuilderTransaction[]> {
  const artifacts = buildYieldDistributionArtifacts(yieldResults)
  return buildYieldDistributionTxBatch(yieldResults, totalYield, distributingYield, existingSafetyBuffer, artifacts)
}

/**
 * Builds yield report markdown and returns it (to be downloaded on client)
 */
export async function getYieldReport(
  yieldResults: ChainYield[],
  distributingYield: number
): Promise<string> {
  const distributingYieldWei = toWei(distributingYield)
  const artifacts = buildYieldDistributionArtifacts(yieldResults)
  const lines: string[] = []
  lines.push('# Yield Report')
  lines.push('')
  lines.push(`Generated At: ${new Date().toISOString()}`)
  lines.push('')
  lines.push(`Distributing Yield (wei): ${distributingYieldWei.toString()}`)
  lines.push('')
  lines.push('| Chain | Chain ID | Target | Address | Yield | Yield (wei) |')
  lines.push('| --- | --- | --- | --- | ---: | ---: |')

  for (const target of artifacts.yieldTargets) {
    lines.push(
      `| ${target.chainName} | ${target.chainId} | ${target.destinationName} | ${target.destinationAddress} | ${target.yieldAmount.toFixed(2)} | ${toWei(target.yieldAmount).toString()} |`
    )
  }

  return lines.join('\n')
}
