import * as rest from '@/app/actions/rest'
import * as rpc from '@/app/actions/rpc'
import { CONTRACTS } from '@/config/constants'
import VaultRewardsCard from './VaultRewardsCard'
import { VaultRewardsData, RewardData } from './types'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RewardsPage() {
  // Fetch rewards data for all vaults
  const [
    usdcRewards,
    usdtRewards,
    usdsRewards,
  ] = await Promise.all([
    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usdc),
    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usdt),
    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usds),
  ])

  // Fetch balances for all reward tokens for all vaults
  const vaults = [
    { key: 'usdc', address: CONTRACTS.ethereum.vaults.usdc.address, rewards: usdcRewards },
    { key: 'usdt', address: CONTRACTS.ethereum.vaults.usdt.address, rewards: usdtRewards },
    { key: 'usds', address: CONTRACTS.ethereum.vaults.usds.address, rewards: usdsRewards },
  ]

  const balanceFetchPromises: Promise<number>[] = []
  const balanceMap: { vaultKey: string, tokenAddress: string, index: number }[] = []

  vaults.forEach(vault => {
    vault.rewards.forEach((reward: RewardData) => {
      balanceMap.push({
        vaultKey: vault.key,
        tokenAddress: reward.token.address,
        index: balanceFetchPromises.length
      })
      balanceFetchPromises.push(
        rpc.fetchBalanceOf(
          { address: reward.token.address as `0x${string}`, decimals: reward.token.decimals } as any,
          vault.address as `0x${string}`
        )
      )
    })
  })

  const balances = await Promise.all(balanceFetchPromises)

  // Populate balances in reward data
  balanceMap.forEach(({ vaultKey, tokenAddress, index }) => {
    const vault = vaults.find(v => v.key === vaultKey)
    if (vault) {
      const reward = vault.rewards.find((r: RewardData) => r.token.address === tokenAddress)
      if (reward) {
        reward.balance = balances[index]
      }
    }
  })

  const vaultsRewardsData: VaultRewardsData[] = [
    {
      vaultKey: 'usdc',
      vaultName: 'USDC Vault',
      vaultAddress: CONTRACTS.ethereum.vaults.usdc.address,
      asset: CONTRACTS.ethereum.assets.usdc,
      rewards: usdcRewards,
    },
    {
      vaultKey: 'usdt',
      vaultName: 'USDT Vault',
      vaultAddress: CONTRACTS.ethereum.vaults.usdt.address,
      asset: CONTRACTS.ethereum.assets.usdt,
      rewards: usdtRewards,
    },
    {
      vaultKey: 'usds',
      vaultName: 'USDS Vault',
      vaultAddress: CONTRACTS.ethereum.vaults.usds.address,
      asset: CONTRACTS.ethereum.assets.usds,
      rewards: usdsRewards,
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-6 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Rewards Overview
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track and manage protocol rewards across all vaults
          </p>
        </div>

        {/* Vault Rewards Cards */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {vaultsRewardsData.map((vaultData) => (
            <VaultRewardsCard key={vaultData.vaultKey} vaultData={vaultData} />
          ))}
        </div>
      </main>
    </div>
  )
}
