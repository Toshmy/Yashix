// YASHIX - Add ETH YASH token to MetaMask / compatible wallets
// Version: v4_20260909_2019
// Purpose: inject a top-bar button next to the wallet button and add ETH YASH via wallet_watchAsset.
// Does NOT force wallet connect with eth_requestAccounts.

(function () {
  "use strict";

  const VERSION = "v4_20260909_2019";
  const ETH_MAINNET_CHAIN_ID = "0x1";

  const YASH_ETH_TOKEN = {
    address: "0xac49952f9deD5f8e7106642A6C991a6418a97536",
    symbol: "YASH",
    decimals: 18,
    image: "https://migrate.yashix.com/assets/img/yashix-logo-256.png"
  };

  const METAMASK_ICON = `
    <svg viewBox="0 0 35 34" aria-hidden="true" focusable="false">
      <path d="M32.7077 32.7522L25.1688 30.5174L19.4833 33.9008L15.5167 33.8991L9.82793 30.5174L2.29225 32.7522L0 25.0489L2.29225 16.4993L0 9.27094L2.29225 0.312256L14.0674 7.31554H20.9326L32.7077 0.312256L35 9.27094L32.7077 16.4993L35 25.0489L32.7077 32.7522Z" fill="#FF5C16"/>
      <path d="M2.29395 0.312256L14.0691 7.32047L13.6008 12.1301L2.29395 0.312256Z" fill="#FF5C16"/>
      <path d="M32.7077 0.312256L20.9326 7.32047L21.3993 12.1301L32.7077 0.312256Z" fill="#FF5C16"/>
      <path d="M0 25.0488L2.29225 16.4993H7.22183L7.23991 20.9967L14.0394 22.676L16.0343 27.8389L15.0089 28.976L9.82793 25.0472H0Z" fill="#FF8D5D"/>
      <path d="M35.0001 25.0488L32.7078 16.4993H27.7783L27.7602 20.9967L20.9607 22.676L18.9658 27.8389L19.9912 28.976L25.1722 25.0472H35.0001Z" fill="#FF8D5D"/>
      <path d="M20.9325 7.31543H17.4999H14.0673L13.6006 12.1251L16.0342 27.834H18.9656L21.4008 12.1251L20.9325 7.31543Z" fill="#FF8D5D"/>
      <path d="M2.29225 0.312256L0 9.27094L2.29225 16.4993H7.22183L13.5991 12.1301L2.29225 0.312256Z" fill="#661800"/>
      <path d="M32.7077 0.312256L34.9999 9.27094L32.7077 16.4993H27.7781L21.4009 12.1301L32.7077 0.312256Z" fill="#661800"/>
      <path d="M19.4816 30.8359V33.9021H15.5166V30.8359H19.4816Z" fill="#C0C4CE"/>
      <path d="M9.82959 30.5142L15.52 33.9008V30.8346L15.0106 28.9778L9.82959 30.5142Z" fill="#E7EBF6"/>
      <path d="M25.1721 30.5142L19.4817 33.9008V30.8346L19.9911 28.9778L25.1721 30.5142Z" fill="#E7EBF6"/>
    </svg>`;

  const IDS = {
    desktop: "add-yash-eth-token-topbar",
    mobileTop: "add-yash-eth-token-mobile-top",
    mobileMenu: "add-yash-eth-token-mobile-menu",
    style: "add-yash-eth-token-style-v4"
  };

  function isMobileLike() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  }

  function setText(id, text) {
    const el = document.querySelector(`#${id} .yash-add-token-label`);
    if (el) el.textContent = text;
  }

  function setBusy(isBusy, text) {
    Object.values(IDS).forEach((id) => {
      if (id === IDS.style) return;
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.disabled = isBusy;
      if (text) setText(id, text);
    });
  }

  function resetTextSoon() {
    setTimeout(() => {
      [IDS.desktop, IDS.mobileTop, IDS.mobileMenu].forEach((id) => setText(id, "YASH ETH TOKEN"));
    }, 1800);
  }

  function injectStyles() {
    if (document.getElementById(IDS.style)) return;

    const style = document.createElement("style");
    style.id = IDS.style;
    style.textContent = `
      .yash-add-token-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: .52rem;
        min-height: 44px;
        padding: .45rem .72rem;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at 0 0, rgba(255,92,22,.20), transparent 38%),
          radial-gradient(circle at 100% 0, rgba(0,255,174,.14), transparent 42%),
          linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.035));
        color: #eafff7;
        font: inherit;
        font-weight: 950;
        letter-spacing: -.015em;
        cursor: pointer;
        transition: transform .14s ease, border-color .14s ease, box-shadow .14s ease, filter .14s ease;
        box-shadow: 0 16px 42px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.08);
        white-space: nowrap;
      }
      .yash-add-token-btn:hover {
        transform: translateY(-1px);
        border-color: rgba(255,136,58,.42);
        box-shadow: 0 18px 48px rgba(255,92,22,.12), 0 16px 42px rgba(0,0,0,.28);
        filter: brightness(1.03);
      }
      .yash-add-token-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }
      .yash-add-token-icon {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: #07111e;
        border: 1px solid rgba(255,255,255,.10);
        box-shadow: 0 0 0 4px rgba(255,92,22,.045);
        flex: 0 0 auto;
      }
      .yash-add-token-icon svg { width: 22px; height: 22px; display: block; }
      .yash-add-token-copy { display: grid; line-height: 1.08; text-align: left; }
      .yash-add-token-label { font-size: .82rem; color: #fff7ed; }
      .yash-add-token-sub { margin-top: .1rem; font-size: .62rem; color: #ffc69f; font-weight: 800; }
      .yash-add-token-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #ff7a1a;
        box-shadow: 0 0 0 3px rgba(255,122,26,.14), 0 0 18px rgba(255,122,26,.32);
        flex: 0 0 auto;
      }
      .yash-add-token-btn.is-icon-only {
        width: 44px;
        min-width: 44px;
        height: 42px;
        min-height: 42px;
        padding: .35rem;
      }
      .yash-add-token-btn.is-icon-only .yash-add-token-copy,
      .yash-add-token-btn.is-icon-only .yash-add-token-dot { display: none; }
      .mobile-panel .yash-add-token-btn { width: 100%; margin-bottom: .65rem; }
      @media (max-width: 1180px) {
        .nav-cta .yash-add-token-sub { display: none; }
        .nav-cta .yash-add-token-label { font-size: .74rem; }
      }
      @media (max-width: 760px) {
        .nav-cta > .yash-add-token-btn { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function makeButton(id, iconOnly) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.className = "yash-add-token-btn" + (iconOnly ? " is-icon-only" : "");
    btn.dataset.addYashEthToken = "true";
    btn.setAttribute("aria-label", "Add ETH YASH token to wallet");
    btn.title = "Add ETH YASH token to MetaMask";
    btn.innerHTML = `
      <span class="yash-add-token-icon" aria-hidden="true">${METAMASK_ICON}</span>
      <span class="yash-add-token-copy">
        <span class="yash-add-token-label">YASH ETH TOKEN</span>
        <span class="yash-add-token-sub">Add to wallet</span>
      </span>
      <span class="yash-add-token-dot" aria-hidden="true"></span>`;
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addYashEthToken();
    });
    return btn;
  }

  function injectDesktopButton() {
    const navCta = document.querySelector(".nav-cta");
    if (!navCta || document.getElementById(IDS.desktop)) return;

    const btn = makeButton(IDS.desktop, false);
    const walletChip = document.getElementById("wallet-chip");

    if (walletChip && walletChip.parentElement === navCta) {
      walletChip.insertAdjacentElement("afterend", btn);
    } else {
      navCta.prepend(btn);
    }
  }

  function injectMobileTopButton() {
    const mobileActions = document.querySelector(".mobile-header-actions");
    if (!mobileActions || document.getElementById(IDS.mobileTop)) return;

    const btn = makeButton(IDS.mobileTop, true);
    const mobileWalletChip = document.getElementById("mobile-wallet-chip");
    const menuToggle = document.getElementById("mobile-menu-toggle");

    if (mobileWalletChip && mobileWalletChip.parentElement === mobileActions) {
      mobileWalletChip.insertAdjacentElement("afterend", btn);
    } else if (menuToggle && menuToggle.parentElement === mobileActions) {
      mobileActions.insertBefore(btn, menuToggle);
    } else {
      mobileActions.appendChild(btn);
    }
  }

  function injectMobileMenuButton() {
    const mobilePanel = document.querySelector("#mobile-menu .mobile-panel, .mobile-menu .mobile-panel");
    if (!mobilePanel || document.getElementById(IDS.mobileMenu)) return;

    const btn = makeButton(IDS.mobileMenu, false);
    mobilePanel.insertBefore(btn, mobilePanel.firstChild);
  }

  function injectAllButtons() {
    injectStyles();
    injectDesktopButton();
    injectMobileTopButton();
    injectMobileMenuButton();
  }

  async function waitForEthereum(timeout = 2500) {
    if (window.ethereum && typeof window.ethereum.request === "function") return window.ethereum;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(window.ethereum && typeof window.ethereum.request === "function" ? window.ethereum : null);
      }, timeout);

      window.addEventListener("ethereum#initialized", () => {
        clearTimeout(timer);
        resolve(window.ethereum && typeof window.ethereum.request === "function" ? window.ethereum : null);
      }, { once: true });
    });
  }

  function openInMetaMaskMobile() {
    const current = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = "https://metamask.app.link/dapp/" + current;
  }

  async function switchToEthereumMainnet(provider) {
    const current = await provider.request({ method: "eth_chainId" });
    if (String(current).toLowerCase() === ETH_MAINNET_CHAIN_ID) return;

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ETH_MAINNET_CHAIN_ID }]
    });
  }

  async function addYashEthToken() {
    try {
      setBusy(true, "Opening…");

      const provider = await waitForEthereum();

      if (!provider) {
        setBusy(false);
        resetTextSoon();
        if (isMobileLike()) {
          openInMetaMaskMobile();
        } else {
          alert("No wallet detected. Open this page with MetaMask or a compatible wallet browser.");
        }
        return;
      }

      // No eth_requestAccounts here. The import button does not need to connect/read the wallet address.
      await switchToEthereumMainnet(provider);
      setBusy(true, "Confirm…");

      const added = await provider.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: YASH_ETH_TOKEN }
      });

      setBusy(false, added ? "Added ✓" : "Not added");
      resetTextSoon();
    } catch (err) {
      console.error("[YASHIX] Add ETH YASH token failed:", err);
      setBusy(false);
      resetTextSoon();

      if (err && err.code === 4001) {
        alert("Request rejected in wallet.");
      } else {
        alert((err && err.message) || "Could not add ETH YASH token to wallet.");
      }
    }
  }

  function boot() {
    injectAllButtons();

    // The header is injected by migration.js/site-layout.js, so we retry and observe changes.
    [150, 400, 900, 1600, 3000].forEach((ms) => setTimeout(injectAllButtons, ms));

    const observer = new MutationObserver(() => injectAllButtons());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    console.info(`[YASHIX] ETH token add button loaded ${VERSION}`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addYashEthToken = addYashEthToken;
})();
