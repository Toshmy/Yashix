// YASHIX - Add ETH YASH token to MetaMask / compatible wallets
// Version: v3_20260909_mobile_patch
// Purpose:
// - Add a top-bar button: 🦊 YASH ETH TOKEN
// - Import ETH YASH token into MetaMask
// - Does NOT request wallet account connection first
// - On mobile Chrome/Safari, opens the page inside MetaMask Mobile browser

(function () {
  "use strict";

  const ETH_MAINNET_CHAIN_ID = "0x1";

  const YASH_ETH_TOKEN = {
    address: "0xac49952f9deD5f8e7106642A6C991a6418a97536",
    symbol: "YASH",
    decimals: 18,
    image: "https://migrate.yashix.com/assets/img/yashix-logo-256.png"
  };

  function $(id) {
    return document.getElementById(id);
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent || "");
  }

  function setAddTokenStatus(message, type = "info") {
    let el = $("addYashEthTokenStatus");

    if (!el) {
      el = document.createElement("span");
      el.id = "addYashEthTokenStatus";
      el.className = "yash-add-token-status";

      const btn = $("addYashEthTokenTopbarBtn");
      if (btn && btn.parentNode) {
        btn.parentNode.appendChild(el);
      }
    }

    if (!el) return;

    el.textContent = message || "";
    el.dataset.type = type;
  }

  async function waitForEthereum(timeout = 2500) {
    if (window.ethereum && typeof window.ethereum.request === "function") {
      return window.ethereum;
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(window.ethereum && typeof window.ethereum.request === "function" ? window.ethereum : null);
      }, timeout);

      window.addEventListener(
        "ethereum#initialized",
        () => {
          clearTimeout(timer);
          resolve(window.ethereum && typeof window.ethereum.request === "function" ? window.ethereum : null);
        },
        { once: true }
      );
    });
  }

  function openCurrentPageInMetaMaskMobile() {
    const cleanUrl = window.location.href.replace(/^https?:\/\//i, "");
    window.location.href = "https://metamask.app.link/dapp/" + cleanUrl;
  }

  async function switchToEthereumMainnet(provider) {
    const currentChainId = await provider.request({ method: "eth_chainId" }).catch(() => null);

    if (String(currentChainId || "").toLowerCase() === ETH_MAINNET_CHAIN_ID) {
      return;
    }

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ETH_MAINNET_CHAIN_ID }]
    });
  }

  async function addYashEthTokenToWallet() {
    const btn = $("addYashEthTokenTopbarBtn");

    if (btn) {
      btn.disabled = true;
      btn.dataset.loading = "true";
    }

    try {
      const provider = await waitForEthereum();

      if (!provider) {
        if (isMobileDevice()) {
          setAddTokenStatus("Opening MetaMask…", "warn");
          openCurrentPageInMetaMaskMobile();
          return;
        }

        setAddTokenStatus("No wallet detected.", "error");
        alert("No wallet detected. Please use MetaMask or a compatible wallet.");
        return;
      }

      setAddTokenStatus("Switching to Ethereum…", "warn");
      await switchToEthereumMainnet(provider);

      setAddTokenStatus("Opening token import…", "warn");
      const added = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: YASH_ETH_TOKEN
        }
      });

      if (added) {
        setAddTokenStatus("YASH ETH token added.", "ok");
      } else {
        setAddTokenStatus("Token import cancelled.", "warn");
      }
    } catch (err) {
      console.error("[YASHIX] Add ETH YASH token failed:", err);

      if (err && err.code === 4001) {
        setAddTokenStatus("Request rejected.", "warn");
      } else {
        setAddTokenStatus(err?.message || "Could not add token.", "error");
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.dataset.loading = "false";
      }
    }
  }

  function injectStyles() {
    if ($("yashAddTokenTopbarStyles")) return;

    const style = document.createElement("style");
    style.id = "yashAddTokenTopbarStyles";
    style.textContent = `
      .yash-add-token-wrap {
        display: inline-flex;
        align-items: center;
        gap: .45rem;
        margin-left: .55rem;
      }

      .yash-add-token-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: .4rem;
        min-height: 38px;
        padding: .58rem .78rem;
        border-radius: 999px;
        border: 1px solid rgba(54, 255, 177, .28);
        background: rgba(5, 16, 13, .72);
        color: #effff8;
        font-weight: 800;
        font-size: .78rem;
        letter-spacing: .02em;
        line-height: 1;
        cursor: pointer;
        box-shadow: 0 0 18px rgba(24, 255, 169, .08);
        transition: transform .16s ease, border-color .16s ease, background .16s ease;
        white-space: nowrap;
      }

      .yash-add-token-btn:hover {
        transform: translateY(-1px);
        border-color: rgba(54, 255, 177, .55);
        background: rgba(8, 28, 22, .88);
      }

      .yash-add-token-btn:disabled {
        opacity: .65;
        cursor: wait;
        transform: none;
      }

      .yash-add-token-fox {
        width: 1.05rem;
        height: 1.05rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }

      .yash-add-token-status {
        max-width: 160px;
        font-size: .68rem;
        color: rgba(239,255,248,.68);
        line-height: 1.1;
      }

      .yash-add-token-status[data-type="ok"] { color: #3ff2a3; }
      .yash-add-token-status[data-type="warn"] { color: #ffd166; }
      .yash-add-token-status[data-type="error"] { color: #ff6b6b; }

      @media (max-width: 760px) {
        .yash-add-token-wrap {
          margin-left: .35rem;
        }

        .yash-add-token-btn {
          min-height: 34px;
          padding: .48rem .58rem;
          font-size: .68rem;
        }

        .yash-add-token-btn .yash-add-token-label-short {
          display: inline;
        }

        .yash-add-token-btn .yash-add-token-label-long {
          display: none;
        }

        .yash-add-token-status {
          display: none;
        }
      }

      @media (min-width: 761px) {
        .yash-add-token-btn .yash-add-token-label-short {
          display: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createTopbarButton() {
    if ($("addYashEthTokenTopbarBtn")) return;

    injectStyles();

    const wrap = document.createElement("div");
    wrap.className = "yash-add-token-wrap";

    const btn = document.createElement("button");
    btn.id = "addYashEthTokenTopbarBtn";
    btn.className = "yash-add-token-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Add ETH YASH token to wallet");
    btn.title = "Add ETH YASH token to MetaMask";
    btn.innerHTML = `
      <span class="yash-add-token-fox" aria-hidden="true">🦊</span>
      <span class="yash-add-token-label-long">YASH ETH TOKEN</span>
      <span class="yash-add-token-label-short">YASH</span>
    `;
    btn.addEventListener("click", addYashEthTokenToWallet);

    wrap.appendChild(btn);

    // Best target: shared header action area.
    const walletBtn = document.querySelector("[data-tlf-open-wallet]");
    const walletParent = walletBtn ? walletBtn.parentElement : null;

    const target =
      walletParent ||
      document.querySelector(".nav-cta") ||
      document.querySelector(".tlf-nav-cta") ||
      document.querySelector("header nav") ||
      document.querySelector("header") ||
      $("site-header-root");

    if (target) {
      if (walletBtn && walletBtn.parentElement === target) {
        walletBtn.insertAdjacentElement("afterend", wrap);
      } else {
        target.appendChild(wrap);
      }
    }
  }

  function init() {
    createTopbarButton();

    // site-layout.js may render the header after DOMContentLoaded.
    // Retry a few times without duplicating the button.
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      createTopbarButton();
      if ($("addYashEthTokenTopbarBtn") || tries >= 20) {
        clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addYashEthTokenToWallet = addYashEthTokenToWallet;
})();
