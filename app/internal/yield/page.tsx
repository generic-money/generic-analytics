'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import * as rpc from '@/app/actions/rpc'
import { GENERIC_FEE_PERCENTAGE, CONTRACTS, YIELD_DESTINATIONS, type YieldDestinationKey, type YieldDestination, type YieldDestinationValue } from '@/config/constants'
import { mainnet } from 'viem/chains'
import { citrea } from '@/config/chains/citrea'

interface DestinationBreakdown {
  destination: YieldDestinationValue
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

interface ChainSupplies {
  ethereum: number
  citrea: number
  citreaStaked: number
  citreaUnstaked: number
  status: number
  total: number
}

export default function YieldDistributionCalculator() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<ChainYield[] | null>(null)
  const [totalYield, setTotalYield] = useState<number>(0)
  const [collateralValue, setCollateralValue] = useState<number>(0)
  const [unitSupply, setUnitSupply] = useState<number>(0)
  const [safetyBuffer, setSafetyBuffer] = useState<number>(0)
  const [yieldToDistribute, setYieldToDistribute] = useState<string>('')
  const [chainSupplies, setChainSupplies] = useState<ChainSupplies | null>(null)

  const calculateDestinationBreakdown = (
    key: YieldDestinationKey,
    totalYield: number,
    supply: number,
    otherSupplies: ChainSupplies | null,
  ): DestinationBreakdown[] => {
    const yieldDest = YIELD_DESTINATIONS[key]

    if (!yieldDest.destinations || yieldDest.destinations.length === 0) {
      throw new Error(`Chain ${key} has no destinations defined`)
    }

    // If single destination, it gets 100% of the yield
    if (yieldDest.destinations.length === 1) {
      return [
        {
          destination: yieldDest.destinations[0],
          yieldAmount: totalYield,
          supply: key === 'generic' ? 0 : supply,
          proportion: 100,
        },
      ]
    }

    // Multiple destinations: calculate proportionally based on supply breakdown
    // For Citrea, we need the staked/unstaked breakdown
    if (key == 'citrea' && otherSupplies) {
      const stakedSupply = otherSupplies.citreaStaked
      const unstakedSupply = otherSupplies.citreaUnstaked
      const totalDestSupply = stakedSupply + unstakedSupply

      return yieldDest.destinations.map((dest, idx) => {
        const destSupply = idx === 0 ? stakedSupply : unstakedSupply
        const proportion = totalDestSupply > 0 ? (destSupply / totalDestSupply) * 100 : 0

        return {
          destination: dest,
          yieldAmount: totalDestSupply > 0 ? totalYield * (destSupply / totalDestSupply) : 0,
          supply: destSupply,
          proportion,
        }
      })
    }

    // Default for other multi-destination chains (if any in the future)
    throw new Error(`Multi-destination chain ${key} needs custom breakdown logic`)
  }

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum'
      case 4114: return 'Citrea'
      default: return `Chain ${chainId}`
    }
  }

  const getChainPrefix = (chainId: number) => {
    switch (chainId) {
      case 1: return 'eth:'
      case 4114: return 'citrea-mainnet:'
      default: return `chain-${chainId}:`
    }
  }

  const getGenericFee = (yieldAmount: number) => {
    return yieldAmount * (GENERIC_FEE_PERCENTAGE / 100)
  }

  const getYieldAfterFee = (yieldAmount: number) => {
    return yieldAmount - getGenericFee(yieldAmount)
  }

  const recalculateDistribution = (yieldAmount: number) => {
    if (!chainSupplies) return

    console.log('Recalculating with yield amount:', yieldAmount)

    // Calculate Generic fee (10%) and remaining yield for chains
    const genericFee = getGenericFee(yieldAmount)
    const yieldAfterFee = getYieldAfterFee(yieldAmount)

    const genericFeeChain: ChainYield = {
      key: 'generic',
      supply: 0,
      yieldAmount: genericFee,
      destinations: calculateDestinationBreakdown('generic', genericFee, 0, chainSupplies),
    }

    const otherChains: ChainYield[] = [
      {
        key: 'citrea',
        supply: chainSupplies.citrea,
        yieldAmount: chainSupplies.total > 0 ? (chainSupplies.citrea / chainSupplies.total) * yieldAfterFee : 0,
        destinations: [],
      },
      {
        key: 'status',
        supply: chainSupplies.status,
        yieldAmount: chainSupplies.total > 0 ? (chainSupplies.status / chainSupplies.total) * yieldAfterFee : 0,
        destinations: [],
      },
      {
        key: 'ethereum',
        supply: chainSupplies.ethereum,
        yieldAmount: chainSupplies.total > 0 ? (chainSupplies.ethereum / chainSupplies.total) * yieldAfterFee : 0,
        destinations: [],
      },
    ]

    // Calculate destinations for each chain
    otherChains.forEach(chain => {
      chain.destinations = calculateDestinationBreakdown(chain.key, chain.yieldAmount, chain.supply, chainSupplies)
    })

    // Sort other chains by yield amount (descending)
    otherChains.sort((a, b) => {
      // If both yields are 0, sort by supply instead
      if (a.yieldAmount === 0 && b.yieldAmount === 0) {
        return b.supply - a.supply
      }
      return b.yieldAmount - a.yieldAmount
    })

    // Generic Fee always at top, followed by sorted chains
    const chains = [genericFeeChain, ...otherChains]

    console.log('New chains:', chains)
    // Force a new array reference to ensure React detects the change
    setResults([...chains])
  }

  const handleYieldInput = (value: string) => {
    setYieldToDistribute(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      // Cap at maximum distributable yield
      const cappedValue = Math.min(numValue, totalYield)
      recalculateDistribution(cappedValue)
    } else if (value === '') {
      recalculateDistribution(0)
    } else {
      // Invalid input, recalculate with 0
      recalculateDistribution(0)
    }
  }

  const getDistributedYield = () => {
    const numValue = parseFloat(yieldToDistribute)
    if (!isNaN(numValue) && numValue >= 0) {
      return Math.min(numValue, totalYield)
    }
    return 0
  }

  const getUndistributedYield = () => {
    return totalYield - getDistributedYield()
  }

  const getCurrentCollateralization = () => {
    if (unitSupply === 0) return 0
    return (collateralValue / unitSupply) * 100
  }

  const getCollateralizationAfterDistribution = () => {
    if (unitSupply === 0) return 0
    const remainingCollateral = collateralValue - getDistributedYield()
    return (remainingCollateral / unitSupply) * 100
  }

  const getCollateralizationChange = () => {
    return getCollateralizationAfterDistribution() - getCurrentCollateralization()
  }

  const downloadDistribution = () => {
    if (!results) return

    // Helper function to convert to 18 decimal wei format
    const toWei = (value: number): string => {
      return BigInt(Math.floor(value * 1e18)).toString()
    }

    const distributionData = results.map(chain => ({
      name: YIELD_DESTINATIONS[chain.key].name,
      supply: toWei(chain.supply),
      yieldAmount: toWei(chain.yieldAmount),
      proportion: chainSupplies ? ((chain.supply / chainSupplies.total) * 100).toFixed(18) : '0'
    }))

    const jsonData = {
      timestamp: new Date().toISOString(),
      totalCollateralValue: toWei(collateralValue),
      totalUnitSupply: toWei(unitSupply),
      totalDistributableYield: toWei(totalYield),
      yieldToDistribute: toWei(getDistributedYield()),
      undistributedYield: toWei(getUndistributedYield()),
      chains: distributionData
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `yield-distribution-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const calculateYieldDistribution = async () => {
    setLoading(true)
    try {
      // Fetch all required data in parallel
      const [
        // Vault assets
        usdcTotalAssets,
        usdtTotalAssets,
        usdsTotalAssets,
        // Prices
        usdcPrice,
        usdtPrice,
        usdsPrice,
        // Unit supplies
        ethereumUnitSupply,
        citreaUnitSupply,
        citreaStakedGusdSupply,
        // Predeposits
        statusPredeposits,
        // Safety buffer
        safetyBufferYieldDeduction,
      ] = await Promise.all([
        rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdc),
        rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdt),
        rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usds),

        rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdc),
        rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdt),
        rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usds),

        rpc.fetchTotalSupply(CONTRACTS.ethereum.assets.unit, mainnet),
        rpc.fetchTotalSupply(CONTRACTS.citrea.assets.unit, citrea),
        rpc.fetchTotalSupply(CONTRACTS.citrea.assets.sgusd, citrea),

        rpc.fetchTotalPredeposits(CONTRACTS.ethereum.predeposits.status.nickname),

        rpc.fetchSafetyBufferYieldDeduction(),
      ])

      // Calculate total collateral value in USD
      const totalCollateral =
        usdcTotalAssets * usdcPrice +
        usdtTotalAssets * usdtPrice +
        usdsTotalAssets * usdsPrice

      setCollateralValue(totalCollateral)
      setUnitSupply(ethereumUnitSupply)
      setSafetyBuffer(safetyBufferYieldDeduction)

      // Calculate distributable yield: collateral value - unit supply - safety buffer
      const rawYield = Math.max(0, totalCollateral - ethereumUnitSupply)
      const distributableYield = Math.max(0, rawYield - safetyBufferYieldDeduction)
      setTotalYield(distributableYield)

      // Calculate Ethereum supply (total - other chains)
      const ethereumSupply = ethereumUnitSupply - citreaUnitSupply - statusPredeposits

      // Calculate Citrea breakdown (staked vs unstaked)
      const citreaUnstakedGusdSupply = citreaUnitSupply - citreaStakedGusdSupply

      // Calculate total supply across all chains (should equal total unit supply)
      const totalChainSupply = ethereumSupply + citreaUnitSupply + statusPredeposits

      const supplies = {
        ethereum: ethereumSupply,
        citrea: citreaUnitSupply,
        citreaStaked: citreaStakedGusdSupply,
        citreaUnstaked: citreaUnstakedGusdSupply,
        status: statusPredeposits,
        total: totalChainSupply,
      }

      // Store chain supplies for recalculation
      setChainSupplies(supplies)

      // Calculate yield distribution proportionally to all chains
      const genericFeeChain: ChainYield = {
        key: 'generic',
        supply: 0,
        yieldAmount: 0,
        destinations: calculateDestinationBreakdown('generic', 0, 0, supplies),
      }

      const otherChains: ChainYield[] = [
        {
          key: 'citrea',
          supply: citreaUnitSupply,
          yieldAmount: 0,
          destinations: [],
        },
        {
          key: 'status',
          supply: statusPredeposits,
          yieldAmount: 0,
          destinations: [],
        },
        {
          key: 'ethereum',
          supply: ethereumSupply,
          yieldAmount: 0,
          destinations: [],
        },
      ]

      // Calculate destinations for each chain (all 0 initially)
      otherChains.forEach(chain => {
        chain.destinations = calculateDestinationBreakdown(chain.key, 0, chain.supply, supplies)
      })

      // Sort other chains by yield amount (descending) - all 0 initially, so sort by supply
      otherChains.sort((a, b) => {
        // If both yields are 0, sort by supply instead
        if (a.yieldAmount === 0 && b.yieldAmount === 0) {
          return b.supply - a.supply
        }
        return b.yieldAmount - a.yieldAmount
      })

      // Generic Fee always at top, followed by sorted chains
      const chains = [genericFeeChain, ...otherChains]

      setResults(chains)
    } catch (error) {
      console.error('Error calculating yield distribution:', error)
      alert('Failed to calculate yield distribution. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateYieldDistribution()
  }, [])

  useEffect(() => {
    console.log('Results state updated:', results)
  }, [results])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center py-6 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="w-full my-12 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Yield Distribution Calculator
        </h1>

        {loading ? (
          <div className="w-full p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-400">Fetching yield distribution data...</p>
            </div>
          </div>
        ) : results && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Summary and Input */}
            <div className="space-y-6">
              <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Collateral Value:</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      ${collateralValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Unit Supply:</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {unitSupply.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Safety Buffer Deduction:</span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {safetyBuffer.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-300 dark:border-zinc-700">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Total Distributable Yield:</span>
                    <span className="font-mono font-bold text-green-600 dark:text-green-400">
                      ${totalYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <label htmlFor="yieldInput" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Yield to Distribute ($)
                </label>
                <input
                  id="yieldInput"
                  type="number"
                  step="1"
                  min="0"
                  max={totalYield}
                  value={yieldToDistribute}
                  onChange={(e) => handleYieldInput(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Enter the amount of yield to distribute. Maximum: ${totalYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  Note: {GENERIC_FEE_PERCENTAGE}% protocol fee is collected before distribution to chains
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Yield to Distribute:</span>
                    <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      ${getDistributedYield().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Undistributed Yield:</span>
                    <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      ${getUndistributedYield().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Collateralization:</span>
                    <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {getCurrentCollateralization().toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">After Distribution:</span>
                    <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {getCollateralizationAfterDistribution().toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Change:</span>
                    <span className={`text-sm font-mono font-semibold ${getCollateralizationChange() < 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {getCollateralizationChange() < 0 ? '' : '+'}{getCollateralizationChange().toFixed(4)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={downloadDistribution}
                  disabled={getDistributedYield() === 0}
                  className="mt-4 w-full px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-900 dark:disabled:hover:bg-zinc-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Distribution (JSON)
                </button>
              </div>
            </div>

            {/* Right Column - Yield Distribution Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Yield Distribution</h2>
              {results.map((chain) => (
                <div
                  key={YIELD_DESTINATIONS[chain.key].name}
                  className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    {YIELD_DESTINATIONS[chain.key].name}
                  </h3>
                  <div className="space-y-2">
                    {chain.key !== 'generic' && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Chain Supply:</span>
                        <span className="font-mono text-zinc-900 dark:text-zinc-100">
                          {chain.supply.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Yield Amount:</span>
                      <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                        ${chain.yieldAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {chainSupplies && chainSupplies.total > 0 && chain.key !== 'generic' && (
                      <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800">
                        <span className="text-sm text-zinc-500 dark:text-zinc-500">Proportion:</span>
                        <span className="text-sm font-mono text-zinc-500 dark:text-zinc-500">
                          {((chain.supply / chainSupplies.total) * 100).toFixed(2)}%
                        </span>
                      </div>
                    )}

                    {/* Distribution Breakdown - Consistent for all chains */}
                    {chain.destinations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-700 space-y-3">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Distribution Breakdown</h4>

                        <div className="pl-3 space-y-3">
                          {chain.destinations.map((breakdown, idx) => {
                            const destination = breakdown.destination
                            const colors = [
                              'text-blue-600 dark:text-blue-400',
                              'text-purple-600 dark:text-purple-400',
                              'text-green-600 dark:text-green-400',
                              'text-orange-600 dark:text-orange-400'
                            ]
                            const colorClass = colors[idx % colors.length]

                            return (
                              <div key={destination.id} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{destination.name}:</span>
                                  <span className={`text-sm font-mono font-semibold ${colorClass}`}>
                                    ${breakdown.yieldAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                                {/* Only show supply and proportion if there are multiple destinations */}
                                {chain.destinations.length > 1 && breakdown.supply !== undefined && breakdown.proportion !== undefined && (
                                  <>
                                    <div className="flex justify-between text-xs mb-0.5">
                                      <span className="text-zinc-500 dark:text-zinc-500">Supply:</span>
                                      <span className="font-mono text-zinc-500 dark:text-zinc-500">
                                        {breakdown.supply.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                      <span className="text-zinc-500 dark:text-zinc-500">Proportion:</span>
                                      <span className="font-mono text-zinc-500 dark:text-zinc-500">
                                        {breakdown.proportion.toFixed(2)}%
                                      </span>
                                    </div>
                                  </>
                                )}
                                <div className={`${chain.destinations.length > 1 ? 'pt-2 border-t border-zinc-200 dark:border-zinc-700' : ''} space-y-1`}>
                                  <div className="flex items-start text-xs">
                                    <span className="text-zinc-500 dark:text-zinc-500 mr-1 font-semibold">{getChainPrefix(YIELD_DESTINATIONS[chain.key].chainId)}</span>
                                    <span className="font-mono text-zinc-500 dark:text-zinc-500 break-all flex-1">
                                      {destination.address}
                                    </span>
                                  </div>
                                  {YIELD_DESTINATIONS[chain.key].chainId !== 1 && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      <span>Bridge to {getChainName(YIELD_DESTINATIONS[chain.key].chainId)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="w-full mt-auto pt-8 pb-4 flex items-center justify-center border-t border-zinc-200 dark:border-zinc-800">
          <Image
            src="/img/generic-logo-black.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
            className="block dark:hidden"
          />
          <Image
            src="/img/generic-logo-white.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
            className="hidden dark:block"
          />
        </footer>
      </main>
    </div>
  )
}
