import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { DuneClient } from "@duneanalytics/client-sdk";

import { genericUnitAbi } from '../public/abi/GenericUnit.abi'
import { genericVaultAbi } from '../public/abi/GenericVault.abi'
import { chainlinkFeedAbi } from '../public/abi/ChainlinkFeed.abi'

import ChangeInTimeBar from './components/ChangeInTimeBar'
import UnitsInTimeLine from './components/UnitsInTimeLine'
import VaultBalanceItem from './components/VaultBalanceItem'

export default async function Home() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  })
  const unitTotalSupply = await client.readContract({
    address: '0x8c307baDbd78bEa5A1cCF9677caa58e7A2172502',
    abi: genericUnitAbi,
    functionName: 'totalSupply',
  }).then(res => Number(res) / 1e18) // Unit has 18 decimals

  const usdcTotalAssets = await client.readContract({
    address: '0x4825eFF24F9B7b76EEAFA2ecc6A1D5dFCb3c1c3f',
    abi: genericVaultAbi,
    functionName: 'totalAssets',
  }).then(res => Number(res) / 1e6) // USDC has 6 decimals
  const usdtTotalAssets = await client.readContract({
    address: '0xB8280955aE7b5207AF4CDbdCd775135Bd38157fE',
    abi: genericVaultAbi,
    functionName: 'totalAssets',
  }).then(res => Number(res) / 1e6) // USDT has 6 decimals
  const usdsTotalAssets = await client.readContract({
    address: '0x6133dA4Cd25773Ebd38542a8aCEF8F94cA89892A',
    abi: genericVaultAbi,
    functionName: 'totalAssets',
  }).then(res => Number(res) / 1e18) // USDS has 18 decimals

  const usdcPrice = await client.readContract({
    address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    abi: chainlinkFeedAbi,
    functionName: 'latestRoundData',
  }).then(res => Number(res[1]) / 1e8) // Chainlink USDC/USD feed has 8 decimals
  const usdtPrice = await client.readContract({
    address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
    abi: chainlinkFeedAbi,
    functionName: 'latestRoundData',
  }).then(res => Number(res[1]) / 1e8) // Chainlink USDT/USD feed has 8 decimals
  const usdsPrice = await client.readContract({
    address: '0xfF30586cD0F29eD462364C7e81375FC0C71219b1',
    abi: chainlinkFeedAbi,
    functionName: 'latestRoundData',
  }).then(res => Number(res[1]) / 1e8) // Chainlink USDS/USD feed has 8 decimals

  const dune = new DuneClient(process.env.DUNE_API_PREVIEW_KEY!);
  const unitsInTime = await dune.getLatestResult({queryId: 6283930}).then(res =>
    res.result?.rows.map(row => ({
      x: new Date(String(row.time)).toLocaleDateString(),
      y: (Number(row.cum) / 1e18).toFixed(0), // Unit has 18 decimals
    }))
  ) || [];

  const unitsInTimeData = [
    {
      id: 'Unit Tokens',
      color: '#8b5cf6', // Purple color for units
      data: unitsInTime
    }
  ];

  const depositsInTime = await dune.getLatestResult({queryId: 6284260}).then(res =>
    res.result?.rows.map(row => ({
      time: new Date(String(row.time)).toLocaleDateString(),
      usdc: (Number(row.usdc) / 1e6).toFixed(0), // USDC has 6 decimals
      usdt: (Number(row.usdt) / 1e6).toFixed(0), // USDT has 6 decimals
      usds: (Number(row.usds) / 1e18).toFixed(0), // USDS has 18 decimals
    }))
  ) || [];

  const colors = {
    usdc: '#2775CA',  // USDC blue (Circle's brand color)
    usdt: '#26A17B',  // USDT green (Tether's brand color)
    usds: '#6E62E5',  // USDS purple (Sky/MakerDAO inspired)
  }

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice;
  const overcollateralization = (totalVaultValue / unitTotalSupply * 100);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-12">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Analytics Dashboard</h1>
        </div>

        {/* Total Unit Tokens Section */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg">
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
            </div>
          </div>
        </div>

        {/* Vault Balances Section */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Vault Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultBalanceItem
              symbol="USDC"
              name="USD Coin"
              color={colors.usdc}
              icon="$"
              totalAssets={usdcTotalAssets}
              price={usdcPrice}
            />
            <VaultBalanceItem
              symbol="USDT"
              name="Tether"
              color={colors.usdt}
              icon="₮"
              totalAssets={usdtTotalAssets}
              price={usdtPrice}
            />
            <VaultBalanceItem
              symbol="USDS"
              name="Sky Dollar"
              color={colors.usds}
              icon="◎"
              totalAssets={usdsTotalAssets}
              price={usdsPrice}
            />
          </div>
        </div>

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Unit Tokens</h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <UnitsInTimeLine data={unitsInTimeData} />
            </div>
          </div>
        </div>

        {/* Historical Chart Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Daily deposits</h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime}
                indexBy={'time'}
                keys={['usdc', 'usdt', 'usds']}
                colors={[
                  colors.usdc,
                  colors.usdt,
                  colors.usds,
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
