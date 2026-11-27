// DompetKeluarga — router and interactions. Hash routes, month state, and all
// controls are wired here. User-added data lives in localStorage only.
//
//   #/                Beranda (dashboard)
//   #/kalkulator      Kalkulator anggaran 50/30/20
//   #/pengeluaran     Pelacak pengeluaran
//   #/perencana       Perencana bulanan
//   #/tabungan        Tujuan tabungan
//   #/tips            Tips & panduan
//   #/tentang         Tentang & metode
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, DEFAULT_MONTH, GOALS, MONTHS, MONTHLY, TRANSACTIONS, monthLabel } from './data.js';
import { esc, fmt, home, kalkulator, missing, pengeluaran, perencana, tabungan, tentang, tips } from './views.js';

const app = document.getElementById('app');
const monthSelect = document.getElementById('monthSelect');

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`dompetkeluarga:${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`dompetkeluarga:${key}`, JSON.stringify(value));
    } catch {
      /* storage unavailable: the page still works for this session */
    }
  },
};

const state = {
  month: store.get('month', DEFAULT_MONTH),
  extraTx: store.get('extraTx', []),
  planned: store.get('planned', {}),
  addedSave: store.get('addedSave', {}),
  txQuery: '',
  txCat: 'all',
  txSort: 'date',
  txDir: 'desc',
  tipTag: 'Semua',
};

if (!MONTHS.includes(state.month)) state.month = DEFAULT_MONTH;

monthSelect.innerHTML = MONTHS.map((m) => `<option value="${m}" ${m === state.month ? 'selected' : ''}>${esc(monthLabel(m))}</option>`).join('');
monthSelect.addEventListener('change', () => {
  state.month = monthSelect.value;
  store.set('month', state.month);
  render();
});

// --- Kalkulator ---------------------------------------------------------------

function calcNumbers() {
  const num = (id) => Math.max(Number(document.getElementById(id)?.value || 0), 0);
  const income = num('inGaji') + num('inExtra');
  const needs = num('inNeeds');
  const wants = num('inWants');
  const save = num('inSave');
  const spent = needs + wants + save;
  return { income, needs, wants, save, spent, left: income - spent };
}

function renderCalc() {
  const c = calcNumbers();
  const target = Number(document.getElementById('saveTarget')?.value || 20);
  const share = (v) => (c.income ? v / c.income : 0);
  const bar = (v, cls) => {
    const w = Math.min(share(v) * 100, 100).toFixed(1);
    return `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${w}%"></div></div>`;
  };
  const row = (label, value, targetPct, cls) => `<tr><td>${label}</td><td class="num">${fmt(value)}</td><td class="num">${(share(value) * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</td><td class="num">target ${targetPct}%</td><td class="bar-cell">${bar(value, cls)}</td></tr>`;
  const result = document.getElementById('calcResult');
  if (result) {
    result.innerHTML = `
      <div class="grid grid-3" style="margin-bottom:12px">
        <div><div class="kpi-label">Pemasukan</div><div class="kpi-value num" style="font-size:1.3rem;font-weight:800">${fmt(c.income)}</div></div>
        <div><div class="kpi-label">Total dialokasikan</div><div class="kpi-value num" style="font-size:1.3rem;font-weight:800">${fmt(c.spent)}</div></div>
        <div><div class="kpi-label">Sisa</div><div class="kpi-value num ${c.left >= 0 ? 'pos' : 'neg'}" style="font-size:1.3rem;font-weight:800">${fmt(c.left)}</div></div>
      </div>
      <div class="table-scroll"><table>
        <thead><tr><th>Kelompok</th><th class="num">Jumlah</th><th class="num">Bagian</th><th class="num">Patokan</th><th></th></tr></thead>
        <tbody>
          ${row('Kebutuhan', c.needs, 50, '')}
          ${row('Keinginan', c.wants, 30, 'wants')}
          ${row('Tabungan', c.save, 20, 'save')}
        </tbody>
      </table></div>`;
  }
  const verdict = document.getElementById('calcVerdict');
  if (verdict) {
    const bits = [];
    if (c.income === 0) bits.push('Isi dulu pemasukanmu — tanpa itu tidak ada yang bisa dihitung.');
    if (c.left < 0) bits.push(`Alokasimu melebihi pemasukan sebesar <strong>${fmt(-c.left)}</strong>. Kurangi keinginan dulu — itu kantong yang paling mudah digeser tanpa menyentuh kebutuhan.`);
    if (c.income > 0 && share(c.save) < 0.2) bits.push(`Tabunganmu ${(share(c.save) * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}% — di bawah patokan 20%. Coba geser Rp${Math.round((0.2 - share(c.save)) * c.income).toLocaleString('id-ID')} dari keinginan ke tabungan.`);
    if (c.income > 0 && share(c.save) >= 0.2) bits.push(`Tabunganmu sudah <strong>${(share(c.save) * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</strong> — di atas patokan 20%. Pertahankan, dan arahkan sisa ${fmt(Math.max(c.left, 0))} ke dana darurat atau tujuan tabungan.`);
    if (c.income > 0 && share(c.needs) > 0.55) bits.push(`Kebutuhan ${(share(c.needs) * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}% — wajar di kota besar, tapi periksa langganan dan makan di luar: dua pos itu paling sering menyamar sebagai kebutuhan.`);
    if (bits.length === 0) bits.push('Anggaranmu seimbang dengan patokan 50/30/20. Tinggal dijaga konsistensinya tiap bulan.');
    verdict.innerHTML = `<p><strong>Penilaian:</strong></p><p>${bits.join('</p><p>')}</p>`;
  }
  const amt = document.getElementById('saveTargetAmt');
  if (amt) amt.textContent = fmt(c.income * (target / 100));
  const pctOut = document.getElementById('saveTargetOut');
  if (pctOut) pctOut.textContent = `${target}%`;
  const pctSpan = document.getElementById('saveTargetPct');
  if (pctSpan) pctSpan.textContent = `${target}%`;
}

function wireCalc() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    renderCalc();
  });
  form.addEventListener('input', renderCalc);
  document.getElementById('calcReset')?.addEventListener('click', () => {
    document.getElementById('inGaji').value = 10000000;
    document.getElementById('inExtra').value = 2500000;
    document.getElementById('inNeeds').value = 6600000;
    document.getElementById('inWants').value = 2100000;
    document.getElementById('inSave').value = 2500000;
    renderCalc();
  });
  document.getElementById('saveTarget')?.addEventListener('input', renderCalc);
  renderCalc();
}

// --- Pengeluaran ---------------------------------------------------------------

function wireTx() {
  const form = document.getElementById('addTxForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tx = {
      date: document.getElementById('txDate').value,
      desc: document.getElementById('txDesc').value.trim(),
      cat: document.getElementById('txCat').value,
      amount: Math.max(Number(document.getElementById('txAmount').value || 0), 0),
      extra: true,
    };
    if (!tx.desc || tx.amount <= 0) return;
    state.extraTx.push(tx);
    store.set('extraTx', state.extraTx);
    form.reset();
    document.getElementById('txDate').value = '2026-11-27';
    render();
    document.getElementById('addTxMsg').textContent = `Ditambahkan: ${tx.desc} — ${fmt(tx.amount)}. Total di atas sudah termasuk entri ini.`;
  });
  document.getElementById('txSearch')?.addEventListener('input', (e) => {
    state.txQuery = e.target.value;
    render({ keepFocus: 'txSearch' });
  });
  document.getElementById('txCatFilter')?.addEventListener('change', (e) => {
    state.txCat = e.target.value;
    render();
  });
  document.getElementById('txSort')?.addEventListener('change', (e) => {
    const [sort, dir] = e.target.value.split('-');
    state.txSort = sort;
    state.txDir = dir;
    render();
  });
  app.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.del);
      const all = [...(window.__txRows ?? [])];
      const target = all[idx];
      if (!target) return;
      state.extraTx = state.extraTx.filter((t) => t !== target);
      store.set('extraTx', state.extraTx);
      render();
    });
  });
}

// --- Perencana -----------------------------------------------------------------

function wirePlan() {
  const form = document.getElementById('planForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = { ...state.planned };
    for (const c of CATEGORIES) {
      const input = form.querySelector(`[name="plan-${c.id}"]`);
      if (input) next[c.id] = Math.max(Number(input.value || 0), 0);
    }
    state.planned = next;
    store.set('planned', next);
    render();
    const msg = document.getElementById('planMsg');
    if (msg) msg.textContent = 'Rencana tersimpan.';
  });
  document.getElementById('planReset')?.addEventListener('click', () => {
    state.planned = {};
    store.set('planned', {});
    render();
  });
}

// --- Tabungan ------------------------------------------------------------------

function wireSave() {
  app.querySelectorAll('.addSaveForm').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const goalId = form.dataset.goal;
      const amount = Math.max(Number(form.querySelector('input').value || 0), 0);
      if (amount <= 0) return;
      state.addedSave[goalId] = (state.addedSave[goalId] ?? 0) + amount;
      store.set('addedSave', state.addedSave);
      const goal = GOALS.find((g) => g.id === goalId);
      const saved = goal.saved + state.addedSave[goalId];
      form.querySelector('button').textContent = `Ditambahkan ${fmt(amount)} — total ${fmt(saved)}`;
      render();
    });
  });
}

// --- Tips ----------------------------------------------------------------------

function wireTips() {
  app.querySelectorAll('[data-tip-tag]').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.tipTag = chip.dataset.tipTag;
      render();
    });
  });
}

// --- Router --------------------------------------------------------------------

function setActiveNav(route) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function render(options = {}) {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || 'home';
  const txState = {
    q: state.txQuery,
    cat: state.txCat,
    sort: state.txSort,
    dir: state.txDir,
    extra: state.extraTx,
  };
  const planState = { planned: Object.fromEntries(CATEGORIES.map((c) => [c.id, state.planned[c.id] ?? c.planned])) };
  let html = '';
  let title = 'DompetKeluarga — Anggaran Rumah Tangga yang Rapi';
  if (route === 'home') { html = home(state.month); }
  else if (route === 'kalkulator') { html = kalkulator(); title = 'Kalkulator Anggaran 50/30/20 | DompetKeluarga'; }
  else if (route === 'pengeluaran') { html = pengeluaran(state.month, txState); title = `Pelacak Pengeluaran — ${monthLabel(state.month)} | DompetKeluarga`; }
  else if (route === 'perencana') { html = perencana(state.month, planState); title = `Perencana Bulanan — ${monthLabel(state.month)} | DompetKeluarga`; }
  else if (route === 'tabungan') { html = tabungan({ added: state.addedSave }); title = 'Tujuan Tabungan | DompetKeluarga'; }
  else if (route === 'tips') { html = tips({ tag: state.tipTag }); title = 'Tips & Panduan Anggaran | DompetKeluarga'; }
  else if (route === 'tentang') { html = tentang(); title = 'Tentang DompetKeluarga'; }
  else { html = missing(); title = 'Tidak ditemukan | DompetKeluarga'; }
  document.title = title;
  app.innerHTML = html;
  setActiveNav(route);

  // Expose the currently shown transaction rows for the delete buttons.
  if (route === 'pengeluaran') {
    const all = [...TRANSACTIONS, ...state.extraTx];
    const q = state.txQuery.toLowerCase();
    window.__txRows = all
      .filter((t) => (state.txCat === 'all' || t.cat === state.txCat) && (!q || t.desc.toLowerCase().includes(q) || t.cat.includes(q)))
      .sort((a, b) => {
        const dir = state.txDir === 'asc' ? 1 : -1;
        const ka = state.txSort === 'amount' ? a.amount : state.txSort === 'desc' ? a.desc : a.date;
        const kb = state.txSort === 'amount' ? b.amount : state.txSort === 'desc' ? b.desc : b.date;
        return (ka < kb ? -1 : ka > kb ? 1 : 0) * dir;
      });
  }

  wireCalc();
  wireTx();
  wirePlan();
  wireSave();
  wireTips();
  window.scrollTo(0, 0);
  if (options.keepFocus) {
    const el = document.getElementById(options.keepFocus);
    if (el) {
      const end = el.value.length;
      el.focus();
      el.setSelectionRange(end, end);
    }
  }
  window.__shotReady = true;
}

window.addEventListener('hashchange', () => render());
render();
