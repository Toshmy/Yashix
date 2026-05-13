
(function () {
  const NAV_PAGES = ['toshlock.html', 'mylocks.html', 'toshdashboard.html', 'toshrank.html'];

  function currentPath() {
    return location.pathname.split('/').pop() || 'toshlock.html';
  }

  function shortAddr(addr) {
    return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';
  }

  function syncSubnav() {
    const path = currentPath();
    document.querySelectorAll('[data-tlf-nav] a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === path);
    });
  }

  function walletMessage(state, chainId) {
    if (!state?.connected || !state?.address) {
      return { status: 'Not connected', summary: 'Not connected' };
    }
    if (chainId && Number(state.chainId) !== Number(chainId)) {
      return {
        status: `Wrong chain · ${state.chainId}`,
        summary: shortAddr(state.address)
      };
    }
    return {
      status: `Connected · ${shortAddr(state.address)}`,
      summary: shortAddr(state.address)
    };
  }

  function applyWalletTargets(state, options = {}) {
    const chainId = options.chainId ? Number(options.chainId) : null;
    const msg = walletMessage(state, chainId);

    if (options.statusEl) options.statusEl.textContent = msg.status;
    if (options.summaryEl) options.summaryEl.textContent = msg.summary;
    if (options.addressEl) options.addressEl.textContent = state?.address || '';
  }

  function mountWalletBridge(options = {}) {
    const wallet = window.TOSH_WALLET;
    if (!wallet) return;

    const statusEl = options.statusSelector ? document.querySelector(options.statusSelector) : null;
    const summaryEl = options.summarySelector ? document.querySelector(options.summarySelector) : null;
    const addressEl = options.addressSelector ? document.querySelector(options.addressSelector) : null;

    const apply = (state) => applyWalletTargets(state, {
      chainId: options.chainId,
      statusEl,
      summaryEl,
      addressEl
    });

    apply(wallet.getState());
    wallet.onChange(apply);

    document.querySelectorAll('[data-tlf-open-wallet]').forEach((btn) => {
      btn.addEventListener('click', () => wallet.openPanel?.());
    });
  }

  function mountHelpModal() {
    const fab = document.getElementById('tlf-help-fab');
    const overlay = document.getElementById('tlf-help-overlay');
    const modal = document.getElementById('tlf-help-modal');
    const close = document.getElementById('tlf-help-close');
    if (!fab || !overlay || !modal || !close) return;

    const focusable = () => modal.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    let lastFocus = null;

    function openHelp() {
      lastFocus = document.activeElement;
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      close.focus();
      document.addEventListener('keydown', onKey);
    }

    function closeHelp() {
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeHelp();
      }
      if (e.key === 'Tab' && overlay.getAttribute('aria-hidden') === 'false') {
        const nodes = Array.from(focusable());
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    fab.addEventListener('click', openHelp);
    close.addEventListener('click', closeHelp);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeHelp();
    });
  }

  function mount() {
    syncSubnav();
    mountHelpModal();
  }

  window.TOSH_LOCK_FAMILY = {
    mount,
    syncSubnav,
    shortAddr,
    mountWalletBridge,
    applyWalletTargets,
    walletMessage,
    NAV_PAGES
  };

  document.addEventListener('DOMContentLoaded', mount);
})();
