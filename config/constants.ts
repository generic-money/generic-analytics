import { VaultKey, VaultContract } from '@/app/types/vaults';
import { AssetKey, AssetContract } from '@/app/types/assets';
import { PriceFeedKey } from '@/app/types/priceFeeds';
import { Contract, ValueContract } from '@/app/types/common';

export const CONTRACTS = {
  ethereum: {
    controller: {
      address: '0x3a64D23313E1bEAABa25Ec13149bD8D514C973Ae' as const,
    } as Contract,
    bridgeCoordinator: {
      address: '0x0503F2C5A1a4b72450c6Cfa790F2097CF5cB6a01' as const,
    } as Contract,
    dao: {
      address: '0x3794d7f91b3Dd3b338FEe671aC6AA42BEA5e3D17' as const,
    } as Contract,
    vaults: {
      usdc: {
        address: '0x4825eFF24F9B7b76EEAFA2ecc6A1D5dFCb3c1c3f' as const,
        decimals: 6,
        strategy: {
          address: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB' as const,
          decimals: 6,
        } as ValueContract,
      },
      usdt: {
        address: '0xB8280955aE7b5207AF4CDbdCd775135Bd38157fE' as const,
        decimals: 6,
        strategy: {
          address: '0xbEef047a543E45807105E51A8BBEFCc5950fcfBa' as const,
          decimals: 6,
        } as ValueContract,
      },
      usds: {
        address: '0x6133dA4Cd25773Ebd38542a8aCEF8F94cA89892A' as const,
        decimals: 18,
        strategy: {
          address: '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD' as const,
          decimals: 18,
        } as ValueContract,
      }
    } as Record<VaultKey, VaultContract>,
    assets: {
      unit: {
        address: '0x8c307baDbd78bEa5A1cCF9677caa58e7A2172502' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/gusd.png',
          symbol: 'GUSD',
          name: 'Generic Unit',
          color: '#3F79FF',
        }
      },
      gusd: {
        address: '0xece811d35f79C4868a2B911E55D9aa0821399EDF' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/gusd.png',
          symbol: 'GUSD',
          name: 'Generic Unit',
          color: '#3F79FF',
        }
      },
      usdc: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
        decimals: 6,
        metadata: {
          iconSrc: '/img/usdc.png',
          symbol: 'USDC',
          name: 'USD Coin',
          color: '#2775CA',
        }
      },
      usdt: {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
        decimals: 6,
        metadata: {
          iconSrc: '/img/usdt.png',
          symbol: 'USDT',
          name: 'Tether USD',
          color: '#26A17B',
        }
      },
      usds: {
        address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/usds.png',
          symbol: 'USDS',
          name: 'USDS Stablecoin',
          color: '#F4B731',
        }
      }
    } as Record<AssetKey, AssetContract>,
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
    } as Record<PriceFeedKey, ValueContract>,
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
  },
  citrea: {
    assets: {
      unit: {
        address: '0xd4AB6BA9764163f9B567A314999ad0F2ad66668C' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/gusd.png',
          symbol: 'GUSD',
          name: 'Generic Unit',
          color: '#3F79FF',
        }
      } as AssetContract,
      gusd: {
        address: '0xAC8c1AEB584765DB16ac3e08D4736CFcE198589B' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/gusd.png',
          symbol: 'GUSD',
          name: 'GUSD',
          color: '#3F79FF',
        }
      } as AssetContract,
      sgusd: {
        address: '0x4Fb03AfE959394DB9C4E312A89C6e485FB3732d1' as const,
        decimals: 18,
        metadata: {
          iconSrc: '/img/gusd.png',
          symbol: 'sGUSD',
          name: 'Citrea Staked GUSD',
          color: '#3F79FF',
        }
      } as AssetContract,
    },
  },
} as const

export const DUNE_QUERIES = {
  unitsInTime: 6283930,
  depositsInTime: 6284260,
  yieldInTime: 6535475,
  rebalancesInTime: 6535593,
  predepositsInTime: 6535610
} as const

export type YieldDestinationKey = 'generic' | 'ethereum' | 'status' | 'citrea';

export interface YieldDestination {
  chainId: number
  name: string
  address: string
  distributor?: PeripheryDistributor
  destinations: YieldDestinationValue[]
}

export interface YieldDestinationValue {
  id: string
  name: string
  address: string
}

export interface PeripheryDistributor {
  address: string
  bridgeType: number
  whitelabel: AssetContract
}

export const YIELD_DESTINATIONS = {
  generic: {
    chainId: 1,
    name: 'Generic Fee',
    destinations: [
      {
        id: 'generic-fee',
        name: 'Generic DAO',
        address: '0x3794d7f91b3Dd3b338FEe671aC6AA42BEA5e3D17',
      }
    ]
  },
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    destinations: [
      {
        id: 'ethereum',
        name: 'Generic DAO',
        address: '0x3794d7f91b3Dd3b338FEe671aC6AA42BEA5e3D17',
      }
    ]
  },
  status: {
    chainId: 1,
    name: 'StatusL2 (Predeposit)',
    destinations: [
      {
        id: 'status-predeposit',
        name: 'Status Predeposit Safe',
        address: '0x0000000000000000000000000000000000000000',
      }
    ]
  },
  citrea: {
    chainId: 4114,
    name: 'Citrea',
    distributor: {
      address: '0x41Cf323D4DCe797493Ec70AB3Da93E0c92dd679C',
      bridgeType: 1,
      whitelabel: CONTRACTS.citrea.assets.gusd,
    },
    destinations: [
      {
        id: 'citrea-staked',
        name: 'Citrea Staked GUSD',
        address: '0x4Fb03AfE959394DB9C4E312A89C6e485FB3732d1',
      },
      {
        id: 'citrea-unstaked',
        name: 'Citrea Team Safe',
        address: '0x0000000000000000000000000000000000000000',
      }
    ]
  }
} as Record<YieldDestinationKey, YieldDestination>;

export const GENERIC_FEE_PERCENTAGE = 10; // 10% protocol fee
