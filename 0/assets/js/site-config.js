window.SITE_CONFIG = {
  brand: "$TOSH",
  brandShort: "TT",
  siteName: "ToshTech",
  announcement: "🛠️ ToshTech builds trust, analytics, security, bots and utility for PEPU holders, builders and partner projects.",
  cta: {
    label: "Buy $TOSH",
    href: "how-to-buy.html",
    external: false
  },
  wallet: {
    enabled: true,
    lsKey: "tosh_wallet_provider",
    chainId: 97741,
    chainHex: "0x17dcd",
    chainName: "PEPE Unchained V2",
    rpcUrl: "https://rpc-pepu-v2-mainnet-0.t.conduit.xyz",
    explorerUrl: "https://pepuscan.com",
    walletConnectProjectId: "6e2df48125e4f633b093361ba0a87c81",
    nativeCurrency: {
      name: "Pepe Unchained",
      symbol: "PEPU",
      decimals: 18
    },
    quickLinks: [
      { label: "MyLocks", href: "mylocks" },
      { label: "Wallet Analyzer", href: "toshguardwa" },
      { label: "Claim", href: "claim" }
    ]
  },
  socials: [
    { label: "Telegram", href: "https://t.me/ToshTech", external: true },
    { label: "Twitter / X", href: "https://x.com/ToshTech_", external: true },
    {
      label: "Chart",
      href: "https://www.geckoterminal.com/pepe-unchained/pools/0x36337e694b3b1eadde50101e8aa4f4fa74463aee",
      external: true
    }
  ]
};

window.SITE_NAV = [
  { label: "Home", href: "index.html" },

  {
    label: "Products",
    children: [
      { label: "Product Hub", href: "products.html" },
      { label: "ToshGuard", href: "toshguard.html" },
      { label: "Wallet Analyzer", href: "toshguardwa.html" },
      { label: "ToshStake", href: "toshstake.html" },
      { label: "ToshBurn", href: "toshburn.html" },
      { label: "Bots", href: "tools.html" }
    ]
  },

{
  label: "Dashboards",
  children: [
    { label: "Dashboard Hub", href: "dashboards.html" },
    { label: "PepuBoard", href: "pepuboard.html" },
    { label: "ToshBoard", href: "toshboard.html" },
    { label: "PEPU Stakers", href: "pepu_stakers.html" },
    { label: "Bridge Monitor", href: "pepubridge.html" },
    { label: "Claims Dashboard", href: "claim.html" }
  ]
},

  {
    label: "ToshLock",
    children: [
      { label: "Create Lock", href: "toshlock.html" },
      { label: "My Locks", href: "mylocks.html" },
      { label: "Lock Rankings", href: "toshrank.html" },
      { label: "Lock Terminal", href: "toshdashboard.html" },
      { label: "ToshLock Bot", href: "https://t.me/ToshLock_bot", external: true }
    ]
  },

  {
    label: "Ecosystem",
    children: [
      { label: "Roadmap", href: "roadmap.html" },
      { label: "Tokenomics", href: "roadmap.html#tokenomics" },
      { label: "PEPU Gallery", href: "gallery.html" }
    ]
  },

  { label: "Partners", href: "partners.html" }
];

window.PAGE_REGISTRY = {
  featuredProducts: [
    {
      title: "ToshGuard",
      href: "toshguard.html",
      tag: "Security",
      description: "Real-time Telegram monitoring for wallet tracking, token alerts, whale activity and price notifications.",
      links: [
        { label: "Open page", href: "toshguard.html" },
        { label: "Bot", href: "https://t.me/ToshGuard_bot", external: true }
      ]
    },
    {
      title: "Wallet Analyzer",
      href: "toshguardwa.html",
      tag: "Holder Tool",
      description: "Portfolio visibility with USD breakdowns, staked assets, allocations and utility eligibility checks.",
      links: [
        { label: "Open page", href: "toshguardwa.html" }
      ]
    },
    {
      title: "ToshStake",
      href: "toshstake.html",
      tag: "Holder Utility",
      description: "Stake $TOSH to strengthen alignment and unlock premium access across the ToshTech ecosystem.",
      links: [
        { label: "Open page", href: "toshstake.html" }
      ]
    },
    {
      title: "ToshLock",
      href: "toshlock.html",
      tag: "Liquidity Trust",
      description: "On-chain verifiable liquidity locking built to improve transparency and project credibility.",
      links: [
        { label: "Create Lock", href: "toshlock.html" },
        { label: "Bot", href: "https://t.me/ToshLock_bot", external: true }
      ]
    },
    {
      title: "ToshBurn",
      href: "toshburn.html",
      tag: "L2 Utility",
      description: "Simple utility to burn PEPU L2 tokens and support stronger token mechanics across the ecosystem.",
      links: [
        { label: "Open page", href: "toshburn.html" }
      ]
    },
    {
      title: "Bots & Automation",
      href: "tools.html",
      tag: "Growth",
      description: "Freemium and premium Telegram bots for buy alerts, community automation and partner project support.",
      links: [
        { label: "Open page", href: "tools.html" },
        { label: "BuyBot", href: "https://t.me/ToshPepuBuyBot", external: true }
      ]
    }
  ],

  dashboards: [
    {
      title: "PepuBoard",
      href: "pepuboard.html",
      tag: "PEPU Ecosystem",
      description: "PEPU L1/L2 dashboard for market data, supply, liquidity, holders, chain health and ecosystem activity."
    },
    {
      title: "ToshBoard",
      href: "toshboard.html",
      tag: "Token Intelligence",
      description: "PEPU L2 token intelligence for rankings, volume, liquidity, market activity and ecosystem visibility."
    },
    {
      title: "PEPU Stakers",
      href: "pepu_stakers.html",
      tag: "Staking",
      description: "PEPU staking leaderboard, wallet position, pending rewards, pool share and staking actions."
    },
    {
      title: "Bridge Board",
      href: "pepubridge.html",
      tag: "Bridge Flow",
      description: "PEPU bridge monitoring for starts, unlock timing, claimable balances and wallet-level bridge activity."
    },
    {
      title: "PEPU Claims",
      href: "claim.html",
      tag: "Claims",
      description: "Old PEPU L2 compensation dashboard for wallet compensation, token repartition, live claimable balances and on-chain claiming."
    }
  ],

  ecosystem: [
    {
      title: "Roadmap & Tokenomics",
      href: "roadmap.html",
      tag: "$TOSH Context",
      description: "Roadmap, tokenomics and project direction for the ToshTech ecosystem."
    },
    {
      title: "PEPU Gallery",
      href: "gallery.html",
      tag: "Assets",
      description: "Centralized PEPU image hub for official and community assets in one clean, searchable place."
    },
    {
      title: "How to Buy $TOSH",
      href: "how-to-buy.html",
      tag: "Buy Guide",
      description: "Simple guide for buying $TOSH through the standard PEPU route or supported faster access routes."
    }
  ],

  toshLockTools: [
    {
      title: "Create Lock",
      href: "toshlock.html",
      tag: "Lock Creation",
      description: "Create an on-chain PEPU L2 liquidity lock through the ToshLock flow."
    },
    {
      title: "My Locks",
      href: "mylocks.html",
      tag: "Wallet Locks",
      description: "View wallet lock positions, active locks and unlockable positions."
    },
    {
      title: "Lock Terminal",
      href: "toshdashboard.html",
      tag: "Inspection",
      description: "Terminal-style view for wallet, token and lock inspection."
    },
    {
      title: "Lock Rankings",
      href: "toshrank.html",
      tag: "Rankings",
      description: "Compare lock visibility, TVL, unlock timing and project trust signals."
    }
  ],

  partnerHighlights: [
    {
      title: "PEPU Ecosystem",
      role: "Core infrastructure",
      description: "ToshTech provides dashboards, bot infrastructure, tracking and utility tooling across PEPU L1 and L2.",
      href: "partners.html#pepu"
    },
    {
      title: "Partner Projects",
      role: "Development & support",
      description: "Custom dashboards, bots, web3 flows, visibility tools and ecosystem support for aligned projects.",
      href: "partners.html#partner-list"
    },
    {
      title: "Builder Services",
      role: "Custom tools",
      description: "Locker infrastructure, buybot solutions, dashboards and partner builds for teams building across PEPU and beyond.",
      href: "partners.html#workwithus"
    }
  ]
};