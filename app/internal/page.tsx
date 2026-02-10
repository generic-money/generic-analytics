import Image from 'next/image'
import { mainnet } from 'viem/chains'

import { citrea } from '../../config/chains/citrea'
import * as dune from '../actions/dune'
import * as rpc from '../actions/rpc'
import * as graphql from '../actions/graphql'
import ChangeInTimeBar from '../components/ChangeInTimeBar'
import UnitsInTimeLine from '../components/UnitsInTimeLine'
import VaultItem from '../components/VaultItem'
import MainValueItem from '../components/MainValueItem'
import ValueItem from '../components/ValueItem'
import { CONTRACTS } from '../../config/constants'
import type { VaultItemInternalProps } from '../components/VaultItem'
import { AssetKey } from 'node:sea'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Internal() {
  const [
    // assets
    unitTotalSupply,
    citreaTotalSupply,
    citreaStakedGusdSupply,
    usdcVaultBalance,
    usdtVaultBalance,
    usdsVaultBalance,
    // vaults
    usdcTotalAssets,
    usdtTotalAssets,
    usdsTotalAssets,
    usdcVaultAutoDepositThreshold,
    usdtVaultAutoDepositThreshold,
    usdsVaultAutoDepositThreshold,
    usdcAdditionalAvailableAssets,
    usdtAdditionalAvailableAssets,
    usdsAdditionalAvailableAssets,
    // controller
    usdcVaultSettings,
    usdtVaultSettings,
    usdsVaultSettings,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
    // redemptionPrice
    redemptionPrice,
    // bridgeCoordinator
    statusPredeposits,
    // morpho
    usdcStrategyData,
    usdtStrategyData,
    usdsSSR,
  ] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.ethereum.assets.unit, mainnet),
    rpc.fetchTotalSupply(CONTRACTS.citrea.assets.unit, citrea),
    rpc.fetchTotalSupply(CONTRACTS.citrea.assets.sgusd, citrea),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usdc, CONTRACTS.ethereum.vaults.usdc.address),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usdt, CONTRACTS.ethereum.vaults.usdt.address),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usds, CONTRACTS.ethereum.vaults.usds.address),

    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usds),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usds),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usds),

    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usds),

    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usds),

    rpc.fetchShareRedemptionPrice(),

    rpc.fetchTotalPredeposits(CONTRACTS.ethereum.predeposits.status.nickname),

    graphql.fetchMorphoVaultV1(CONTRACTS.ethereum.vaults.usdc.strategy.address),
    graphql.fetchMorphoVaultV1(CONTRACTS.ethereum.vaults.usdt.strategy.address),
    rpc.fetchSSR(),
  ])

  const unitsInTime = await dune.fetchUnitsInTime()
  const depositsInTime = await dune.fetchDepositsInTime()

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  const internalVaultsData = {
    usdc: {
      apy: usdcStrategyData.data.vaultByAddress.state.avgNetApy * 100,
      allocated: (usdcTotalAssets - usdcVaultBalance) / usdcTotalAssets * 100,
      available: (usdcAdditionalAvailableAssets + usdcVaultBalance) / usdcTotalAssets * 100,
      mintSlippage: usdcPrice <= 1 ? 0 : (usdcPrice - 1) * 100,
      redeemSlippage: usdcPrice >= 1 ? 0 : (1 - usdcPrice) * 100,
      maxCapacity: usdcVaultSettings.maxCapacity,
      minProportionality: usdcVaultSettings.minProportionality,
      maxProportionality: usdcVaultSettings.maxProportionality,
      autodepositThreshold: usdcVaultAutoDepositThreshold,
    },
    usdt: {
      apy: usdtStrategyData.data.vaultByAddress.state.avgNetApy * 100,
      allocated: (usdtTotalAssets - usdtVaultBalance) / usdtTotalAssets * 100,
      available: (usdtAdditionalAvailableAssets + usdtVaultBalance) / usdtTotalAssets * 100,
      mintSlippage: usdtPrice <= 1 ? 0 : (usdtPrice - 1) * 100,
      redeemSlippage: usdtPrice >= 1 ? 0 : (1 - usdtPrice) * 100,
      maxCapacity: usdtVaultSettings.maxCapacity,
      minProportionality: usdtVaultSettings.minProportionality,
      maxProportionality: usdtVaultSettings.maxProportionality,
      autodepositThreshold: usdtVaultAutoDepositThreshold,
    },
    usds: {
      apy: usdsSSR * 100,
      allocated: (usdsTotalAssets - usdsVaultBalance) / usdsTotalAssets * 100,
      available: (usdsAdditionalAvailableAssets + usdsVaultBalance) / usdsTotalAssets * 100,
      mintSlippage: usdsPrice <= 1 ? 0 : (usdsPrice - 1) * 100,
      redeemSlippage: usdsPrice >= 1 ? 0 : (1 - usdsPrice) * 100,
      maxCapacity: usdsVaultSettings.maxCapacity,
      minProportionality: usdsVaultSettings.minProportionality,
      maxProportionality: usdsVaultSettings.maxProportionality,
      autodepositThreshold: usdsVaultAutoDepositThreshold,
    },
  } as Record<AssetKey, VaultItemInternalProps>

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-6 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="w-full my-12 text-4xl font-bold text-zinc-900 dark:text-zinc-100">Generic Internal Analytics</h1>

        <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MainValueItem
            label="Total GUSD"
            value={unitTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <MainValueItem
            label="Total Collateral Value"
            value={`$${totalVaultValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          />
          <MainValueItem
            label="Collateralization"
            value={`${overcollateralization.toFixed(4)}%`}
          />
          <MainValueItem
            label="GUSD Price"
            value={`$${redemptionPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })}`}
          />
        </div>

        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Chains</h2>
        <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueItem
            label='StatusL2 (Predeposit)'
            value={statusPredeposits.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Citrea (total / staked)'
            value={citreaTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' / ' + citreaStakedGusdSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Ethereum'
            value={(unitTotalSupply - (statusPredeposits + citreaTotalSupply)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
        </div>

        {/* Vault Balances Section */}
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collateral</h2>
        <div className="w-full mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdc.metadata}
              totalAssets={usdcTotalAssets}
              price={usdcPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdc.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdc.strategy.address}
              internal={internalVaultsData.usdc}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdt.metadata}
              totalAssets={usdtTotalAssets}
              price={usdtPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdt.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdt.strategy.address}
              internal={internalVaultsData.usdt}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usds.metadata}
              totalAssets={usdsTotalAssets}
              price={usdsPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usds.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usds.strategy.address}
              internal={internalVaultsData.usds}
            />
          </div>
        </div>

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unit Tokens (last 14 days)</h2>
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
                  data: unitsInTime.data.slice(-14).map(entry => ({
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Deposits (last 14 days)</h2>
            {depositsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mb-12">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime.data.slice(-14).map(entry => ({
                  time: entry.time,
                  usdc: Number(entry.usdc).toFixed(0),
                  usdt: Number(entry.usdt).toFixed(0),
                  usds: Number(entry.usds).toFixed(0),
                }))}
                indexBy={'time'}
                keys={['usdc', 'usdt', 'usds']}
                colors={[
                  CONTRACTS.ethereum.assets.usdc.metadata.color,
                  CONTRACTS.ethereum.assets.usdt.metadata.color,
                  CONTRACTS.ethereum.assets.usds.metadata.color,
                ]}
              />
            </div>
          </div>
        </div>

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
  );
}
