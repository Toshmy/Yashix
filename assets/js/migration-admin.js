TOSH_SITE.mountHeader();
TOSH_SITE.mountFooter();

TOSH_LOCK_FAMILY.mountWalletBridge({
  chainId: 97741,
  statusSelector: '#walletStatePill',
  summarySelector: '#summaryWallet'
});

    const YASH_TOKEN = "0xB7fBB045A14a5D7D6E55dBbf7005Ec138EaDDde9";
	const MIGRATION_VAULT = "0x6dD963AEAF7177f537C7488E78Dbbc8fC5A9F0e0";

    const RPC = "https://rpc-pepu-v2-mainnet-0.t.conduit.xyz";
    const CHAIN = 97741;
    const EXPLORER_BASE = "https://pepuscan.com";

    const ERC20 = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function balanceOf(address owner) view returns (uint256)"
    ];

    const VAULT_ABI = [
      "function owner() view returns (address)",
      "function paused() view returns (bool)",
      "function yashToken() view returns (address)",
      "function migrationStart() view returns (uint256)",
      "function migrationEnd() view returns (uint256)",
      "function totalMigrated() view returns (uint256)",
      "function totalUsers() view returns (uint256)",
      "function isMigrationOpen() view returns (bool)",
      "function timeLeft() view returns (uint256)",
      "function pause()",
      "function unpause()",
      "function withdrawMigratedYashAfterEnd(address to)",
      "function getUserCount() view returns (uint256)",
      "function getMigrationRows(uint256 offset,uint256 limit) view returns (address[] pepuUsers,address[] ethReceivers,uint256[] amounts,uint256[] firstDepositTimes,uint256[] lastDepositTimes)"
    ];

    const $ = id => document.getElementById(id);
    const roProvider = new ethers.providers.JsonRpcProvider(RPC);
    roProvider.pollingInterval = 6000;

    let yashDec = 18;
    let yashSym = "YASH";
    let userAddress = "";
    let vaultOwner = "";
    let allRows = [];
    let isProcessing = false;

    const isVaultConfigured = /^0x[a-fA-F0-9]{40}$/.test(MIGRATION_VAULT);
    const yashRO = new ethers.Contract(YASH_TOKEN, ERC20, roProvider);
    const vaultRO = isVaultConfigured ? new ethers.Contract(MIGRATION_VAULT, VAULT_ABI, roProvider) : null;

    function shortAddr(a){ return a ? `${a.slice(0,6)}…${a.slice(-4)}` : "—"; }
    function logAdmin(...a){ $("adminLog").textContent += a.join(" ") + "\n"; }
    function logRecords(...a){ $("recordsLog").textContent += a.join(" ") + "\n"; }

    function setStatus(msg, type = "warn"){
      const el = $("statusHelper");
      if (!el) return;
      el.textContent = msg || "";
      el.classList.remove("err", "ok", "warn");
      el.classList.add(type);
    }

    function fmtUnits(bn, dec = yashDec){ return ethers.utils.formatUnits(bn || "0", dec); }

    function fmtNumberString(s, dp = 4){
      const n = Number(s || 0);
      if (!isFinite(n)) return "0";
      return n.toLocaleString(undefined, { maximumFractionDigits: dp });
    }

    function fmtDate(ts){
      const n = Number(ts || 0);
      if (!n) return "—";
      return new Date(n * 1000).toLocaleString();
    }

    function fmtDuration(sec){
      sec = Math.max(0, Number(sec || 0));
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      if (d > 0) return `${d}d ${h}h`;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    }

    function csvEscape(v){
      const s = String(v ?? "");
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
      return s;
    }

    function downloadText(filename, text){
      const blob = new Blob([text], { type:"text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    async function loadTokenMeta(){
      try {
        const [name, symbol, decimals] = await Promise.all([
          yashRO.name().catch(() => "Yashix"),
          yashRO.symbol().catch(() => "YASH"),
          yashRO.decimals().catch(() => 18)
        ]);
        yashSym = symbol;
        yashDec = Number(decimals);
        $("tokenMeta").textContent = `${name} (${symbol})`;
        $("tokenAddressShort").textContent = shortAddr(YASH_TOKEN);
      } catch {
        $("tokenMeta").textContent = "YASH";
        $("tokenAddressShort").textContent = shortAddr(YASH_TOKEN);
      }
    }

    async function loadVaultStats(){
      $("vaultShort").textContent = isVaultConfigured ? shortAddr(MIGRATION_VAULT) : "Not configured";

      if (!isVaultConfigured) {
        $("migrationState").textContent = "Vault needed";
        $("migrationTimeLeft").textContent = "Deploy vault and paste address in MIGRATION_VAULT.";
        $("pausedState").textContent = "—";
        $("ownerWallet").textContent = "—";
        $("ownerCheck").textContent = "—";
        setStatus("Migration vault address is not configured in this admin page yet.", "err");
        return;
      }

      try {
        const [owner, paused, total, users, open, left, start, end] = await Promise.all([
          vaultRO.owner(),
          vaultRO.paused(),
          vaultRO.totalMigrated(),
          vaultRO.totalUsers(),
          vaultRO.isMigrationOpen().catch(() => false),
          vaultRO.timeLeft().catch(() => 0),
          vaultRO.migrationStart(),
          vaultRO.migrationEnd()
        ]);

        vaultOwner = owner;
        $("ownerWallet").textContent = owner;
        $("ownerCheck").textContent = userAddress && owner.toLowerCase() === userAddress.toLowerCase() ? "Connected owner" : "Not owner / not connected";
        $("totalMigrated").textContent = `${fmtNumberString(fmtUnits(total), 2)} ${yashSym}`;
        $("totalUsers").textContent = users.toString();
        $("pausedState").textContent = paused ? "Yes" : "No";
        $("startTime").textContent = fmtDate(start);
        $("endTime").textContent = fmtDate(end);

        const now = Math.floor(Date.now() / 1000);
        if (paused) {
          $("migrationState").textContent = "Paused";
          $("migrationTimeLeft").textContent = "Emergency pause active";
          setStatus("Vault is paused.", "warn");
        } else if (open) {
          $("migrationState").textContent = "Open";
          $("migrationTimeLeft").textContent = `${fmtDuration(left)} remaining`;
          setStatus("Migration is open.", "ok");
        } else if (now < Number(start)) {
          $("migrationState").textContent = "Not started";
          $("migrationTimeLeft").textContent = `Starts ${fmtDate(start)}`;
          setStatus("Migration has not started yet.", "warn");
        } else if (now > Number(end)) {
          $("migrationState").textContent = "Closed";
          $("migrationTimeLeft").textContent = `Ended ${fmtDate(end)}`;
          setStatus("Migration window is closed. Withdrawal is available to owner.", "warn");
        } else {
          $("migrationState").textContent = "Unavailable";
          $("migrationTimeLeft").textContent = "Check state";
          setStatus("Migration is currently unavailable.", "warn");
        }
      } catch (e) {
        setStatus(e?.message || "Could not read migration vault", "err");
        logAdmin("❌", e?.message || String(e));
      }
    }

    function updateWalletUiFromShared(state){
      const connected = !!(state && state.connected && state.address);
      userAddress = connected ? state.address : "";
      $("summaryWallet").textContent = connected ? shortAddr(state.address) : "Not connected";

      if (connected) {
        if (Number(state.chainId) === CHAIN) {
          $("walletStatePill").textContent = `Wallet connected · ${shortAddr(state.address)}`;
        } else {
          $("walletStatePill").textContent = `Wrong chain · ${shortAddr(state.address)}`;
          setStatus(`Connected on chain ${state.chainId}. Switch to PEPU L2 (97741).`, "err");
        }
      } else {
        $("walletStatePill").textContent = "Wallet not connected";
      }

      loadVaultStats();
    }

    async function requireOwnerVault(){
      if (!isVaultConfigured) throw new Error("Migration vault is not configured.");
      if (!window.TOSH_WALLET || !TOSH_WALLET.isConnected()) {
        TOSH_WALLET?.openPanel?.();
        throw new Error("Connect owner wallet from the top bar first.");
      }

      await TOSH_WALLET.ensureChain?.();
      const signer = TOSH_WALLET.getSigner();
      if (!signer) throw new Error("Wallet signer unavailable.");

      const addr = await signer.getAddress();
      if (vaultOwner && addr.toLowerCase() !== vaultOwner.toLowerCase()) {
        throw new Error("Connected wallet is not the vault owner.");
      }

      return new ethers.Contract(MIGRATION_VAULT, VAULT_ABI, signer);
    }

    async function runOwnerAction(label, fn){
      if (isProcessing) return;
      isProcessing = true;
      setStatus(`${label}…`, "warn");
      try {
        const vault = await requireOwnerVault();
        const tx = await fn(vault);
        logAdmin(`${label}: ${tx.hash}`);
        await tx.wait();
        logAdmin(`✅ ${label} confirmed`);
        setStatus(`${label} confirmed.`, "ok");
        await loadVaultStats();
      } catch (e) {
        const msg = e?.data?.message || e?.message || String(e);
        logAdmin("❌", msg);
        setStatus(msg, "err");
      } finally {
        isProcessing = false;
      }
    }

    async function pauseVault(){
      await runOwnerAction("Pause", vault => vault.pause());
    }

    async function unpauseVault(){
      await runOwnerAction("Unpause", vault => vault.unpause());
    }

    async function withdrawMigratedYash(){
      const toRaw = $("withdrawTo").value.trim();
      if (!/^0x[a-fA-F0-9]{40}$/.test(toRaw)) {
        setStatus("Enter a valid recipient wallet for withdrawn PEPU YASH.", "err");
        return;
      }
      const to = ethers.utils.getAddress(toRaw);
      await runOwnerAction("Withdraw migrated YASH", vault => vault.withdrawMigratedYashAfterEnd(to));
    }

    function renderRows(){
      const q = ($("recordSearch").value || "").trim().toLowerCase();
      const tbody = $("recordRows");
      let rows = allRows.slice();

      if (q) {
        rows = rows.filter(r =>
          r.pepuUser.toLowerCase().includes(q) ||
          r.ethReceiver.toLowerCase().includes(q)
        );
      }

      $("recordCount").textContent = `${rows.length} shown · ${allRows.length} total`;

      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="7">No migration records found.</td></tr>`;
        return;
      }

      tbody.innerHTML = rows.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="mono"><a class="inline-link" href="${EXPLORER_BASE}/address/${r.pepuUser}" target="_blank" rel="noopener">${shortAddr(r.pepuUser)}</a></td>
          <td class="mono">${r.ethReceiver}</td>
          <td class="right">${fmtNumberString(r.amountHuman, 4)} ${yashSym}</td>
          <td class="mono">${r.amountRaw}</td>
          <td>${fmtDate(r.firstDepositTime)}</td>
          <td>${fmtDate(r.lastDepositTime)}</td>
        </tr>
      `).join("");
    }

    async function loadRecords(){
      $("recordsLog").textContent = "";

      if (!isVaultConfigured) {
        logRecords("❌ Migration vault is not configured yet.");
        $("recordRows").innerHTML = `<tr><td colspan="7">Vault not configured.</td></tr>`;
        return;
      }

      try {
        const count = Number((await vaultRO.getUserCount()).toString());
        const batch = 200;
        allRows = [];

        for (let offset = 0; offset < count; offset += batch) {
          const limit = Math.min(batch, count - offset);
          const result = await vaultRO.getMigrationRows(offset, limit);
          const pepuUsers = result.pepuUsers || result[0];
          const ethReceivers = result.ethReceivers || result[1];
          const amounts = result.amounts || result[2];
          const firstDepositTimes = result.firstDepositTimes || result[3];
          const lastDepositTimes = result.lastDepositTimes || result[4];

          for (let i = 0; i < pepuUsers.length; i++) {
            allRows.push({
              pepuUser: pepuUsers[i],
              ethReceiver: ethReceivers[i],
              amountRaw: amounts[i].toString(),
              amountHuman: fmtUnits(amounts[i]),
              firstDepositTime: Number(firstDepositTimes[i]),
              lastDepositTime: Number(lastDepositTimes[i])
            });
          }
        }

        renderRows();
        $("exportCsv").disabled = allRows.length === 0;
        logRecords(`Loaded ${allRows.length} migration records.`);
      } catch (e) {
        const msg = e?.data?.message || e?.message || String(e);
        logRecords("❌", msg);
        $("recordRows").innerHTML = `<tr><td colspan="7">Could not load records.</td></tr>`;
      }
    }

    function exportCsv(){
      if (!allRows.length) return;

      const header = "pepu_wallet,eth_receiver,yash_amount_raw,yash_amount_human,first_deposit_time,last_deposit_time";
      const lines = allRows.map(r => [
        r.pepuUser,
        r.ethReceiver,
        r.amountRaw,
        r.amountHuman,
        r.firstDepositTime,
        r.lastDepositTime
      ].map(csvEscape).join(","));

      downloadText(`yashix_migration_admin_export_${Date.now()}.csv`, [header, ...lines].join("\n"));
    }

    document.addEventListener('DOMContentLoaded', async () => {
      await loadTokenMeta();
      await loadVaultStats();

      $("openWalletPanelBtn").addEventListener('click', () => window.TOSH_WALLET?.openPanel?.());
      $("refreshAll").addEventListener('click', async () => { await loadVaultStats(); await loadRecords(); });
      $("pauseBtn").addEventListener('click', pauseVault);
      $("unpauseBtn").addEventListener('click', unpauseVault);
      $("withdrawYashBtn").addEventListener('click', withdrawMigratedYash);
      $("loadRecords").addEventListener('click', loadRecords);
      $("exportCsv").addEventListener('click', exportCsv);
      $("recordSearch").addEventListener('input', renderRows);

      if (window.TOSH_WALLET) {
        updateWalletUiFromShared(TOSH_WALLET.getState());
        TOSH_WALLET.onChange(updateWalletUiFromShared);
      }
    });