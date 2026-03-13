import { VaultKey } from '@/app/types/vaults'
import { AssetContract } from '@/app/types/assets'

export interface RewardData {
  amount: number;
  claimed: number;
  pending: number;
  balance: number;
  token: {
    symbol: string;
    price: number;
    address: string;
    decimals: number;
  }
}

export interface VaultRewardsData {
  vaultKey: VaultKey;
  vaultName: string;
  vaultAddress: string;
  asset: AssetContract;
  rewards: RewardData[];
}
