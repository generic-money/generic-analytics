import * as rpc from '@/app/actions/rpc'
import Image from 'next/image'
import { mainnet } from 'viem/chains'

import MainValueItem from '@/app/components/MainValueItem'
import VaultItem from '@/app/components/VaultItem'
import { CONTRACTS } from '@/config/constants'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [
    // assets
    unitTotalSupply,
    // vaults
    usdcTotalAssets,
    usdtTotalAssets,
    usdsTotalAssets,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
    // redemptionPrice
    redemptionPrice
  ] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.ethereum.assets.unit, mainnet),

    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usds),

    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usds),

    rpc.fetchShareRedemptionPrice(),
  ])

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-6 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="w-full my-12 text-4xl font-bold text-zinc-900 dark:text-zinc-100">Proof of Reserves</h1>

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

        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collateral</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdc.metadata}
              totalAssets={usdcTotalAssets}
              price={usdcPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdc.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdc.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdt.metadata}
              totalAssets={usdtTotalAssets}
              price={usdtPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdt.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdt.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usds.metadata}
              totalAssets={usdsTotalAssets}
              price={usdsPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usds.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usds.strategy.address}
            />
          </div>
        </div>

        <footer className="w-full mt-auto pt-8 pb-4 flex items-center justify-center border-t border-zinc-200 dark:border-zinc-800">
          <Image
            src="/img/generic-logo.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
          />
        </footer>
      </main>
    </div>
  );
}
