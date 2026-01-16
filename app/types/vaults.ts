export type VaultKey = 'usdc' | 'usdt' | 'usds';

export interface VaultContract {
  address: `0x${string}`;
  decimals: number;
}

export type VaultsMap<T> = Record<VaultKey, T>;

export interface VaultMetadata {
  symbol: string;
  name: string;
  icon: string;
  color: string;
}

export interface VaultSettings {
  maxCapacity: number;
  maxProportionality: number;
  minProportionality: number;
  automaticDepositThreshold: number;
}

export interface VaultData {
  totalAssets: number;
  vaultBalance: number;
  price: number;
}

export interface VaultConfig {
  metadata: VaultMetadata;
  data: VaultData;
  settings?: VaultSettings;
  strategyAddress: string;
  vaultAddress: string;
}

export interface VaultBalancesSectionData {
  vaults: VaultsMap<VaultConfig>;
  showBasicInfoOnly?: boolean;
}
