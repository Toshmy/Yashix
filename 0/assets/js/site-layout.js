(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  const walletCfg = (window.SITE_CONFIG && window.SITE_CONFIG.wallet) || {};

  const TARGET_CHAIN_ID = Number(walletCfg.chainId || 97741);
  const TARGET_CHAIN_HEX = walletCfg.chainHex || ('0x' + TARGET_CHAIN_ID.toString(16));
  const WALLET_LS_KEY = walletCfg.lsKey || 'tosh_wallet_provider';
const METAMASK_ICON_URI =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNSAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjcwNzcgMzIuNzUyMkwyNS4xNjg4IDMwLjUxNzRMMTkuNDgzMyAzMy45MDA4TDE1LjUxNjcgMzMuODk5MUw5LjgyNzkzIDMwLjUxNzRMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDQ4OUwyLjI5MjI1IDE2LjQ5OTNMMCA5LjI3MDk0TDIuMjkyMjUgMC4zMTIyNTZMMTQuMDY3NCA3LjMxNTU0SDIwLjkzMjZMMzIuNzA3NyAwLjMxMjI1NkwzNSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0wzNSAyNS4wNDg5TDMyLjcwNzcgMzIuNzUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTIuMjkzOTUgMC4zMTIyNTZMMTQuMDY5MSA3LjMyMDQ3TDEzLjYwMDggMTIuMTMwMUwyLjI5Mzk1IDAuMzEyMjU2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNOS44Mjk1OSAyNS4wNTIyTDE1LjAxMDYgMjguOTgxMUw5LjgyOTU5IDMwLjUxNzVWMjUuMDUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTE0LjU5NjYgMTguNTU2NUwxMy42MDA5IDEyLjEzMzNMNy4yMjY5MiAxNi41MDA5TDcuMjIzNjMgMTYuNDk5M1YxNi41MDI1TDcuMjQzMzUgMjAuOTk4M0w5LjgyODA5IDE4LjU1NjVIOS44Mjk3NEgxNC41OTY2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMzIuNzA3NyAwLjMxMjI1NkwyMC45MzI2IDcuMzIwNDdMMjEuMzk5MyAxMi4xMzAxTDMyLjcwNzcgMC4zMTIyNTZaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIyIDI1LjA1MjJMMTkuOTkxMiAyOC45ODExTDI1LjE3MjIgMzAuNTE3NVYyNS4wNTIyWiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMjcuNzc2NiAxNi41MDI1SDI3Ljc3ODNIMjcuNzc2NlYxNi40OTkzTDI3Ljc3NSAxNi41MDA5TDIxLjQwMSAxMi4xMzMzTDIwLjQwNTMgMTguNTU2NUgyNS4xNzIyTDI3Ljc1ODYgMjAuOTk4M0wyNy43NzY2IDE2LjUwMjVaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik05LjgyNzkzIDMwLjUxNzVMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDUyMkg5LjgyNzkzVjMwLjUxNzVaIiBmaWxsPSIjRTM0ODA3Ii8+CjxwYXRoIGQ9Ik0xNC41OTQ3IDE4LjU1NDlMMTYuMDM0MSAyNy44NDA2TDE0LjAzOTMgMjIuNjc3N0w3LjIzOTc1IDIwLjk5ODRMOS44MjYxMyAxOC41NTQ5SDE0LjU5M0gxNC41OTQ3WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjUuMTcyMSAzMC41MTc1TDMyLjcwNzggMzIuNzUyMkwzNS4wMDAxIDI1LjA1MjJIMjUuMTcyMVYzMC41MTc1WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjAuNDA1MyAxOC41NTQ5TDE4Ljk2NTggMjcuODQwNkwyMC45NjA3IDIyLjY3NzdMMjcuNzYwMiAyMC45OTg0TDI1LjE3MjIgMTguNTU0OUgyMC40MDUzWiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMCAyNS4wNDg4TDIuMjkyMjUgMTYuNDk5M0g3LjIyMTgzTDcuMjM5OTEgMjAuOTk2N0wxNC4wMzk0IDIyLjY3NkwxNi4wMzQzIDI3LjgzODlMMTUuMDA4OSAyOC45NzZMOS44Mjc5MyAyNS4wNDcySDBWMjUuMDQ4OFoiIGZpbGw9IiNGRjhENUQiLz4KPHBhdGggZD0iTTM1LjAwMDEgMjUuMDQ4OEwzMi43MDc4IDE2LjQ5OTNIMjcuNzc4M0wyNy43NjAyIDIwLjk5NjdMMjAuOTYwNyAyMi42NzZMMTguOTY1OCAyNy44Mzg5TDE5Ljk5MTIgMjguOTc2TDI1LjE3MjIgMjUuMDQ3MkgzNS4wMDAxVjI1LjA0ODhaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yMC45MzI1IDcuMzE1NDNIMTcuNDk5OUgxNC4wNjczTDEzLjYwMDYgMTIuMTI1MUwxNi4wMzQyIDI3LjgzNEgxOC45NjU2TDIxLjQwMDggMTIuMTI1MUwyMC45MzI1IDcuMzE1NDNaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yLjI5MjI1IDAuMzEyMjU2TDAgOS4yNzA5NEwyLjI5MjI1IDE2LjQ5OTNINy4yMjE4M0wxMy41OTkxIDEyLjEzMDFMMi4yOTIyNSAwLjMxMjI1NloiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTEzLjE3IDIwLjQxOTlIMTAuOTM2OUw5LjcyMDk1IDIxLjYwNjJMMTQuMDQwOSAyMi42NzI3TDEzLjE3IDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTMyLjcwNzcgMC4zMTIyNTZMMzQuOTk5OSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0gyNy43NzgxTDIxLjQwMDkgMTIuMTMwMUwzMi43MDc3IDAuMzEyMjU2WiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMjEuODMzIDIwLjQxOTlIMjQuMDY5NEwyNS4yODUzIDIxLjYwNzlMMjAuOTYwNCAyMi42NzZMMjEuODMzIDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTE5LjQ4MTcgMzAuODM2MkwxOS45OTExIDI4Ljk3OTRMMTguOTY1OCAyNy44NDIzSDE2LjAzMjdMMTUuMDA3MyAyOC45Nzk0TDE1LjUxNjcgMzAuODM2MiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMTkuNDgxNiAzMC44MzU5VjMzLjkwMjFIMTUuNTE2NlYzMC44MzU5SDE5LjQ4MTZaIiBmaWxsPSIjQzBDNENEIi8+CjxwYXRoIGQ9Ik05LjgyOTU5IDMwLjUxNDJMMTUuNTIgMzMuOTAwOFYzMC44MzQ2TDE1LjAxMDYgMjguOTc3OEw5LjgyOTU5IDMwLjUxNDJaIiBmaWxsPSIjRTdFQkY2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIxIDMwLjUxNDJMMTkuNDgxNyAzMy45MDA4VjMwLjgzNDZMMTkuOTkxMSAyOC45Nzc4TDI1LjE3MjEgMzAuNTE0MloiIGZpbGw9IiNFN0VCRjYiLz4KPC9zdmc+Cg==';

const WALLETCONNECT_ICON_SVG = `
<svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="200" cy="200" r="199.5" fill="#3396FF" stroke="#66B1FF"/>
  <path d="M122.519 148.965c42.791-41.729 112.171-41.729 154.962 0l5.15 5.022c2.14 2.086 2.14 5.469 0 7.555l-17.617 17.18c-1.07 1.043-2.804 1.043-3.874 0l-7.087-6.911c-29.853-29.111-78.253-29.111-108.106 0l-7.59 7.401c-1.07 1.043-2.804 1.043-3.874 0l-17.617-17.18c-2.14-2.086-2.14-5.469 0-7.555zm191.397 35.529 15.679 15.29c2.14 2.086 2.14 5.469 0 7.555l-70.7 68.944c-2.139 2.087-5.608 2.087-7.748 0l-50.178-48.931c-.535-.522-1.402-.522-1.937 0l-50.178 48.931c-2.139 2.087-5.608 2.087-7.748 0l-70.7015-68.945c-2.1396-2.086-2.1396-5.469 0-7.555l15.6795-15.29c2.1396-2.086 5.6085-2.086 7.7481 0l50.1789 48.932c.535.522 1.402.522 1.937 0l50.177-48.932c2.139-2.087 5.608-2.087 7.748 0l50.179 48.932c.535.522 1.402.522 1.937 0l50.179-48.931c2.139-2.087 5.608-2.087 7.748 0z" fill="#fff"/>
</svg>`;

function walletProviderIcon(type) {
  if (type === 'wc') return WALLETCONNECT_ICON_SVG;
  if (type === 'injected') return `<img src="${METAMASK_ICON_URI}" alt="MetaMask">`;
  return `<span class="wallet-chip-placeholder"></span>`;
}

function walletProviderLabel(type) {
  if (type === 'wc') return 'WalletConnect';
  if (type === 'injected') return 'MetaMask';
  return 'Wallet';
}
const walletIcons = {
  none: `<span class="wallet-chip-placeholder"></span>`,
  mm: `<img src="${METAMASK_ICON_URI}" alt="MetaMask">`,
  wc: WALLETCONNECT_ICON_SVG
};
  const walletState = {
    providerType: null,
    wcProvider: null,
    ethersProvider: null,
    signer: null,
    address: '',
    chainId: null,
    connected: false
  };

  const walletListeners = new Set();

  let mmAccountsHandler = null;
  let mmChainHandler = null;
  let wcAccountsHandler = null;
  let wcChainHandler = null;
  let wcDisconnectHandler = null;

let walletUiBound = false;
let walletMounted = false;
let chainSwitchInProgress = false;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getLiveChainId(eip1193Provider) {
  if (!eip1193Provider?.request) return null;

  const chainHex = await eip1193Provider.request({
    method: 'eth_chainId'
  });

  return parseInt(String(chainHex), 16);
}
  function isActive(href) {
    return !!href && href === path;
  }

  function isTargetChain(chainId) {
    return Number(chainId) === TARGET_CHAIN_ID;
  }

  function shortAddr(addr) {
    return addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : '';
  }

  function renderLink(item, className = 'nav-link') {
    const target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const activeClass = isActive(item.href) ? ' is-active' : '';
    return `<a href="${item.href}"${target} class="${className}${activeClass}">${item.label}</a>`;
  }

  function renderDesktopItem(item) {
    if (!item.children) return renderLink(item);

    const activeGroup =
      (!!item.href && isActive(item.href)) ||
      item.children.some(child => isActive(child.href));

    return `
      <div class="nav-group">
        ${item.href
          ? `<a href="${item.href}" class="nav-group-trigger${activeGroup ? ' is-active' : ''}"><span>${item.label}</span><span>▾</span></a>`
          : `<button class="nav-group-trigger${activeGroup ? ' is-active' : ''}" type="button"><span>${item.label}</span><span>▾</span></button>`
        }
        <div class="nav-group-menu">
          ${item.children.map(child => renderLink(child, 'menu-link')).join('')}
        </div>
      </div>
    `;
  }

  function renderMobileItem(item, i) {
    if (!item.children) return renderLink(item, 'mobile-link');
    return `
      <div class="mobile-group">
        <button type="button" class="mobile-group-toggle" data-target="mobile-submenu-${i}">
          <span>${item.label}</span>
          <span>▾</span>
        </button>
        <div id="mobile-submenu-${i}" class="mobile-submenu">

          ${item.children.map(child => renderLink(child, 'mobile-link')).join('')}
        </div>
      </div>
    `;
  }

  function renderSocialLinks() {
    return (window.SITE_CONFIG.socials || []).map(item => renderLink(item, 'inline-link')).join('');
  }

  function getWalletState() {
    return {
      connected: walletState.connected,
      providerType: walletState.providerType,
      address: walletState.address,
      shortAddress: shortAddr(walletState.address),
      chainId: walletState.chainId,
      signer: walletState.signer,
      ethersProvider: walletState.ethersProvider
    };
  }

  function applyWalletState(next) {
    walletState.providerType = next.providerType || null;
    walletState.wcProvider = next.wcProvider || null;
    walletState.ethersProvider = next.ethersProvider || null;
    walletState.signer = next.signer || null;
    walletState.address = next.address || '';
    walletState.chainId = Number(next.chainId || 0) || null;
    walletState.connected = !!next.address;
  }

  function emitWalletChange() {
    const snapshot = getWalletState();
    walletListeners.forEach((fn) => {
      try {
        fn(snapshot);
      } catch (_) {}
    });
    syncWalletUi();
  }

  function resetWalletState() {
    walletState.providerType = null;
    walletState.wcProvider = null;
    walletState.ethersProvider = null;
    walletState.signer = null;
    walletState.address = '';
    walletState.chainId = null;
    walletState.connected = false;
  }

  async function ensureChain(eip1193Provider) {
    if (!eip1193Provider?.request) throw new Error('Wallet provider unavailable');

    const current = await eip1193Provider.request({ method: 'eth_chainId' });
    if (String(current).toLowerCase() === String(TARGET_CHAIN_HEX).toLowerCase()) return;

    try {
      await eip1193Provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_CHAIN_HEX }]
      });
    } catch (e) {
      if (e?.code === 4902) {
        await eip1193Provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: TARGET_CHAIN_HEX,
            chainName: walletCfg.chainName,
            rpcUrls: [walletCfg.rpcUrl],
            blockExplorerUrls: [walletCfg.explorerUrl],
            nativeCurrency: walletCfg.nativeCurrency
          }]
        });

        await eip1193Provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_HEX }]
        });
      } else {
        throw e;
      }
    }
  }

  function removeMetaMaskListeners() {
    if (!window.ethereum?.removeListener) return;
    if (mmAccountsHandler) window.ethereum.removeListener('accountsChanged', mmAccountsHandler);
    if (mmChainHandler) window.ethereum.removeListener('chainChanged', mmChainHandler);
    mmAccountsHandler = null;
    mmChainHandler = null;
  }

  function removeWalletConnectListeners(wcOverride) {
    const wc = wcOverride || walletState.wcProvider;
    if (!wc?.removeListener) return;

    if (wcAccountsHandler) wc.removeListener('accountsChanged', wcAccountsHandler);
    if (wcChainHandler) wc.removeListener('chainChanged', wcChainHandler);
    if (wcDisconnectHandler) wc.removeListener('disconnect', wcDisconnectHandler);

    wcAccountsHandler = null;
    wcChainHandler = null;
    wcDisconnectHandler = null;
  }

  function bindInjectedListeners() {
    removeMetaMaskListeners();
    if (!window.ethereum?.on) return;

    mmAccountsHandler = async (accounts) => {
      if (!accounts || !accounts.length) {
        await TOSH_WALLET.disconnect();
        return;
      }
      try {
        await restoreInjectedSession();
      } catch (err) {
        console.error('[wallet] injected accountsChanged restore failed', err);
      }
    };

	mmChainHandler = async (chainHex) => {
	  try {
		const liveChainId = chainHex
		  ? parseInt(String(chainHex), 16)
		  : await getLiveChainId(window.ethereum);

		walletState.chainId = liveChainId;

		if (window.ethereum?.request && typeof ethers !== 'undefined') {
		  const accounts = await window.ethereum.request({ method: 'eth_accounts' }).catch(() => []);

		  if (!accounts || !accounts.length) {
			await TOSH_WALLET.disconnect();
			return;
		  }

		  walletState.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		  walletState.signer = walletState.ethersProvider.getSigner();
		  walletState.address = ethers.utils.getAddress(accounts[0]);
		  walletState.connected = true;
		  walletState.providerType = 'injected';
		}

		emitWalletChange();
	  } catch (err) {
		console.error('[wallet] injected chainChanged update failed', err);
	  }
	};

    window.ethereum.on('accountsChanged', mmAccountsHandler);
    window.ethereum.on('chainChanged', mmChainHandler);
  }

  function bindWalletConnectListeners(wc) {
    removeWalletConnectListeners(wc);
    if (!wc) return;

    wcAccountsHandler = async (accounts) => {
      if (!accounts || !accounts.length) {
        await TOSH_WALLET.disconnect();
        return;
      }
      try {
        await restoreWalletConnectSession();
      } catch (err) {
        console.error('[wallet] wc accountsChanged restore failed', err);
      }
    };

	wcChainHandler = async (chainId) => {
	  try {
		const liveChainId = chainId
		  ? Number(chainId)
		  : await getLiveChainId(wc);

		walletState.chainId = liveChainId;

		if (wc?.request && typeof ethers !== 'undefined') {
		  walletState.ethersProvider = new ethers.providers.Web3Provider(wc, 'any');
		  walletState.signer = walletState.ethersProvider.getSigner();

		  try {
			walletState.address = ethers.utils.getAddress(await walletState.signer.getAddress());
			walletState.connected = !!walletState.address;
			walletState.providerType = 'wc';
			walletState.wcProvider = wc;
		  } catch (_) {}
		}

		emitWalletChange();
	  } catch (err) {
		console.error('[wallet] wc chainChanged update failed', err);
	  }
	};

    wcDisconnectHandler = async () => {
      await TOSH_WALLET.disconnect();
    };

    wc.on?.('accountsChanged', wcAccountsHandler);
    wc.on?.('chainChanged', wcChainHandler);
    wc.on?.('disconnect', wcDisconnectHandler);
  }

  async function connectInjected() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not found');
    }
    if (typeof ethers === 'undefined') {
      throw new Error('ethers.js not loaded');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await ensureChain(window.ethereum);

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
    const address = ethers.utils.getAddress(await signer.getAddress());
    const liveChainId = await getLiveChainId(window.ethereum);

    removeMetaMaskListeners();
    removeWalletConnectListeners();
    resetWalletState();

    applyWalletState({
      providerType: 'injected',
      ethersProvider: provider,
      signer,
      address,
      chainId: liveChainId
    });

    localStorage.setItem(WALLET_LS_KEY, 'injected');
    bindInjectedListeners();

    closeWalletPanel();
    emitWalletChange();
    return getWalletState();
  }

  async function connectWalletConnect(options = {}) {
    if (!window.WalletConnectEthereumProvider) throw new Error('WalletConnect not loaded');
    if (typeof ethers === 'undefined') throw new Error('ethers.js not loaded');

    const silent = !!options.silent;

    const wc = await window.WalletConnectEthereumProvider.init({
      projectId: walletCfg.walletConnectProjectId,
      showQrModal: !silent,
      chains: [TARGET_CHAIN_ID],
      optionalChains: [TARGET_CHAIN_ID],
      rpcMap: { [TARGET_CHAIN_ID]: walletCfg.rpcUrl },
      metadata: {
        name: window.SITE_CONFIG.siteName || 'ToshTech',
        description: 'ToshTech shared wallet connection',
        url: location.origin,
        icons: []
      }
    });

    const hasSession =
      !!wc.session ||
      (Array.isArray(wc.accounts) && wc.accounts.length > 0);

    if (!silent || !hasSession) {
      await wc.connect({
        chains: [TARGET_CHAIN_ID],
        rpcMap: { [TARGET_CHAIN_ID]: walletCfg.rpcUrl }
      });
      try { await ensureChain(wc); } catch (_) {}
    }

    const provider = new ethers.providers.Web3Provider(wc, 'any');
    const signer = provider.getSigner();
    const address = ethers.utils.getAddress(await signer.getAddress());
    const liveChainId = await getLiveChainId(wc);

    removeMetaMaskListeners();
    removeWalletConnectListeners(wc);
    resetWalletState();

    applyWalletState({
      providerType: 'wc',
      wcProvider: wc,
      ethersProvider: provider,
      signer,
      address,
      chainId: liveChainId
    });

    localStorage.setItem(WALLET_LS_KEY, 'wc');
    bindWalletConnectListeners(wc);

    closeWalletPanel();
    emitWalletChange();
    return getWalletState();
  }

  async function restoreInjectedSession() {
    if (!window.ethereum || typeof ethers === 'undefined') return false;

    const accounts = await window.ethereum.request({ method: 'eth_accounts' }).catch(() => []);
    if (!accounts || !accounts.length) return false;

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const signer = provider.getSigner();
	const liveChainId = await getLiveChainId(window.ethereum);
	const address = ethers.utils.getAddress(accounts[0]);

    removeMetaMaskListeners();
    removeWalletConnectListeners();
    resetWalletState();

    applyWalletState({
      providerType: 'injected',
      ethersProvider: provider,
      signer,
      address,
      chainId: liveChainId
    });

    bindInjectedListeners();
    emitWalletChange();
    closeWalletPanel();
    return true;
  }

  async function restoreWalletConnectSession() {
    if (!window.WalletConnectEthereumProvider || typeof ethers === 'undefined') return false;

    const wc = await window.WalletConnectEthereumProvider.init({
      projectId: walletCfg.walletConnectProjectId,
      showQrModal: false,
      chains: [TARGET_CHAIN_ID],
      optionalChains: [TARGET_CHAIN_ID],
      rpcMap: { [TARGET_CHAIN_ID]: walletCfg.rpcUrl },
      metadata: {
        name: window.SITE_CONFIG.siteName || 'ToshTech',
        description: 'ToshTech shared wallet connection',
        url: location.origin,
        icons: []
      }
    });

    const hasSession =
      !!wc.session ||
      (Array.isArray(wc.accounts) && wc.accounts.length > 0);

    if (!hasSession) {
      try { await wc.disconnect?.(); } catch (_) {}
      return false;
    }

    const provider = new ethers.providers.Web3Provider(wc, 'any');
    const signer = provider.getSigner();

    let address;
    try {
      address = ethers.utils.getAddress(await signer.getAddress());
    } catch (_) {
      return false;
    }

    const liveChainId = await getLiveChainId(wc);

    removeMetaMaskListeners();
    removeWalletConnectListeners(wc);
    resetWalletState();

    applyWalletState({
      providerType: 'wc',
      wcProvider: wc,
      ethersProvider: provider,
      signer,
      address,
      chainId: liveChainId
    });

    bindWalletConnectListeners(wc);
    emitWalletChange();
    closeWalletPanel();
    return true;
  }

  async function attemptAutoReconnect() {
    const last = localStorage.getItem(WALLET_LS_KEY);

    try {
      if (last === 'wc') {
        if (await restoreWalletConnectSession()) return;
        if (await restoreInjectedSession()) return;
        return;
      }

      if (last === 'injected') {
        if (await restoreInjectedSession()) return;
        if (await restoreWalletConnectSession()) return;
        return;
      }

      await restoreInjectedSession();
    } catch (err) {
      console.warn('[wallet] auto reconnect skipped', err);
    }
  }

  function getWalletPanel() {
    return document.getElementById('wallet-panel');
  }

  function openWalletPanel() {
    const panel = getWalletPanel();
    if (!panel) return;
    panel.hidden = false;
    panel.style.display = 'flex';
    panel.setAttribute('aria-hidden', 'false');
  }

  function closeWalletPanel() {
    const panel = getWalletPanel();
    if (!panel) return;
    panel.hidden = true;
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');
  }

function syncWalletUi() {
  const connected = walletState.connected && walletState.address;
  const onRightChain = Number(walletState.chainId) === TARGET_CHAIN_ID;
  const providerLabel = walletProviderLabel(walletState.providerType);
  const providerIcon = walletProviderIcon(walletState.providerType);

  const chip = document.getElementById('wallet-chip');
  const chipText = document.getElementById('wallet-chip-text');
  const chipSub = document.getElementById('wallet-chip-sub');
  const chipDot = document.getElementById('wallet-chip-dot');
  const chipIcon = document.getElementById('wallet-chip-icon');

  const mobileWalletChip = document.getElementById('mobile-wallet-chip');
  const mobileWalletChipText = document.getElementById('mobile-wallet-chip-text');
  const mobileWalletChipDot = document.getElementById('mobile-wallet-chip-dot');
  const mobileWalletChipIcon = document.getElementById('mobile-wallet-chip-icon');

  const panelStatus = document.getElementById('wallet-panel-status');
  const panelAddress = document.getElementById('wallet-panel-address');
  const panelChainLabel = document.getElementById('wallet-panel-chain');
  const panelLogo = document.getElementById('wallet-panel-logo');
  const networkDot = document.getElementById('wallet-network-dot');
  const panelOrb = document.getElementById('wallet-panel-orb');

  const connectBlock = document.getElementById('wallet-connect-actions');
  const connectedBlock = document.getElementById('wallet-connected-actions');
  const mobileButton = document.getElementById('mobile-wallet-button');
  const copyBtn = document.getElementById('wallet-copy-address');
  const switchChainBtn = document.getElementById('wallet-switch-chain');
  
  chip?.classList.toggle('is-connected', !!connected && onRightChain);
  chip?.classList.toggle('is-wrong-chain', !!connected && !onRightChain);

  if (chipIcon) chipIcon.innerHTML = providerIcon;
  if (chipText) chipText.textContent = connected ? shortAddr(walletState.address) : 'Connect';
  if (chipSub) chipSub.textContent = connected ? providerLabel : 'PEPU L2 wallet';
  if (chipDot) {
    chipDot.classList.toggle('is-connected', !!connected && onRightChain);
    chipDot.classList.toggle('is-wrong-chain', !!connected && !onRightChain);
  }

  if (mobileWalletChipIcon) mobileWalletChipIcon.innerHTML = providerIcon;
  if (mobileWalletChipText) {
    if (!connected) mobileWalletChipText.textContent = 'Connect';
    else if (onRightChain) mobileWalletChipText.textContent = shortAddr(walletState.address);
    else mobileWalletChipText.textContent = 'Wrong chain';
  }

  if (mobileWalletChip) {
    mobileWalletChip.classList.toggle('is-connected', !!connected && onRightChain);
    mobileWalletChip.classList.toggle('is-wrong-chain', !!connected && !onRightChain);
    mobileWalletChip.setAttribute('aria-label', connected ? `Wallet ${shortAddr(walletState.address)}` : 'Connect wallet');
  }

  if (mobileWalletChipDot) {
    mobileWalletChipDot.classList.toggle('is-connected', !!connected && onRightChain);
    mobileWalletChipDot.classList.toggle('is-wrong-chain', !!connected && !onRightChain);
  }

  if (panelLogo) panelLogo.innerHTML = providerIcon;
  if (networkDot) {
    networkDot.classList.toggle('is-connected', !!connected && onRightChain);
    networkDot.classList.toggle('is-wrong-chain', !!connected && !onRightChain);
  }

  if (panelStatus) {
    if (!connected) panelStatus.textContent = 'Choose a wallet provider';
    else if (onRightChain) panelStatus.textContent = `${providerLabel} connected`;
    else panelStatus.textContent = `Wrong chain · ${walletState.chainId}`;
  }

  if (panelAddress) panelAddress.textContent = connected ? walletState.address : '—';
  if (panelChainLabel) {
    panelChainLabel.textContent = connected
      ? (onRightChain ? `PEPU L2 · ${TARGET_CHAIN_ID}` : `Wrong chain · ${walletState.chainId}`)
      : `PEPU L2 · ${TARGET_CHAIN_ID}`;
  }

  if (connectBlock) connectBlock.hidden = !!connected;
  if (connectedBlock) connectedBlock.hidden = !connected;

  if (mobileButton) {
    if (!connected) mobileButton.textContent = 'Connect Wallet';
    else if (onRightChain) mobileButton.textContent = shortAddr(walletState.address);
    else mobileButton.textContent = 'Wrong chain';
  }
if (panelOrb) {
  panelOrb.innerHTML = connected ? providerIcon : walletIcons.none;
}

if (switchChainBtn) {
  switchChainBtn.hidden = !(connected && !onRightChain);
  switchChainBtn.textContent = 'Switch to PEPU L2';
}
  if (copyBtn) copyBtn.textContent = 'Copy address';
}

function bindWalletUi() {
  if (walletUiBound) {
    syncWalletUi();
    return;
  }

  walletUiBound = true;

  const chip = document.getElementById('wallet-chip');
  const mobileWalletChip = document.getElementById('mobile-wallet-chip');
  const panel = document.getElementById('wallet-panel');
  const card = panel?.querySelector('.wallet-panel-card');
  const panelClose = document.getElementById('wallet-panel-close');
  const mmBtn = document.getElementById('wallet-connect-mm');
  const wcBtn = document.getElementById('wallet-connect-wc');
  const disconnectBtn = document.getElementById('wallet-disconnect');
  const mobileWalletButton = document.getElementById('mobile-wallet-button');
  const copyBtn = document.getElementById('wallet-copy-address');
  const switchChainBtn = document.getElementById('wallet-switch-chain');
  if (!panel) return;

  closeWalletPanel();

  chip?.addEventListener('click', openWalletPanel);
  mobileWalletChip?.addEventListener('click', openWalletPanel);
  mobileWalletButton?.addEventListener('click', openWalletPanel);
  panelClose?.addEventListener('click', closeWalletPanel);

  panel.addEventListener('click', (e) => {
    if (e.target === panel) closeWalletPanel();
  });

  card?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  mmBtn?.addEventListener('click', async () => {
    try {
      await TOSH_WALLET.connect('injected');
    } catch (e) {
      console.error('[wallet] MetaMask connect failed:', e);
      alert(e?.message || String(e));
    }
  });

  wcBtn?.addEventListener('click', async () => {
    closeWalletPanel();
    setTimeout(async () => {
      try {
        await TOSH_WALLET.connect('wc');
      } catch (e) {
        console.error('[wallet] WalletConnect connect failed:', e);
        alert(e?.message || String(e));
      }
    }, 50);
  });

  disconnectBtn?.addEventListener('click', async () => {
    await TOSH_WALLET.disconnect();
    closeWalletPanel();
  });

switchChainBtn?.addEventListener('click', async () => {
  try {
    switchChainBtn.disabled = true;
    switchChainBtn.textContent = 'Switching...';

    await TOSH_WALLET.ensureChain();

    switchChainBtn.textContent = 'Switched';
    setTimeout(syncWalletUi, 800);
  } catch (e) {
    console.error('[wallet] chain switch failed:', e);

    alert(
      e?.message ||
      'Could not switch chain. Please switch network manually in your wallet.'
    );

    syncWalletUi();
  } finally {
    switchChainBtn.disabled = false;
  }
});

  copyBtn?.addEventListener('click', async () => {
    if (!walletState.address) return;
    try {
      await navigator.clipboard.writeText(walletState.address);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        const freshBtn = document.getElementById('wallet-copy-address');
        if (freshBtn) freshBtn.textContent = 'Copy address';
      }, 1200);
    } catch (_) {}
  });

  syncWalletUi();
}

  async function mountWallet() {
    if (!walletCfg.enabled) return getWalletState();

    bindWalletUi();

    if (!walletMounted) {
      walletMounted = true;
      try {
        await attemptAutoReconnect();
      } catch (err) {
        console.warn('[wallet] auto reconnect failed', err);
      }
    }

    closeWalletPanel();
    syncWalletUi();
    return getWalletState();
  }

  function mountHeader() {
    const root = document.getElementById('site-header-root');
    if (!root) return;

    root.innerHTML = `
      <header class="site-header">
        <div class="site-shell">
          <div class="site-nav">
            <a href="index.html" class="brand" aria-label="${window.SITE_CONFIG.siteName} home">
              <img src="assets/logo.png" alt="$TOSH logo" class="brand-logo">
              <span>${window.SITE_CONFIG.siteName}</span>
            </a>

            <nav class="nav-links" aria-label="Primary navigation">
              ${(window.SITE_NAV || []).map(renderDesktopItem).join('')}
            </nav>

			<div class="nav-cta">
			  ${walletCfg.enabled ? `
<button class="wallet-chip" id="wallet-chip" type="button" aria-label="Wallet">
  <span class="wallet-chip-icon" id="wallet-chip-icon">
    <span class="wallet-chip-placeholder"></span>
  </span>
  <span class="wallet-chip-main">
    <span class="wallet-chip-label" id="wallet-chip-text">Connect</span>
    <span class="wallet-chip-sub" id="wallet-chip-sub">PEPU L2 wallet</span>
  </span>
  <span class="wallet-chip-dot" id="wallet-chip-dot"></span>
</button>
			  ` : ''}

			  <a class="button" href="${window.SITE_CONFIG.cta.href}" target="_blank" rel="noopener noreferrer">${window.SITE_CONFIG.cta.label}</a>
			</div>

			<div class="mobile-header-actions">
			  ${walletCfg.enabled ? `
<button class="mobile-wallet-chip" id="mobile-wallet-chip" type="button" aria-label="Wallet">
  <span class="mobile-wallet-chip-icon" id="mobile-wallet-chip-icon">
    <span class="wallet-chip-placeholder"></span>
  </span>
  <span class="mobile-wallet-chip-text" id="mobile-wallet-chip-text">Connect</span>
  <span class="mobile-wallet-chip-dot" id="mobile-wallet-chip-dot"></span>
</button>
			  ` : ''}

			  <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
			</div>
          </div>
          <div class="mobile-menu" id="mobile-menu">
            <div class="mobile-panel">
              ${(window.SITE_NAV || []).map(renderMobileItem).join('')}
              ${walletCfg.enabled ? `<button class="button-secondary" id="mobile-wallet-button" type="button">Connect Wallet</button>` : ''}
              <a class="button" href="${window.SITE_CONFIG.cta.href}" target="_blank" rel="noopener noreferrer">${window.SITE_CONFIG.cta.label}</a>
            </div>
          </div>
        </div>
      </header>

${walletCfg.enabled ? `
  <div class="wallet-panel-backdrop" id="wallet-panel" hidden aria-hidden="true">
    <div class="wallet-panel-card wallet-panel-compact">
      <button type="button" class="wallet-panel-close" id="wallet-panel-close" aria-label="Close wallet panel">×</button>

      <div class="wallet-panel-hero">
        <div class="wallet-panel-orb" id="wallet-panel-orb">
          <span class="wallet-chip-placeholder"></span>
        </div>
        <div>
          <strong>Wallet Center</strong>
          <span id="wallet-panel-status">Not connected</span>
        </div>
      </div>

      <div class="wallet-panel-network">
        <span class="wallet-network-dot" id="wallet-network-dot"></span>
        <span id="wallet-panel-chain">PEPU L2 · 97741</span>
      </div>

      <div id="wallet-connect-actions" class="wallet-connect-compact">
        <button type="button" class="wallet-provider-mini" id="wallet-connect-mm">
          <span class="wallet-provider-icon-mini">${walletIcons.mm || walletIcons.none}</span>
          <span>
            <strong>MetaMask</strong>
            <small>Browser wallet</small>
          </span>
        </button>

        <button type="button" class="wallet-provider-mini" id="wallet-connect-wc">
          <span class="wallet-provider-icon-mini">${walletIcons.wc || walletIcons.none}</span>
          <span>
            <strong>WalletConnect</strong>
            <small>Mobile / QR wallet</small>
          </span>
        </button>
      </div>

      <div id="wallet-connected-actions" class="wallet-connected-compact" hidden>
        <div class="wallet-address-card">
          <span>Connected address</span>
          <strong id="wallet-panel-address">—</strong>
        </div>

        <div class="wallet-quick-actions">
          ${(walletCfg.quickLinks || []).map(link => `<a href="${link.href}" class="wallet-quick-link">${link.label}</a>`).join('')}
        </div>

		<div class="wallet-panel-actions">

		  <button type="button" class="wallet-panel-button soft" id="wallet-copy-address">
			Copy
		  </button>

		  <button type="button" class="wallet-panel-button danger" id="wallet-disconnect">
			Disconnect
		  </button>
	  
		  <button
			type="button"
			class="wallet-panel-button green"
			id="wallet-switch-chain"
			hidden
		  >
			Switch to PEPU L2
		  </button>
		  
		</div>
      </div>
    </div>
  </div>
` : ''}
    `;

    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.textContent = isOpen ? '✕' : '☰';
      });
    }

    document.querySelectorAll('.mobile-group-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) target.classList.toggle('is-open');
      });
    });

    if (walletCfg.enabled) {
      mountWallet();
    }
  }

function renderFooterSocials() {
  const socials = window.SITE_CONFIG?.socials || [];

  const iconFor = (label = "") => {
    const key = label.toLowerCase();

    if (key.includes("telegram")) {
      return `
        <svg viewBox="0 0 50 50" aria-hidden="true">
          <path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445
          c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758
          c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125
          c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077
          C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path>
        </svg>
      `;
    }

    if (key === "x" || key.includes("twitter")) {
      return `
        <svg viewBox="0 0 256 256" aria-hidden="true">
          <path d="M38.81,30l66.46,88.78L38,226h32.42l49.69-59.24L164.19,226H226l-70.2-93.82L218,30h-32.42l-44.5,53.12L100.62,30z"></path>
        </svg>
      `;
    }

    return null;
  };

  return socials
    .map((item) => {
      const icon = iconFor(item.label || "");
      if (!icon) return "";
      return `
        <a href="${item.href}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="${item.label}">
          ${icon}
        </a>
      `;
    })
    .join("");
}

function mountFooter() {
  const root = document.getElementById('site-footer-root');
  if (!root) return;

  root.innerHTML = `
    <footer class="site-footer site-footer-simple">
      <div class="site-shell footer-simple-wrap">
        <a href="index.html" class="footer-simple-logo" aria-label="${window.SITE_CONFIG.siteName} home">
          <img src="assets/logo.png" alt="$TOSH logo" class="brand-logo">
        </a>

        <p class="footer-simple-text">Built with ❤️ for PEPU L2.</p>

        <div class="footer-simple-socials" aria-label="Social links">
          ${renderFooterSocials()}
        </div>
      </div>
		      <div class="site-shell footer-note footer-note-simple">
        Disclaimer: $TOSH is a community-driven project. Participation involves risk. Not financial advice. DYOR.
      </div>
    </footer>
  `;
}
  window.TOSH_WALLET = {
    mount: mountWallet,
    init: mountWallet,

    getState() {
      return getWalletState();
    },

    isConnected() {
      return !!walletState.connected;
    },

    isOnTargetChain() {
      return isTargetChain(walletState.chainId);
    },

    getAddress() {
      return walletState.address || '';
    },

    getSigner() {
      return walletState.signer || null;
    },

    getProvider() {
      return walletState.ethersProvider || null;
    },

    openPanel() {
      openWalletPanel();
    },

    closePanel() {
      closeWalletPanel();
    },

    async connect(type = 'injected') {
      if (type === 'wc') return connectWalletConnect();
      return connectInjected();
    },

	async ensureChain() {
	  let providerLike = null;

	  if (walletState.providerType === 'wc' && walletState.wcProvider?.request) {
		providerLike = walletState.wcProvider;
	  } else if (walletState.providerType === 'injected' && window.ethereum?.request) {
		providerLike = window.ethereum;
	  } else if (window.ethereum?.request) {
		providerLike = window.ethereum;
	  }

	  if (!providerLike) throw new Error('Wallet provider unavailable');

	  chainSwitchInProgress = true;

	  try {
			await ensureChain(providerLike);

			if (walletState.providerType === 'wc' && walletState.wcProvider?.setDefaultChain) {
			  try {
				await walletState.wcProvider.setDefaultChain(TARGET_CHAIN_ID);
			  } catch (_) {}
			}

			// Give wallet time to finish updating internally.
			await delay(700);

		const freshChainId = await getLiveChainId(providerLike);

		if (!freshChainId) {
		  throw new Error('Could not read current chain after switching.');
		}

		walletState.chainId = freshChainId;

		// Rebuild ethers provider/signer after the switch.
		if (walletState.providerType === 'wc' && walletState.wcProvider?.request) {
		  walletState.ethersProvider = new ethers.providers.Web3Provider(walletState.wcProvider, 'any');
		} else if (walletState.providerType === 'injected' && window.ethereum?.request) {
		  walletState.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
		}

		if (walletState.ethersProvider) {
		  walletState.signer = walletState.ethersProvider.getSigner();

		  try {
			walletState.address = ethers.utils.getAddress(await walletState.signer.getAddress());
			walletState.connected = !!walletState.address;
		  } catch (_) {}
		}

		emitWalletChange();

		if (!isTargetChain(walletState.chainId)) {
		  throw new Error(`Still on wrong chain: ${walletState.chainId}`);
		}

		return getWalletState();
	  } finally {
		chainSwitchInProgress = false;
	  }
	},
    async disconnect() {
      const oldWc = walletState.wcProvider;

      try {
        removeMetaMaskListeners();
        removeWalletConnectListeners(oldWc);

        if (walletState.providerType === 'wc' && oldWc?.disconnect) {
          await oldWc.disconnect();
        }
      } catch (_) {}

      localStorage.removeItem(WALLET_LS_KEY);
      resetWalletState();
      closeWalletPanel();
      emitWalletChange();
    },

    async requireConnected(type = 'injected') {
      if (!walletState.connected) {
        await this.connect(type);
      }
      return getWalletState();
    },

    onChange(fn) {
      walletListeners.add(fn);
      return () => walletListeners.delete(fn);
    }
  };

  window.TOSH_SITE = { mountHeader, mountFooter };
})();