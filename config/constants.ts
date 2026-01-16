import { VaultsMap, VaultContract } from '@/app/types/vaults';
import { AssetsMap, AssetContract } from '@/app/types/assets';
import { PriceFeedsMap, PriceFeedContract } from '@/app/types/priceFeeds';

export const CONTRACTS = {
  controller: {
    address: '0x3a64D23313E1bEAABa25Ec13149bD8D514C973Ae' as const,
  },
  bridgeCoordinator: {
    address: '0x0503F2C5A1a4b72450c6Cfa790F2097CF5cB6a01' as const,
  },
  vaults: {
    usdc: {
      address: '0x4825eFF24F9B7b76EEAFA2ecc6A1D5dFCb3c1c3f' as const,
      decimals: 6,
      name: 'USDC Vault',
      symbol: 'USDC',
      displayName: 'USD Coin',
      icon: '$',
      color: '#2775CA',
      strategyAddress: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB' as const
    },
    usdt: {
      address: '0xB8280955aE7b5207AF4CDbdCd775135Bd38157fE' as const,
      decimals: 6,
      name: 'USDT Vault',
      symbol: 'USDT',
      displayName: 'Tether',
      icon: '₮',
      color: '#26A17B',
      strategyAddress: '0xbEef047a543E45807105E51A8BBEFCc5950fcfBa' as const
    },
    usds: {
      address: '0x6133dA4Cd25773Ebd38542a8aCEF8F94cA89892A' as const,
      decimals: 18,
      name: 'USDS Vault',
      symbol: 'USDS',
      displayName: 'Sky Dollar',
      icon: '◎',
      color: '#6E62E5',
      strategyAddress: '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD' as const
    }
  } as VaultsMap<VaultContract> | VaultsMap<any>,
  assets: {
    unit: {
      address: '0x8c307baDbd78bEa5A1cCF9677caa58e7A2172502' as const,
      decimals: 18,
      name: 'Generic Unit'
    },
    usdc: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
      decimals: 6,
      name: 'USD Coin'
    },
    usdt: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
      decimals: 6,
      name: 'Tether USD'
    },
    usds: {
      address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F' as const,
      decimals: 18,
      name: 'USDS Stablecoin'
    }
  } as AssetsMap<AssetContract>,
  priceFeeds: {
    usdc: {
      address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6' as const,
      decimals: 8,
      name: 'USDC/USD Chainlink Feed'
    },
    usdt: {
      address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D' as const,
      decimals: 8,
      name: 'USDT/USD Chainlink Feed'
    },
    usds: {
      address: '0xfF30586cD0F29eD462364C7e81375FC0C71219b1' as const,
      decimals: 8,
      name: 'USDS/USD Chainlink Feed'
    }
  } as PriceFeedsMap<PriceFeedContract>,
  predeposits: {
    status: {
      name: 'Status',
      nickname: '0xa4fdc657c7ba2402ba336e88c4ae1c72169f7bc116987c8aefd50982676d9a17' as const,
    },
    citrea: {
      name: 'Citrea',
      nickname: '0x5d8f3ef2cb4337c01981e156bbfbf58e6df65b10a2ce34e33777dbb3ad8e7d2f' as const,
    }
  }
} as const

export const DUNE_QUERIES = {
  unitsInTime: 6283930,
  depositsInTime: 6284260,
  yieldInTime: 6535475,
  rebalancesInTime: 6535593,
  predepositsInTime: 6535610
} as const
