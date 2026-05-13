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
      "function balanceOf(address owner) view returns (uint256)",
      "function allowance(address owner,address spender) view returns (uint256)",
      "function approve(address spender,uint256 amount) returns (bool)"
    ];

    const VAULT_ABI = [
      "function yashToken() view returns (address)",
      "function migrationStart() view returns (uint256)",
      "function migrationEnd() view returns (uint256)",
      "function totalMigrated() view returns (uint256)",
      "function totalUsers() view returns (uint256)",
      "function isMigrationOpen() view returns (bool)",
      "function timeLeft() view returns (uint256)",
      "function migrate(uint256 amount,address ethReceiver)",
      "function updateEthReceiver(address newEthReceiver)",
      "function users(address) view returns (uint256 totalDeposited,address ethReceiver,uint256 firstDepositTime,uint256 lastDepositTime,bool exists)",
      "function getUserCount() view returns (uint256)",
      "function getMigrationRows(uint256 offset,uint256 limit) view returns (address[] pepuUsers,address[] ethReceivers,uint256[] amounts,uint256[] firstDepositTimes,uint256[] lastDepositTimes)"
    ];

    const $ = id => document.getElementById(id);
    const roProvider = new ethers.providers.JsonRpcProvider(RPC);
    roProvider.pollingInterval = 6000;

    let yashDec = 18;
    let yashSym = "YASH";
    let yashName = "YASH";
    let userAddress = "";
    let walletBalanceRaw = ethers.BigNumber.from(0);
    let allRows = [];
    let isProcessing = false;
    let lastAutoEthReceiver = "";

    const isVaultConfigured = /^0x[a-fA-F0-9]{40}$/.test(MIGRATION_VAULT);
    const yashRO = new ethers.Contract(YASH_TOKEN, ERC20, roProvider);
    const vaultRO = isVaultConfigured ? new ethers.Contract(MIGRATION_VAULT, VAULT_ABI, roProvider) : null;

    function shortAddr(a){ return a ? `${a.slice(0,6)}…${a.slice(-4)}` : "—"; }
    function logTx(...a){ $("txlog").textContent += a.join(" ") + "\n"; }
    function logRecords(...a){ $("recordsLog").textContent += a.join(" ") + "\n"; }

    function setDefaultEthReceiver(address, force = false) {
      const input = $("ethReceiver");
      if (!input || !address) return;

      const checksum = ethers.utils.getAddress(address);
      const current = input.value.trim();

      if (force || !current || current.toLowerCase() === lastAutoEthReceiver.toLowerCase()) {
        input.value = checksum;
        lastAutoEthReceiver = checksum;
      }
    }

    function clearHiddenEthReceiver() {
      const input = $("ethReceiver");
      if (input) input.value = "";
      lastAutoEthReceiver = "";
    }

    function setStatus(msg, type = "warn"){
      const el = $("statusHelper");
      if (!el) return;
      el.textContent = msg || "";
      el.classList.remove("err", "ok", "warn");
      el.classList.add(type);
    }

    function formatHumanAmount(value, decimals = 18, maxDp = 0) {
      let s = String(value || "0");

      if (!s.includes(".")) return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      let [whole, frac] = s.split(".");
      whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      frac = (frac || "").slice(0, maxDp).replace(/0+$/, "");

      return frac ? `${whole}.${frac}` : whole;
    }

    function fmtUnits(bn, dec = yashDec){
      return ethers.utils.formatUnits(bn || "0", dec);
    }

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
        yashName = name;
        yashSym = symbol;
        yashDec = Number(decimals);
        $("tokenMeta").textContent = `${yashName} (${yashSym})`;
        $("tokenAddressShort").textContent = shortAddr(YASH_TOKEN);
      } catch {
        $("tokenMeta").textContent = "YASH";
        $("tokenAddressShort").textContent = shortAddr(YASH_TOKEN);
      }
    }

	async function loadVaultStats(){
	  $("vaultShort").innerHTML = isVaultConfigured
		? `<a class="inline-link mono" href="${EXPLORER_BASE}/address/${MIGRATION_VAULT}" target="_blank" rel="noopener">${shortAddr(MIGRATION_VAULT)}</a>`
		: "Not configured";

	  if (!isVaultConfigured) {
		$("migrationState").textContent = "Vault needed";
		$("migrationTimeLeft").textContent = "Deploy the vault, then paste its address in MIGRATION_VAULT.";
		$("totalMigrated").textContent = "—";
		setStatus("Migration vault address is not configured in this page yet.", "err");
		return;
	  }

	  try {
		const [total, open, left, start, end] = await Promise.all([
		  vaultRO.totalMigrated(),
		  vaultRO.isMigrationOpen().catch(() => false),
		  vaultRO.timeLeft().catch(() => 0),
		  vaultRO.migrationStart(),
		  vaultRO.migrationEnd()
		]);

		$("totalMigrated").textContent = `${formatHumanAmount(fmtUnits(total), 0)} ${yashSym}`;

		const now = Math.floor(Date.now() / 1000);

		if (open) {
		  $("migrationState").textContent = "Open";
		  $("migrationTimeLeft").textContent = `${fmtDuration(left)} remaining`;
		  setStatus("Migration is open. You can approve and migrate YASH.", "ok");
		} else if (now < Number(start)) {
		  $("migrationState").textContent = "Not started";
		  $("migrationTimeLeft").textContent = `Starts ${fmtDate(start)}`;
		  setStatus("Migration has not started yet.", "warn");
		} else if (now > Number(end)) {
		  $("migrationState").textContent = "Closed";
		  $("migrationTimeLeft").textContent = `Ended ${fmtDate(end)}`;
		  setStatus("Migration window is closed.", "err");
		} else {
		  $("migrationState").textContent = "Paused / unavailable";
		  $("migrationTimeLeft").textContent = "Check vault state";
		  setStatus("Migration is currently unavailable.", "warn");
		}
	  } catch (e) {
		$("migrationState").textContent = "Read failed";
		$("migrationTimeLeft").textContent = "Could not read vault";
		setStatus(e?.message || "Could not read migration vault", "err");
	  }
	}

    async function refreshWalletBalance(){
      if (!userAddress) {
        $("walletBalance").textContent = "—";
        return;
      }

      try {
        walletBalanceRaw = await yashRO.balanceOf(userAddress);
        $("walletBalance").textContent = `${formatHumanAmount(fmtUnits(walletBalanceRaw), 0)} ${yashSym}`;
      } catch {
        $("walletBalance").textContent = "Read failed";
      }
    }

    async function refreshUserStatus(){
      if (!userAddress || !isVaultConfigured) {
        $("summaryDeposited").textContent = "—";
        $("summaryFirst").textContent = "—";
        $("summaryLast").textContent = "—";
        return;
      }

      try {
        const U = await vaultRO.users(userAddress);

        if (!U.exists) {
          setDefaultEthReceiver(userAddress, true);
          $("summaryDeposited").textContent = `0 ${yashSym}`;
          $("summaryFirst").textContent = "—";
          $("summaryLast").textContent = "—";
          return;
        }

        // Keep the stored receiver in the background for the contract.
        // Do not display it in the UI.
        setDefaultEthReceiver(U.ethReceiver, true);

        $("summaryDeposited").textContent = `${formatHumanAmount(fmtUnits(U.totalDeposited), 0)} ${yashSym}`;
        $("summaryFirst").textContent = fmtDate(U.firstDepositTime);
        $("summaryLast").textContent = fmtDate(U.lastDepositTime);
      } catch (e) {
        console.warn("user status failed", e);
      }
    }

    function updateWalletUiFromShared(state){
      const connected = !!(state && state.connected && state.address);
      userAddress = connected ? state.address : "";

      $("summaryWallet").textContent = connected ? shortAddr(state.address) : "Not connected";

      if (connected) {
        // Default hidden receiver to connected wallet.
        // If the user already migrated, refreshUserStatus() will replace this
        // with the existing stored receiver from the contract.
        setDefaultEthReceiver(state.address, true);

        if (Number(state.chainId) === CHAIN) {
          $("walletStatePill").textContent = `Wallet connected · ${shortAddr(state.address)}`;
        } else {
          $("walletStatePill").textContent = `Wrong chain · ${shortAddr(state.address)}`;
          setStatus(`Connected on chain ${state.chainId}. Switch to PEPU L2 (${CHAIN}).`, "err");
        }
      } else {
        $("walletStatePill").textContent = "Wallet not connected";
        clearHiddenEthReceiver();
      }

      refreshWalletBalance();
      refreshUserStatus();
    }

    function setMaxAmount(){
      if (!walletBalanceRaw) return;
      $("amount").value = fmtUnits(walletBalanceRaw).replace(/\.0+$/, "");
    }

    async function approveAndMigrate(){
      if (isProcessing) return;
      isProcessing = true;
      const btn = $("approveMigrate");
      btn.disabled = true;
      btn.textContent = "Processing…";
      $("txlog").textContent = "";

      try {
        if (!isVaultConfigured) throw new Error("Migration vault is not configured yet.");
        if (!window.TOSH_WALLET || !TOSH_WALLET.isConnected()) {
          TOSH_WALLET?.openPanel?.();
          throw new Error("Connect wallet from the top bar first.");
        }

        await TOSH_WALLET.ensureChain?.();

        const signer = TOSH_WALLET.getSigner();
        if (!signer) throw new Error("Wallet signer unavailable.");

        const amountRaw = $("amount").value.trim();
        if (!amountRaw || Number(amountRaw) <= 0) throw new Error("Enter a valid YASH amount.");

        const user = await signer.getAddress();

        // Hidden receiver for the contract.
        // New users: connected wallet.
        // Existing users: stored contract receiver from refreshUserStatus().
        const ethReceiverRaw = ($("ethReceiver").value.trim() || user);

        if (!/^0x[a-fA-F0-9]{40}$/.test(ethReceiverRaw)) {
          throw new Error("Migration receiver could not be prepared. Reconnect your wallet and try again.");
        }

        const ethReceiver = ethers.utils.getAddress(ethReceiverRaw);
        const amount = ethers.utils.parseUnits(amountRaw, yashDec);

        const yash = new ethers.Contract(YASH_TOKEN, ERC20, signer);
        const vault = new ethers.Contract(MIGRATION_VAULT, VAULT_ABI, signer);

        const [balance, allowance] = await Promise.all([
          yash.balanceOf(user),
          yash.allowance(user, MIGRATION_VAULT)
        ]);

        if (balance.lt(amount)) {
          throw new Error(`Insufficient balance. You have ${formatHumanAmount(fmtUnits(balance), 0)} ${yashSym}.`);
        }

        if (allowance.lt(amount)) {
          setStatus("Sending YASH approval…", "warn");
          const tx1 = await yash.approve(MIGRATION_VAULT, amount);
          logTx(`Approval: ${tx1.hash}`);
          await tx1.wait();
          logTx("✅ Approval confirmed");
        } else {
          logTx("✅ Existing allowance is enough");
        }

        setStatus("Migrating YASH…", "warn");

        // The connected wallet signs the transaction.
        // ethReceiver is passed silently for the contract.
        const tx2 = await vault.migrate(amount, ethReceiver);

        logTx(`Migration: ${tx2.hash}`);
        await tx2.wait();
        logTx("✅ Migration recorded");

        setStatus("Migration recorded successfully.", "ok");
        await Promise.all([loadVaultStats(), refreshWalletBalance(), refreshUserStatus(), loadRecords()]);
      } catch (e) {
        const msg = e?.data?.message || e?.message || String(e);
        logTx("❌", msg);
        setStatus(msg, "err");
      } finally {
        isProcessing = false;
        btn.disabled = false;
        btn.textContent = "Approve & Migrate";
      }
    }

    function renderRows(){
      const q = ($("recordSearch").value || "").trim().toLowerCase();
      const tbody = $("recordRows");
      let rows = allRows.slice();

      if (q) {
        rows = rows.filter(r =>
          r.pepuUser.toLowerCase().includes(q)
        );
      }

      $("recordCount").textContent = `${rows.length} shown · ${allRows.length} total`;

      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="5">No migration records found.</td></tr>`;
        return;
      }

      tbody.innerHTML = rows.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="mono"><a class="inline-link" href="${EXPLORER_BASE}/address/${r.pepuUser}" target="_blank" rel="noopener">${shortAddr(r.pepuUser)}</a></td>
          <td class="right">${formatHumanAmount(r.amountHuman, 0)} ${yashSym}</td>
          <td>${fmtDate(r.firstDepositTime)}</td>
          <td>${fmtDate(r.lastDepositTime)}</td>
        </tr>
      `).join("");
    }

    async function loadRecords(){
      $("recordsLog").textContent = "";

      if (!isVaultConfigured) {
        logRecords("❌ Migration vault is not configured yet.");
        $("recordRows").innerHTML = `<tr><td colspan="5">Vault not configured.</td></tr>`;
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

          // result[1] contains ethReceivers, but this UI intentionally does not store or display it.
          const amounts = result.amounts || result[2];
          const firstDepositTimes = result.firstDepositTimes || result[3];
          const lastDepositTimes = result.lastDepositTimes || result[4];

          for (let i = 0; i < pepuUsers.length; i++) {
            allRows.push({
              pepuUser: pepuUsers[i],
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
        $("recordRows").innerHTML = `<tr><td colspan="5">Could not load records.</td></tr>`;
      }
    }

    function exportCsv(){
      if (!allRows.length) return;

      const header = "pepu_wallet,yash_amount_raw,yash_amount_human,first_deposit_time,last_deposit_time";

      const lines = allRows.map(r => [
        r.pepuUser,
        r.amountRaw,
        r.amountHuman,
        r.firstDepositTime,
        r.lastDepositTime
      ].map(csvEscape).join(","));

      downloadText(`yashix_migration_${Date.now()}.csv`, [header, ...lines].join("\n"));
    }

    document.addEventListener('DOMContentLoaded', async () => {
      await loadTokenMeta();
      await loadVaultStats();

      $("openWalletPanelBtn").addEventListener('click', () => window.TOSH_WALLET?.openPanel?.());
      $("maxBtn").addEventListener('click', setMaxAmount);
      $("approveMigrate").addEventListener('click', approveAndMigrate);
      $("loadRecords").addEventListener('click', loadRecords);
      $("exportCsv").addEventListener('click', exportCsv);
      $("recordSearch").addEventListener('input', renderRows);

      if (window.TOSH_WALLET) {
        updateWalletUiFromShared(TOSH_WALLET.getState());
        TOSH_WALLET.onChange(updateWalletUiFromShared);
      }
    });