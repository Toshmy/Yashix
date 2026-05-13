(function(){
  const cfg = window.YASHIX_CONFIG || {};
  const chain = cfg.chain || {};
  const state = {
    connected:false,
    address:"",
    chainId:null,
    provider:null,
    ethersProvider:null,
    signer:null
  };
  const listeners = new Set();
  const $ = id => document.getElementById(id);

  function shortAddr(addr){ return addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : ""; }
  function emit(){ listeners.forEach(fn => { try{ fn({...state}); } catch(e){ console.error(e); } }); updateWalletUi(); }
  function onChange(fn){ listeners.add(fn); return () => listeners.delete(fn); }
  function isTargetChain(id){ return Number(id) === Number(chain.id); }

  async function readChainId(provider){
    const hex = await provider.request({ method:"eth_chainId" });
    return Number.parseInt(hex,16);
  }

  function bindProviderEvents(provider){
    if (!provider || provider.__yashixBound) return;
    provider.__yashixBound = true;
    provider.on?.("accountsChanged", accounts => {
      if (!accounts || !accounts[0]) disconnect(false);
      else {
        state.address = ethers.utils.getAddress(accounts[0]);
        refreshChain();
      }
    });
    provider.on?.("chainChanged", hex => {
      state.chainId = Number.parseInt(hex,16);
      if (state.ethersProvider) state.ethersProvider = new ethers.providers.Web3Provider(state.provider,"any");
      if (state.ethersProvider) state.signer = state.ethersProvider.getSigner();
      emit();
    });
    provider.on?.("disconnect", () => disconnect(false));
  }

  async function refreshChain(){
    if (!state.provider) return;
    try { state.chainId = await readChainId(state.provider); }
    catch { state.chainId = null; }
    state.ethersProvider = new ethers.providers.Web3Provider(state.provider,"any");
    state.signer = state.ethersProvider.getSigner();
    emit();
  }

  async function connect(){
    if (!window.ethereum) {
      openPanel("No browser wallet was found. Install MetaMask or open this page inside your wallet browser.");
      throw new Error("No browser wallet found");
    }
    const accounts = await window.ethereum.request({ method:"eth_requestAccounts" });
    if (!accounts || !accounts[0]) throw new Error("No wallet account returned");
    state.provider = window.ethereum;
    bindProviderEvents(state.provider);
    state.address = ethers.utils.getAddress(accounts[0]);
    state.connected = true;
    await refreshChain();
    await ensureChain().catch(() => {});
    closePanel();
    return {...state};
  }

  async function ensureChain(){
    if (!state.provider) throw new Error("Connect wallet first");
    const live = await readChainId(state.provider);
    state.chainId = live;
    if (isTargetChain(live)) { emit(); return true; }
    try {
      await state.provider.request({ method:"wallet_switchEthereumChain", params:[{ chainId: chain.hex }] });
    } catch(err) {
      if (err && (err.code === 4902 || String(err.message || "").includes("Unrecognized chain"))) {
        await state.provider.request({
          method:"wallet_addEthereumChain",
          params:[{
            chainId: chain.hex,
            chainName: chain.name,
            rpcUrls:[chain.rpcUrl],
            blockExplorerUrls:[chain.explorerUrl],
            nativeCurrency: chain.nativeCurrency
          }]
        });
        await state.provider.request({ method:"wallet_switchEthereumChain", params:[{ chainId: chain.hex }] });
      } else {
        throw err;
      }
    }
    await refreshChain();
    return isTargetChain(state.chainId);
  }

  function disconnect(emitChange=true){
    state.connected = false;
    state.address = "";
    state.chainId = null;
    state.provider = null;
    state.ethersProvider = null;
    state.signer = null;
    if (emitChange) emit(); else updateWalletUi();
  }

  function getSigner(){ return state.signer; }
  function getState(){ return {...state}; }
  function isConnected(){ return !!(state.connected && state.address); }

  function openPanel(message){
    const panel = $("walletPanelBackdrop");
    const msg = $("walletPanelMessage");
    if (msg && message) msg.textContent = message;
    if (panel) panel.hidden = false;
  }
  function closePanel(){ const panel = $("walletPanelBackdrop"); if (panel) panel.hidden = true; }

  function updateWalletUi(){
    const connected = isConnected();
    const right = connected && isTargetChain(state.chainId);
    const text = connected ? shortAddr(state.address) : "Connect";
    const sub = connected ? (right ? chain.name : "Switch network") : "PEPU L2";
    const buttons = document.querySelectorAll("[data-wallet-button]");
    buttons.forEach(btn => {
      btn.classList.toggle("is-connected", connected && right);
      btn.classList.toggle("is-wrong-chain", connected && !right);
      const label = btn.querySelector("[data-wallet-label]");
      const subEl = btn.querySelector("[data-wallet-sub]");
      const dot = btn.querySelector(".wallet-dot");
      if (label) label.textContent = text;
      if (subEl) subEl.textContent = sub;
      if (dot) {
        dot.classList.toggle("is-connected", connected && right);
        dot.classList.toggle("is-wrong-chain", connected && !right);
      }
    });

    const addressEl = $("walletPanelAddress");
    if (addressEl) addressEl.textContent = connected ? state.address : "Not connected";
    const networkEl = $("walletPanelNetwork");
    if (networkEl) networkEl.textContent = connected ? (right ? chain.name : `Connected chain ${state.chainId}`) : chain.name;
    const connectBlock = $("walletConnectBlock");
    const connectedBlock = $("walletConnectedBlock");
    if (connectBlock) connectBlock.hidden = connected;
    if (connectedBlock) connectedBlock.hidden = !connected;
  }

  function mountNav(){
    const links = (cfg.nav || []).map(item => `<a class="nav-link${location.pathname.endsWith(item.href) ? " is-active" : ""}" href="${item.href}">${item.label}</a>`).join("");
    const mobileLinks = (cfg.nav || []).map(item => `<a class="mobile-link" href="${item.href}">${item.label}</a>`).join("");
    const header = $("siteHeader");
    if (header) {
      header.innerHTML = `
        <div class="site-shell">
          <div class="site-nav">
            <a class="brand" href="${cfg.mainSite || "https://yashix.com"}" aria-label="YASHIX home">
              <img class="brand-logo" src="${cfg.logo || "assets/img/logo.png"}" alt="YASHIX">
              <span class="brand-text"><span class="brand-title">YASHIX</span><span class="brand-subtitle">Migration</span></span>
            </a>
            <nav class="nav-links" aria-label="Main navigation">${links}</nav>
            <div class="header-actions">
              <button class="wallet-chip" type="button" data-wallet-button aria-label="Connect wallet">
                <span class="wallet-orb" aria-hidden="true"></span>
                <span class="wallet-text"><span class="wallet-label" data-wallet-label>Connect</span><span class="wallet-sub" data-wallet-sub>PEPU L2</span></span>
                <span class="wallet-dot" aria-hidden="true"></span>
              </button>
              <button class="mobile-toggle" type="button" id="mobileToggle" aria-label="Open menu">☰</button>
            </div>
          </div>
          <div class="mobile-menu" id="mobileMenu"><div class="mobile-panel">${mobileLinks}</div></div>
        </div>`;
    }

    const footer = $("siteFooter");
    if (footer) {
      footer.innerHTML = `
        <div class="site-shell footer-wrap">
          <span>© ${new Date().getFullYear()} YASHIX. DeFi & Real World Assets.</span>
          <span class="footer-links"><a href="https://yashix.com">Main site</a><a href="index.html">Migration</a></span>
        </div>`;
    }

    const toggle = $("mobileToggle");
    const menu = $("mobileMenu");
    toggle?.addEventListener("click", () => {
      menu?.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", menu?.classList.contains("is-open"));
    });
  }

  function mountWalletPanel(){
    if ($("walletPanelBackdrop")) return;
    const div = document.createElement("div");
    div.id = "walletPanelBackdrop";
    div.className = "wallet-panel-backdrop";
    div.hidden = true;
    div.innerHTML = `
      <section class="wallet-panel" role="dialog" aria-modal="true" aria-label="Wallet connection">
        <button class="wallet-close" type="button" id="walletPanelClose" aria-label="Close">×</button>
        <div class="wallet-panel-head">
          <span class="wallet-orb" aria-hidden="true"></span>
          <div><strong>Connect wallet</strong><span id="walletPanelMessage">Connect on PEPU L2 to migrate YASH.</span></div>
        </div>
        <div class="wallet-network"><span class="wallet-dot" aria-hidden="true"></span><span id="walletPanelNetwork">${chain.name || "PEPU L2"}</span></div>
        <div id="walletConnectBlock" class="wallet-actions">
          <button class="button" id="walletConnectBtn" type="button">Connect browser wallet</button>
          <p class="small-note">Use MetaMask or your wallet browser. The page will ask to switch to PEPU L2 if needed.</p>
        </div>
        <div id="walletConnectedBlock" hidden>
          <div class="wallet-account"><span>Connected wallet</span><strong id="walletPanelAddress">Not connected</strong></div>
          <div class="wallet-actions">
            <button class="button" id="walletSwitchBtn" type="button">Switch to PEPU L2</button>
            <button class="button-secondary" id="walletDisconnectBtn" type="button">Disconnect</button>
          </div>
        </div>
      </section>`;
    document.body.appendChild(div);

    div.addEventListener("click", e => { if (e.target === div) closePanel(); });
    $("walletPanelClose")?.addEventListener("click", closePanel);
    $("walletConnectBtn")?.addEventListener("click", () => connect().catch(err => openPanel(err.message || String(err))));
    $("walletSwitchBtn")?.addEventListener("click", () => ensureChain().catch(err => openPanel(err.message || String(err))));
    $("walletDisconnectBtn")?.addEventListener("click", disconnect);
  }

  function mount(){
    mountNav();
    mountWalletPanel();
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-wallet-button],[data-open-wallet]");
      if (btn) openPanel();
    });
    updateWalletUi();
  }

  window.YASHIX_WALLET = { connect, disconnect, ensureChain, getSigner, getState, onChange, isConnected, openPanel, closePanel, shortAddr };
  document.addEventListener("DOMContentLoaded", mount);
})();
