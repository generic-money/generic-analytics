import * as dune from '../actions/dune'
import * as rpc from '../actions/rpc'

import ChangeInTimeBar from '../components/ChangeInTimeBar'
import UnitsInTimeLine from '../components/UnitsInTimeLine'
import VaultItem from '../components/VaultItem'
import { CONTRACTS } from '../../config/constants'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [
    // assets
    unitTotalSupply,
    // usdcVaultBalance,
    // usdtVaultBalance,
    // usdsVaultBalance,
    // vaults
    usdcTotalAssets,
    usdtTotalAssets,
    usdsTotalAssets,
    // usdcVaultAutoDepositThreshold,
    // usdtVaultAutoDepositThreshold,
    // usdsVaultAutoDepositThreshold,
    // usdcAdditionalAvailableAssets,
    // usdtAdditionalAvailableAssets,
    // usdsAdditionalAvailableAssets,
    // controller
    // usdcVaultSettings,
    // usdtVaultSettings,
    // usdsVaultSettings,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
    // bridgeCoordinator
    totalPredeposits,
] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.assets.unit),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usdc, CONTRACTS.vaults.usdc.address),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usdt, CONTRACTS.vaults.usdt.address),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usds, CONTRACTS.vaults.usds.address),

    rpc.fetchTotalAssets(CONTRACTS.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.vaults.usds),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdc),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdt),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usds),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdc),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdt),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usds),

    // rpc.fetchVaultSettings(CONTRACTS.vaults.usdc),
    // rpc.fetchVaultSettings(CONTRACTS.vaults.usdt),
    // rpc.fetchVaultSettings(CONTRACTS.vaults.usds),

    rpc.fetchPrice(CONTRACTS.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usds),

    rpc.fetchTotalPredeposits(CONTRACTS.predeposits.status.nickname),
  ])

  const unitsInTime = await dune.fetchUnitsInTime()
  const depositsInTime = await dune.fetchDepositsInTime()
  const yieldInTime = await dune.fetchYieldInTime()
  const totalYield = yieldInTime.data[yieldInTime.data.length - 1]?.total as number || 0;

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-12">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Generic Internal Analytics</h1>
        </div>

        {/* Total Unit Tokens Section */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl p-8 shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">Total Unit Tokens</div>
            <div className="text-white text-5xl font-bold mb-4">
              {unitTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div>
                <span className="text-sm">Total Collateral Value: </span>
                <span className="text-xl font-semibold">${totalVaultValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div>
                <span className="text-sm">Collateralization: </span>
                <span className="text-xl font-semibold">{overcollateralization.toFixed(4)}%</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div>
                <span className="text-sm">Total Yield: </span>
                <span className="text-xl font-semibold">${Number(totalYield).toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Predeposits Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Predeposits</h2>
          </div>
          <div className="max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">Status</div>
                <div className="text-zinc-900 dark:text-zinc-100 text-3xl font-bold">
                  {totalPredeposits.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vault Balances Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collateral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultItem
              assetMetadata={CONTRACTS.assets.usdc.metadata}
              totalAssets={usdcTotalAssets}
              price={usdcPrice}
              vaultAddress={CONTRACTS.vaults.usdc.address}
              strategyAddress={CONTRACTS.vaults.usdc.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.assets.usdt.metadata}
              totalAssets={usdtTotalAssets}
              price={usdtPrice}
              vaultAddress={CONTRACTS.vaults.usdt.address}
              strategyAddress={CONTRACTS.vaults.usdt.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.assets.usds.metadata}
              totalAssets={usdsTotalAssets}
              price={usdsPrice}
              vaultAddress={CONTRACTS.vaults.usds.address}
              strategyAddress={CONTRACTS.vaults.usds.strategy.address}
            />
          </div>
        </div>

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unit Tokens</h2>
            {unitsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(unitsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <UnitsInTimeLine data={[
                  {
                    id: 'Unit Tokens',
                    color: '#3F79FF',
                    data: unitsInTime.data.map(entry => ({
                      x: entry.time,
                      y: entry.units.toFixed(2)
                    }))
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Historical Chart Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Daily deposits</h2>
            {depositsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime.data.map(entry => ({
                  time: entry.time,
                  usdc: Number(entry.usdc).toFixed(0),
                  usdt: Number(entry.usdt).toFixed(0),
                  usds: Number(entry.usds).toFixed(0),
                }))}
                indexBy={'time'}
                keys={['usdc', 'usdt', 'usds']}
                colors={[
                  CONTRACTS.assets.usdc.metadata.color,
                  CONTRACTS.assets.usdt.metadata.color,
                  CONTRACTS.assets.usds.metadata.color,
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
