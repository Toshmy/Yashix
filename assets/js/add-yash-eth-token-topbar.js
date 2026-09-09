// YASHIX - Add ETH YASH token to MetaMask from the top bar
// Version: v2_20260909_1930
// This button is independent from the PEPU migration flow.
// It only asks the wallet to import the Ethereum Mainnet YASH token.

(function () {
  "use strict";

  const ETH_MAINNET_CHAIN_ID = "0x1";

  const YASH_ETH_TOKEN = {
    address: "0xac49952f9deD5f8e7106642A6C991a6418a97536",
    symbol: "YASH",
    decimals: 18,
    image: "https://migrate.yashix.com/assets/img/yashix-logo-256.png"
  };

  const METAMASK_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNSAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjcwNzcgMzIuNzUyMkwyNS4xNjg4IDMwLjUxNzRMMTkuNDgzMyAzMy45MDA4TDE1LjUxNjcgMzMuODk5MUw5LjgyNzkzIDMwLjUxNzRMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDQ4OUwyLjI5MjI1IDE2LjQ5OTNMMCA5LjI3MDk0TDIuMjkyMjUgMC4zMTIyNTZMMTQuMDY3NCA3LjMxNTU0SDIwLjkzMjZMMzIuNzA3NyAwLjMxMjI1NkwzNSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0wzNSAyNS4wNDg5TDMyLjcwNzcgMzIuNzUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTIuMjkzOTUgMC4zMTIyNTZMMTQuMDY5MSA3LjMyMDQ3TDEzLjYwMDggMTIuMTMwMUwyLjI5Mzk1IDAuMzEyMjU2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNOS44Mjk1OSAyNS4wNTIyTDE1LjAxMDYgMjguOTgxMUw5LjgyOTU5IDMwLjUxNzVWMjUuMDUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTE0LjU5NjYgMTguNTU2NUwxMy42MDA5IDEyLjEzMzNMNy4yMjY5MiAxNi41MDA5TDcuMjIzNjMgMTYuNDk5M1YxNi41MDI1TDcuMjQzMzUgMjAuOTk4M0w5LjgyODA5IDE4LjU1NjVIOS44Mjk3NEgxNC41OTY2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMzIuNzA3NyAwLjMxMjI1NkwyMC45MzI2IDcuMzIwNDdMMjEuMzk5MyAxMi4xMzAxTDMyLjcwNzcgMC4zMTIyNTZaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIyIDI1LjA1MjJMMTkuOTkxMiAyOC45ODExTDI1LjE3MjIgMzAuNTE3NVYyNS4wNTIyWiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMjcuNzc2NiAxNi41MDI1SDI3Ljc3ODNIMjcuNzc2NlYxNi40OTkzTDI3Ljc3NSAxNi41MDA5TDIxLjQwMSAxMi4xMzMzTDIwLjQwNTMgMTguNTU2NUgyNS4xNzIyTDI3Ljc1ODYgMjAuOTk4M0wyNy43NzY2IDE2LjUwMjVaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik05LjgyNzkzIDMwLjUxNzVMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDUyMkg5LjgyNzkzVjMwLjUxNzVaIiBmaWxsPSIjRTM0ODA3Ii8+CjxwYXRoIGQ9Ik0xNC41OTQ3IDE4LjU1NDlMMTYuMDM0MSAyNy44NDA2TDE0LjAzOTMgMjIuNjc3N0w3LjIzOTc1IDIwLjk5ODRMOS44MjYxMyAxOC41NTQ5SDE0LjU5M0gxNC41OTQ3WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjUuMTcyMSAzMC41MTc1TDMyLjcwNzggMzIuNzUyMkwzNS4wMDAxIDI1LjA1MjJIMjUuMTcyMVYzMC41MTc1WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjAuNDA1MyAxOC41NTQ5TDE4Ljk2NTggMjcuODQwNkwyMC45NjA3IDIyLjY3NzdMMjcuNzYwMiAyMC45OTg0TDI1LjE3MjIgMTguNTU0OUgyMC40MDUzWiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMCAyNS4wNDg4TDIuMjkyMjUgMTYuNDk5M0g3LjIyMTgzTDcuMjM5OTEgMjAuOTk2N0wxNC4wMzk0IDIyLjY3NkwxNi4wMzQzIDI3LjgzODlMMTUuMDA4OSAyOC45NzZMOS44Mjc5MyAyNS4wNDcySDBWMjUuMDQ4OFoiIGZpbGw9IiNGRjhENUQiLz4KPHBhdGggZD0iTTM1LjAwMDEgMjUuMDQ4OEwzMi43MDc4IDE2LjQ5OTNIMjcuNzc4M0wyNy43NjAyIDIwLjk5NjdMMjAuOTYwNyAyMi42NzZMMTguOTY1OCAyNy44Mzg5TDE5Ljk5MTIgMjguOTc2TDI1LjE3MjIgMjUuMDQ3MkgzNS4wMDAxVjI1LjA0ODhaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yMC45MzI1IDcuMzE1NDNIMTcuNDk5OUgxNC4wNjczTDEzLjYwMDYgMTIuMTI1MUwxNi4wMzQyIDI3LjgzNEgxOC45NjU2TDIxLjQwMDggMTIuMTI1MUwyMC45MzI1IDcuMzE1NDNaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yLjI5MjI1IDAuMzEyMjU2TDAgOS4yNzA5NEwyLjI5MjI1IDE2LjQ5OTNINy4yMjE4M0wxMy41OTkxIDEyLjEzMDFMMi4yOTIyNSAwLjMxMjI1NloiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTEzLjE3IDIwLjQxOTlIMTAuOTM2OUw5LjcyMDk1IDIxLjYwNjJMMTQuMDQwOSAyMi42NzI3TDEzLjE3IDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTMyLjcwNzcgMC4zMTIyNTZMMzQuOTk5OSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0gyNy43NzgxTDIxLjQwMDkgMTIuMTMwMUwzMi43MDc3IDAuMzEyMjU2WiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMjEuODMzIDIwLjQxOTlIMjQuMDY5NEwyNS4yODUzIDIxLjYwNzlMMjAuOTYwNCAyMi42NzZMMjEuODMzIDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTE5LjQ4MTcgMzAuODM2MkwxOS45OTExIDI4Ljk3OTRMMTguOTY1OCAyNy44NDIzSDE2LjAzMjdMMTUuMDA3MyAyOC45Nzk0TDE1LjUxNjcgMzAuODM2MiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMTkuNDgxNiAzMC44MzU5VjMzLjkwMjFIMTUuNTE2NlYzMC44MzU5SDE5LjQ4MTZaIiBmaWxsPSIjQzBDNENEIi8+CjxwYXRoIGQ9Ik05LjgyOTU5IDMwLjUxNDJMMTUuNTIgMzMuOTAwOFYzMC44MzQ2TDE1LjAxMDYgMjguOTc3OEw5LjgyOTU5IDMwLjUxNDJaIiBmaWxsPSIjRTdFQkY2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIxIDMwLjUxNDJMMTkuNDgxNyAzMy45MDA4VjMwLjgzNDZMMTkuOTkxMSAyOC45Nzc4TDI1LjE3MjEgMzAuNTE0MloiIGZpbGw9IiNFN0VCRjYiLz4KPC9zdmc+Cg==";

  const DESKTOP_ID = "add-yash-eth-token-topbar";
  const MOBILE_ID = "add-yash-eth-token-mobile";
  const MOBILE_MENU_ID = "add-yash-eth-token-mobile-menu";

  function injectStyles() {
    if (document.getElementById("add-yash-eth-token-style")) return;

    const style = document.createElement("style");
    style.id = "add-yash-eth-token-style";
    style.textContent = `
      .yash-add-token-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: .52rem;
        min-height: 44px;
        padding: .45rem .72rem;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,.10);
        background:
          radial-gradient(circle at 0 0, rgba(255,92,22,.20), transparent 38%),
          radial-gradient(circle at 100% 0, rgba(0,255,174,.15), transparent 42%),
          linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.035));
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

      .yash-add-token-btn:disabled {
        opacity: .72;
        cursor: not-allowed;
        transform: none;
      }

      .yash-add-token-icon {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        overflow: hidden;
        background: #07111e;
        border: 1px solid rgba(255,255,255,.10);
        box-shadow: 0 0 0 4px rgba(255,92,22,.045);
        flex: 0 0 auto;
      }

      .yash-add-token-icon img {
        width: 22px;
        height: 22px;
        display: block;
      }

      .yash-add-token-copy {
        display: grid;
        line-height: 1.08;
        text-align: left;
      }

      .yash-add-token-label {
        font-size: .82rem;
        color: #fff7ed;
      }

      .yash-add-token-sub {
        margin-top: .1rem;
        font-size: .62rem;
        color: #ffc69f;
        font-weight: 800;
      }

      .yash-add-token-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #ff7a1a;
        box-shadow: 0 0 0 3px rgba(255,122,26,.14), 0 0 18px rgba(255,122,26,.32);
        flex: 0 0 auto;
      }

      .yash-add-token-btn.is-mobile-icon {
        width: 42px;
        min-width: 42px;
        height: 40px;
        min-height: 40px;
        padding: .35rem;
      }

      .yash-add-token-btn.is-mobile-icon .yash-add-token-icon {
        width: 26px;
        height: 26px;
      }

      .yash-add-token-btn.is-mobile-icon .yash-add-token-icon img {
        width: 20px;
        height: 20px;
      }

      .yash-add-token-btn.is-mobile-icon .yash-add-token-copy,
      .yash-add-token-btn.is-mobile-icon .yash-add-token-dot {
        display: none;
      }

      .mobile-panel .yash-add-token-btn {
        width: 100%;
        margin-bottom: .6rem;
      }

      @media (max-width: 1180px) {
        .nav-cta .yash-add-token-label { font-size: .76rem; }
        .nav-cta .yash-add-token-sub { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function makeButton(id, iconOnly) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.className = "yash-add-token-btn" + (iconOnly ? " is-mobile-icon" : "");
    btn.setAttribute("aria-label", "Add ETH YASH token to wallet");
    btn.title = "Add ETH YASH token to MetaMask";
    btn.innerHTML = `
      <span class="yash-add-token-icon" aria-hidden="true"><img src="${METAMASK_ICON_URI}" alt=""></span>
      <span class="yash-add-token-copy">
        <span class="yash-add-token-label">YASH ETH TOKEN</span>
        <span class="yash-add-token-sub">Add to wallet</span>
      </span>
      <span class="yash-add-token-dot" aria-hidden="true"></span>
    `;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      addYashEthToken();
    });
    return btn;
  }

  function injectButton() {
    injectStyles();

    const navCta = document.querySelector(".nav-cta");
    const walletChip = document.getElementById("wallet-chip");

    if (navCta && !document.getElementById(DESKTOP_ID)) {
      const btn = makeButton(DESKTOP_ID, false);
      if (walletChip && walletChip.parentElement === navCta) {
        walletChip.insertAdjacentElement("afterend", btn);
      } else {
        navCta.prepend(btn);
      }
    }

    const mobileActions = document.querySelector(".mobile-header-actions");
    const mobileToggle = document.getElementById("mobile-menu-toggle");

    if (mobileActions && !document.getElementById(MOBILE_ID)) {
      const btn = makeButton(MOBILE_ID, true);
      if (mobileToggle && mobileToggle.parentElement === mobileActions) {
        mobileActions.insertBefore(btn, mobileToggle);
      } else {
        mobileActions.appendChild(btn);
      }
    }

    const mobilePanel = document.querySelector("#mobile-menu .mobile-panel");

    if (mobilePanel && !document.getElementById(MOBILE_MENU_ID)) {
      const btn = makeButton(MOBILE_MENU_ID, false);
      mobilePanel.insertBefore(btn, mobilePanel.firstChild);
    }
  }

  function setAllButtonsBusy(isBusy, label) {
    [DESKTOP_ID, MOBILE_ID, MOBILE_MENU_ID].forEach(function (id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.disabled = isBusy;
      const labelEl = btn.querySelector(".yash-add-token-label");
      if (labelEl && label) labelEl.textContent = label;
    });
  }

  function resetButtonLabels() {
    [DESKTOP_ID, MOBILE_ID, MOBILE_MENU_ID].forEach(function (id) {
      const btn = document.getElementById(id);
      const labelEl = btn?.querySelector(".yash-add-token-label");
      if (labelEl) labelEl.textContent = "YASH ETH TOKEN";
    });
  }

  async function switchToEthereumMainnet(provider) {
    const chainId = await provider.request({ method: "eth_chainId" });
    if (String(chainId).toLowerCase() === ETH_MAINNET_CHAIN_ID) return;

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ETH_MAINNET_CHAIN_ID }]
    });
  }

  async function addYashEthToken() {
    if (!window.ethereum || typeof window.ethereum.request !== "function") {
      alert("No wallet detected. Open this page with MetaMask or a compatible wallet browser.");
      return;
    }

    try {
      setAllButtonsBusy(true, "Opening…");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      await switchToEthereumMainnet(window.ethereum);

      setAllButtonsBusy(true, "Confirm…");

      const added = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: YASH_ETH_TOKEN
        }
      });

      if (added) {
        setAllButtonsBusy(false, "Added ✓");
        setTimeout(resetButtonLabels, 1800);
      } else {
        setAllButtonsBusy(false, "Not added");
        setTimeout(resetButtonLabels, 1800);
      }
    } catch (err) {
      console.error("[YASHIX] add ETH YASH token failed:", err);

      if (err && err.code === 4001) {
        alert("Token import rejected in wallet.");
      } else {
        alert(err?.message || "Could not add ETH YASH token to wallet.");
      }

      setAllButtonsBusy(false);
      resetButtonLabels();
    }
  }

  function boot() {
    injectButton();

    // Header is injected by site-layout / migration.js. Re-check shortly in case script order changes.
    setTimeout(injectButton, 250);
    setTimeout(injectButton, 1000);

    const obs = new MutationObserver(function () {
      injectButton();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addYashEthToken = addYashEthToken;
})();
