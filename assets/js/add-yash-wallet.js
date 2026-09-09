// YASHIX - Add ETH YASH token to MetaMask / compatible wallets
// Separate from migration.js on purpose:
// - migration.js stays focused on PEPU migration
// - this file only imports the Ethereum YASH ERC-20 token in the user's wallet

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

  function setWalletImportStatus(message, type = "info") {
    const el = $("addYashToWalletStatus");
    if (!el) return;

    el.textContent = message;

    const colors = {
      ok: "var(--tlf-ok, #3ff2a3)",
      warn: "var(--tlf-warn, #ffd166)",
      err: "var(--tlf-error, #ff6b6b)",
      info: "var(--tlf-muted, #9ca3af)"
    };

    el.style.color = colors[type] || colors.info;
  }

  async function switchToEthereumMainnet(provider) {
    const currentChainId = await provider.request({ method: "eth_chainId" });

    if (String(currentChainId).toLowerCase() === ETH_MAINNET_CHAIN_ID) {
      return;
    }

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ETH_MAINNET_CHAIN_ID }]
    });
  }

  async function addYashToWallet() {
    const btn = $("addYashToWalletBtn");

    if (!window.ethereum || typeof window.ethereum.request !== "function") {
      setWalletImportStatus("No injected wallet detected. Open this page with MetaMask or a compatible wallet browser.", "err");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Opening wallet…";
    }

    try {
      setWalletImportStatus("Requesting wallet connection…", "warn");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      setWalletImportStatus("Switching to Ethereum Mainnet…", "warn");
      await switchToEthereumMainnet(window.ethereum);

      setWalletImportStatus("Requesting ETH YASH token import…", "warn");
      const added = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: YASH_ETH_TOKEN
        }
      });

      if (added) {
        setWalletImportStatus("ETH YASH token added. Switch back to PEPU if you still need to migrate.", "ok");
      } else {
        setWalletImportStatus("Token import was not completed in the wallet.", "warn");
      }
    } catch (err) {
      const code = err && err.code;
      const message = err && (err.message || (err.data && err.data.message));

      if (code === 4001) {
        setWalletImportStatus("Request rejected in wallet.", "warn");
      } else {
        setWalletImportStatus(message || "Could not add ETH YASH to wallet.", "err");
      }

      console.error("[YASHIX] add token failed:", err);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Add ETH YASH to MetaMask";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = $("addYashToWalletBtn");
    if (btn) btn.addEventListener("click", addYashToWallet);
    window.addYashToWallet = addYashToWallet;
  });
})();
