// DompetKeluarga — HTML for each page, built from data.js. Every value is escaped
// before it goes into the page. Charts are hand-built inline SVG, no libraries.

import { CATEGORIES, GOALS, GROUP_COLORS, GROUP_LABELS, HOUSEHOLD, MONTHLY, TIPS, TRANSACTIONS, monthLabel } from './data.js';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const fmt = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

export const pct = (n) => `${(Math.round(n * 10) / 10).toLocaleString('id-ID')}%`;

export function monthSummary(key) {
  const m = MONTHLY[key];
  const groups = { needs: 0, wants: 0, savings: 0 };
  for (const c of CATEGORIES) groups[c.group] += m.actual[c.id] ?? 0;
  const spent = groups.needs + groups.wants + groups.savings;
  return { ...m, groups, spent, left: m.income - spent };
}

export function groupShare(key, group) {
  const s = monthSummary(key);
  return s.income ? s.groups[group] / s.income : 0;
}

// --- SVG charts (dependency-free) -------------------------------------------

export function donut(segments, size = 190) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  const arcs = segments.map((seg) => {
    const len = Math.max(seg.share, 0.001) * c;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="30" stroke-dasharray="${len.toFixed(1)} ${(c - len).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}"/>`;
    offset += len;
    return el;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Diagram lingkaran pembagian anggaran"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ece5d3" stroke-width="30"/>${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="21" font-weight="800" fill="#1d2b23">${esc(segments[0]?.center ?? '')}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#4c5a51">${esc(segments[0]?.centerSub ?? '')}</text></svg>`;
}

export function hbars(rows, maxValue) {
  return rows.map((row) => {
    const w = maxValue > 0 ? Math.max((row.value / maxValue) * 100, 1.5) : 0;
    return `<tr><td>${esc(row.label)}</td><td class="bar-cell"><div class="bar-track"><div class="bar-fill ${row.cls ?? ''}" style="width:${w.toFixed(1)}%"></div></div></td><td class="num">${fmt(row.value)}</td><td class="num">${pct(row.share * 100)}</td></tr>`;
  }).join('');
}

// --- Shared bits -------------------------------------------------------------

export function monthNav(key) {
  return `<p class="breadcrumb"><a href="#/">&larr; Beranda</a> · <strong>${esc(monthLabel(key))}</strong> · ${esc(HOUSEHOLD.name)}, ${esc(HOUSEHOLD.city)}</p>`;
}

// --- Pages -------------------------------------------------------------------

export function home(key) {
  const s = monthSummary(key);
  const planned = { needs: 0, wants: 0, savings: 0 };
  for (const c of CATEGORIES) planned[c.group] += c.planned;
  const totalPlanned = planned.needs + planned.wants + planned.savings;
  const rows = CATEGORIES.map((c) => ({
    label: c.name,
    value: s.actual[c.id] ?? 0,
    share: (s.actual[c.id] ?? 0) / s.income,
    cls: c.group === 'wants' ? 'wants' : c.group === 'savings' ? 'save' : '',
  })).sort((a, b) => b.value - a.value);
  const recent = TRANSACTIONS.filter((t) => t.cat !== 'income').slice(-6).reverse();
  const topGoal = GOALS[0];
  const goalPct = Math.round((topGoal.saved / topGoal.target) * 100);
  return `
  <section class="hero">
    <span class="pill">Contoh nyata · November 2026</span>
    <h1>Anggaran ${esc(HOUSEHOLD.name)} bulan ini: ${fmt(s.spent)} dari ${fmt(s.income)}</h1>
    <p>${esc(HOUSEHOLD.members)} — satu keluarga di ${esc(HOUSEHOLD.city)} yang mencatat setiap rupiah dengan metode 50/30/20. Pilih bulan di atas untuk melihat bagaimana angkanya berubah dari Januari sampai November 2026.</p>
    <div class="hero-figures">
      <div><b>${fmt(s.income)}</b><span>Pemasukan ${esc(monthLabel(key))}</span></div>
      <div><b>${fmt(s.groups.savings)}</b><span>Ditabung (${pct((s.groups.savings / s.income) * 100)})</span></div>
      <div><b>${fmt(s.left)}</b><span>Sisa belum dialokasikan</span></div>
    </div>
  </section>

  <div class="grid grid-4" style="margin-bottom:16px">
    <div class="card kpi"><div class="kpi-label">Pemasukan</div><div class="kpi-value num">${fmt(s.income)}</div><div class="kpi-sub">Gaji ${fmt(s.gaji)} + freelance ${fmt(s.freelance)}</div></div>
    <div class="card kpi"><div class="kpi-label">Kebutuhan</div><div class="kpi-value num">${fmt(s.groups.needs)}</div><div class="kpi-sub ${s.groups.needs / s.income > 0.5 ? 'neg' : 'pos'}">${pct((s.groups.needs / s.income) * 100)} dari pemasukan · target 50%</div></div>
    <div class="card kpi"><div class="kpi-label">Keinginan</div><div class="kpi-value num">${fmt(s.groups.wants)}</div><div class="kpi-sub">${pct((s.groups.wants / s.income) * 100)} dari pemasukan · target 30%</div></div>
    <div class="card kpi"><div class="kpi-label">Tabungan</div><div class="kpi-value num">${fmt(s.groups.savings)}</div><div class="kpi-sub ${s.groups.savings / s.income >= 0.2 ? 'pos' : 'neg'}">${pct((s.groups.savings / s.income) * 100)} dari pemasukan · target 20%</div></div>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>Pembagian 50/30/20 — ${esc(monthLabel(key))}</h2>
      <div class="donut-wrap">
        ${donut([
          { share: s.groups.needs / s.income, color: GROUP_COLORS.needs, center: pct((s.groups.savings / s.income) * 100), centerSub: 'ditabung' },
          { share: s.groups.wants / s.income, color: GROUP_COLORS.wants },
          { share: s.groups.savings / s.income, color: GROUP_COLORS.savings },
        ])}
        <ul class="donut-legend">
          <li><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${GROUP_COLORS.needs};margin-right:6px"></i>Kebutuhan <b class="num">${fmt(s.groups.needs)} · ${pct((s.groups.needs / s.income) * 100)}</b></li>
          <li><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${GROUP_COLORS.wants};margin-right:6px"></i>Keinginan <b class="num">${fmt(s.groups.wants)} · ${pct((s.groups.wants / s.income) * 100)}</b></li>
          <li><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${GROUP_COLORS.savings};margin-right:6px"></i>Tabungan <b class="num">${fmt(s.groups.savings)} · ${pct((s.groups.savings / s.income) * 100)}</b></li>
          <li>Sisa belum dialokasikan <b class="num">${fmt(s.left)}</b></li>
        </ul>
      </div>
      <p class="small">Target rencana keluarga ini: kebutuhan ${fmt(planned.needs)}, keinginan ${fmt(planned.wants)}, tabungan ${fmt(planned.savings)} — total rencana ${fmt(totalPlanned)}.</p>
    </div>
    <div class="card">
      <h2>Pengeluaran terbesar</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Kategori</th><th></th><th class="num">Jumlah</th><th class="num">% Pemasukan</th></tr></thead>
        <tbody>${hbars(rows.slice(0, 7), rows[0].value)}</tbody>
      </table></div>
      <p><a href="#/pengeluaran">Lihat semua transaksi &rarr;</a></p>
    </div>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <div class="card">
      <h2>Transaksi terakhir</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Tanggal</th><th>Keterangan</th><th class="num">Jumlah</th></tr></thead>
        <tbody>${recent.map((t) => `<tr><td class="num">${esc(t.date.slice(5))}</td><td>${esc(t.desc)}</td><td class="num">${fmt(t.amount)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p><a href="#/pengeluaran">Buka pelacak pengeluaran &rarr;</a></p>
    </div>
    <div class="card goal-card">
      <h2>Tujuan tabungan terdekat</h2>
      <div class="goal-top"><h3>${esc(topGoal.name)}</h3><span class="goal-amount num">${fmt(topGoal.saved)} / ${fmt(topGoal.target)}</span></div>
      <div class="progress" role="progressbar" aria-valuenow="${goalPct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${goalPct}%"></div></div>
      <p>${goalPct}% tercapai — ${esc(topGoal.note)}</p>
      <p><a href="#/tabungan">Lihat semua tujuan tabungan &rarr;</a> · <a href="#/kalkulator">Hitung anggaranmu sendiri &rarr;</a></p>
      <div class="callout green"><p><strong>Penilaian bulan ini:</strong> kebutuhan ${pct((s.groups.needs / s.income) * 100)} — sedikit di atas target 50% karena sewa dan sekolah anak. Keinginan hanya ${pct((s.groups.wants / s.income) * 100)}, jadi tabungan tetap mencapai target 20% dan sisa ${fmt(s.left)} bisa ditambahkan ke dana darurat.</p></div>
    </div>
  </div>`;
}

export function kalkulator() {
  return `
  ${monthNav('2026-11')}
  <h1>Kalkulator Anggaran 50/30/20</h1>
  <p class="lede">Masukkan pemasukan dan pengeluaranmu. Kalkulator membandingkan pembagianmu dengan patokan 50% kebutuhan, 30% keinginan, dan 20% tabungan — lalu memberi tahu apa yang perlu digeser. Angka contoh Keluarga Santoso sudah terisi; ubah sesukamu, semua dihitung langsung di halaman ini.</p>
  <div class="grid grid-2">
    <div class="card">
      <h2>Angka kamu</h2>
      <form id="calcForm">
        <label for="inGaji">Gaji / pemasukan tetap (Rp/bulan)</label>
        <input type="number" id="inGaji" min="0" step="1000" value="10000000">
        <label for="inExtra">Pemasukan tambahan (Rp/bulan)</label>
        <input type="number" id="inExtra" min="0" step="1000" value="2500000">
        <label for="inNeeds">Kebutuhan — sewa, makan, listrik, transport, sekolah (Rp/bulan)</label>
        <input type="number" id="inNeeds" min="0" step="1000" value="6600000">
        <label for="inWants">Keinginan — makan di luar, hiburan, langganan (Rp/bulan)</label>
        <input type="number" id="inWants" min="0" step="1000" value="2100000">
        <label for="inSave">Tabungan &amp; dana darurat (Rp/bulan)</label>
        <input type="number" id="inSave" min="0" step="1000" value="2500000">
        <p><button type="submit">Hitung ulang</button> <button type="button" class="secondary" id="calcReset">Kembalikan contoh</button></p>
      </form>
      <div class="callout" id="calcVerdict"></div>
    </div>
    <div class="card">
      <h2>Hasil perhitunganmu</h2>
      <div id="calcResult"></div>
      <h3 style="margin-top:18px">Geser target tabungan</h3>
      <label for="saveTarget">Target tabungan: <output id="saveTargetOut">20%</output> dari pemasukan</label>
      <input type="range" id="saveTarget" min="5" max="50" step="1" value="20">
      <p class="small">Dengan target <span id="saveTargetPct">20%</span>, kamu perlu menabung <strong class="num" id="saveTargetAmt"></strong> per bulan dari pemasukanmu saat ini.</p>
      <p class="small">Patokan 50/30/20 berasal dari buku <em>All Your Worth</em> (Elizabeth Warren &amp; Amelia Warren Tyagi, 2005). Bukan hukum — di kota besar, kebutuhan 55–60% masih wajar asal tabungan tidak nol.</p>
    </div>
  </div>`;
}

export function pengeluaran(key, state) {
  const all = [...TRANSACTIONS, ...state.extra];
  const q = (state.q ?? '').toLowerCase();
  const cat = state.cat ?? 'all';
  let rows = all.filter((t) => (cat === 'all' || t.cat === cat) && (!q || t.desc.toLowerCase().includes(q) || t.cat.includes(q)));
  const dir = state.dir === 'asc' ? 1 : -1;
  const keyFn = state.sort === 'amount' ? (t) => t.amount : state.sort === 'desc' ? (t) => t.desc : (t) => t.date;
  rows = [...rows].sort((a, b) => (keyFn(a) < keyFn(b) ? -1 : keyFn(a) > keyFn(b) ? 1 : 0) * dir);
  const totalOut = all.filter((t) => t.cat !== 'income').reduce((n, t) => n + t.amount, 0);
  const nOut = all.filter((t) => t.cat !== 'income').length;
  const totalIn = all.filter((t) => t.cat === 'income').reduce((n, t) => n + t.amount, 0);
  const byCat = CATEGORIES.map((c) => ({ ...c, value: all.filter((t) => t.cat === c.id).reduce((n, t) => n + t.amount, 0) }))
    .filter((c) => c.value > 0).sort((a, b) => b.value - a.value);
  const maxCat = byCat.length ? byCat[0].value : 1;
  const cats = [...new Set(all.map((t) => t.cat))];
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) ?? { name: id === 'income' ? 'Pemasukan' : id }).name;
  return `
  ${monthNav(key)}
  <h1>Pelacak Pengeluaran — ${esc(monthLabel(key))}</h1>
  <p class="lede">Semua ${all.length} transaksi tercatat bulan ini. Cari, saring per kategori, atau urutkan tabelnya. Pengeluaran yang kamu tambahkan tersimpan di peramban ini saja.</p>
  <div class="grid grid-3" style="margin-bottom:16px">
    <div class="card kpi"><div class="kpi-label">Pemasukan tercatat</div><div class="kpi-value num pos">${fmt(totalIn)}</div><div class="kpi-sub">Gaji + freelance bulan ini</div></div>
    <div class="card kpi"><div class="kpi-label">Pengeluaran tercatat</div><div class="kpi-value num">${fmt(totalOut)}</div><div class="kpi-sub">${nOut} transaksi pengeluaran dari ${all.length} tercatat</div></div>
    <div class="card kpi"><div class="kpi-label">Sisa tercatat</div><div class="kpi-value num ${totalIn - totalOut >= 0 ? 'pos' : 'neg'}">${fmt(totalIn - totalOut)}</div><div class="kpi-sub">Pemasukan dikurangi pengeluaran</div></div>
  </div>
  <div class="grid grid-2">
    <div class="card">
      <h2>Per kategori</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Kategori</th><th></th><th class="num">Jumlah</th><th class="num">% Pengeluaran</th></tr></thead>
        <tbody>${hbars(byCat.map((c) => ({ label: c.name, value: c.value, share: c.value / totalOut, cls: c.group === 'wants' ? 'wants' : c.group === 'savings' ? 'save' : '' })), maxCat)}</tbody>
      </table></div>
    </div>
    <div class="card">
      <h2>Tambah pengeluaran</h2>
      <form id="addTxForm">
        <label for="txDate">Tanggal</label>
        <input type="date" id="txDate" value="2026-11-27" required>
        <label for="txDesc">Keterangan</label>
        <input type="text" id="txDesc" maxlength="80" placeholder="cth. Belanja sayur di pasar" required>
        <label for="txCat">Kategori</label>
        <select id="txCat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select>
        <label for="txAmount">Jumlah (Rp)</label>
        <input type="number" id="txAmount" min="1000" step="500" placeholder="50000" required>
        <p><button type="submit">Tambah ke daftar</button></p>
      </form>
      <p class="small" id="addTxMsg">Entri tersimpan di perambanmu (localStorage) dan ikut dihitung di total di atas. Tombol hapus di tiap baris menghapus entri tambahanmu.</p>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <h2>Daftar transaksi</h2>
    <div class="toolbar">
      <div class="field"><label for="txSearch">Cari keterangan</label><input type="text" id="txSearch" placeholder="cth. bensin, pasar, SPP" value="${esc(state.q ?? '')}"></div>
      <div class="field"><label for="txCatFilter">Kategori</label><select id="txCatFilter"><option value="all">Semua kategori</option>${cats.map((c) => `<option value="${c}" ${state.cat === c ? 'selected' : ''}>${esc(catName(c))}</option>`).join('')}</select></div>
      <div class="field"><label for="txSort">Urutkan</label><select id="txSort">
        <option value="date-desc" ${state.sort === 'date' && state.dir === 'desc' ? 'selected' : ''}>Tanggal terbaru</option>
        <option value="date-asc" ${state.sort === 'date' && state.dir === 'asc' ? 'selected' : ''}>Tanggal terlama</option>
        <option value="amount-desc" ${state.sort === 'amount' && state.dir === 'desc' ? 'selected' : ''}>Jumlah terbesar</option>
        <option value="amount-asc" ${state.sort === 'amount' && state.dir === 'asc' ? 'selected' : ''}>Jumlah terkecil</option>
        <option value="desc-asc" ${state.sort === 'desc' ? 'selected' : ''}>Keterangan A–Z</option>
      </select></div>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>${rows.map((t, i) => `<tr><td class="num">${esc(t.date)}</td><td>${esc(t.desc)}</td><td>${esc(catName(t.cat))}</td><td class="num ${t.cat === 'income' ? 'pos' : ''}">${t.cat === 'income' ? '+' : '−'}${fmt(t.amount)}</td><td>${t.extra ? `<button class="small danger" data-del="${i}">Hapus</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">Tidak ada transaksi yang cocok. Ubah pencarian atau kategorinya.</td></tr>'}</tbody>
      <tfoot><tr><td colspan="3">Total yang tampil</td><td class="num">${fmt(rows.reduce((n, t) => n + (t.cat === 'income' ? t.amount : -t.amount), 0))}</td><td></td></tr></tfoot>
    </table></div>
  </div>`;
}

export function perencana(key, state) {
  const m = MONTHLY[key];
  const planned = state.planned;
  const rows = CATEGORIES.map((c) => {
    const p = planned[c.id] ?? c.planned;
    const a = m.actual[c.id] ?? 0;
    const diff = p - a;
    return { ...c, planned: p, actual: a, diff };
  });
  const totP = rows.reduce((n, r) => n + r.planned, 0);
  const totA = rows.reduce((n, r) => n + r.actual, 0);
  const groupRows = ['needs', 'wants', 'savings'].map((g) => {
    const rs = rows.filter((r) => r.group === g);
    return { group: g, planned: rs.reduce((n, r) => n + r.planned, 0), actual: rs.reduce((n, r) => n + r.actual, 0) };
  });
  return `
  ${monthNav(key)}
  <h1>Perencana Bulanan — ${esc(monthLabel(key))}</h1>
  <p class="lede">Rencana lawan kenyataan, per kategori. Ubah angka rencana di kolom kanan dan tekan Simpan — rencanamu tersimpan di peramban dan dipakai di semua halaman. Bulan yang dipilih di atas mengubah kolom Aktual.</p>
  <div class="grid grid-3" style="margin-bottom:16px">
    ${groupRows.map((g) => {
      const over = g.actual > g.planned;
      return `<div class="card kpi"><div class="kpi-label">${esc(GROUP_LABELS[g.group])}</div><div class="kpi-value num">${fmt(g.actual)} <span class="small muted">/ ${fmt(g.planned)}</span></div><div class="kpi-sub ${over ? 'neg' : 'pos'}">${over ? `Lewat rencana ${fmt(g.actual - g.planned)}` : `Di bawah rencana ${fmt(g.planned - g.actual)}`}</div></div>`;
    }).join('')}
  </div>
  <div class="card">
    <h2>Rencana vs aktual</h2>
    <form id="planForm">
    <div class="table-scroll"><table>
      <thead><tr><th>Kategori</th><th>Kelompok</th><th class="num">Rencana (Rp)</th><th class="num">Aktual (Rp)</th><th class="num">Selisih</th><th class="bar-cell">Pemakaian rencana</th></tr></thead>
      <tbody>${rows.map((r) => {
        const use = r.planned > 0 ? r.actual / r.planned : 0;
        const cls = use > 1 ? 'over' : use > 0.9 ? 'warn' : '';
        return `<tr><td>${esc(r.name)}</td><td>${esc(GROUP_LABELS[r.group])}</td><td class="num"><input type="number" name="plan-${r.id}" min="0" step="10000" value="${r.planned}" style="width:130px;text-align:right" aria-label="Rencana ${esc(r.name)}"></td><td class="num">${fmt(r.actual)}</td><td class="num ${r.diff >= 0 ? 'pos' : 'neg'}">${r.diff >= 0 ? '+' : '−'}${fmt(Math.abs(r.diff))}</td><td class="bar-cell"><div class="bar-track"><div class="bar-fill ${cls}" style="width:${Math.min(use * 100, 100).toFixed(1)}%"></div></div><span class="small">${pct(use * 100)} dari rencana</span></td></tr>`;
      }).join('')}</tbody>
      <tfoot><tr><td colspan="2">Total</td><td class="num">${fmt(totP)}</td><td class="num">${fmt(totA)}</td><td class="num ${totP - totA >= 0 ? 'pos' : 'neg'}">${totP - totA >= 0 ? '+' : '−'}${fmt(Math.abs(totP - totA))}</td><td></td></tr></tfoot>
    </table></div>
    <p><button type="submit">Simpan rencana</button> <button type="button" class="secondary" id="planReset">Kembalikan rencana awal</button> <span class="small" id="planMsg"></span></p>
    </form>
    <div class="callout"><p><strong>Catatan ${esc(monthLabel(key))}:</strong> total aktual ${fmt(totA)} dari pemasukan ${fmt(m.income)} — ${totA <= totP ? `hemat ${fmt(totP - totA)} dibanding rencana.` : `melewati rencana ${fmt(totA - totP)}.`} Kategori yang paling sering jebol: belanja dapur dan makan di luar. Keduanya sudah diperbaiki dengan belanja mingguan berdaftar sejak Maret.</p></div>
  </div>`;
}

export function tabungan(state) {
  const goals = GOALS.map((g) => {
    const extra = state.added[g.id] ?? 0;
    const saved = g.saved + extra;
    return { ...g, saved, pctDone: Math.min(Math.round((saved / g.target) * 100), 100), left: Math.max(g.target - saved, 0) };
  });
  const totalSaved = goals.reduce((n, g) => n + g.saved, 0);
  const totalTarget = goals.reduce((n, g) => n + g.target, 0);
  return `
  <p class="breadcrumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Tujuan Tabungan</h1>
  <p class="lede">Empat tujuan keluarga ini, dengan progres nyata. Total terkumpul <strong>${fmt(totalSaved)}</strong> dari target <strong>${fmt(totalTarget)}</strong> (${Math.round((totalSaved / totalTarget) * 100)}%). Tambah setoran dari halaman ini — tersimpan di perambanmu.</p>
  <div class="grid grid-2">
    ${goals.map((g) => `
    <div class="card goal-card">
      <div class="goal-top"><h3>${esc(g.name)}</h3><span class="goal-amount num">${fmt(g.saved)} / ${fmt(g.target)}</span></div>
      <div class="progress" role="progressbar" aria-valuenow="${g.pctDone}" aria-valuemin="0" aria-valuemax="100"><div style="width:${g.pctDone}%"></div></div>
      <p>${g.pctDone}% tercapai · kurang <strong class="num">${fmt(g.left)}</strong>${g.left === 0 ? ' — tercapai!' : ''}</p>
      <p class="small">${esc(g.note)}</p>
      <form class="addSaveForm" data-goal="${g.id}">
        <label for="add-${g.id}">Tambah setoran (Rp)</label>
        <input type="number" id="add-${g.id}" name="amount" min="10000" step="10000" placeholder="100000" required>
        <p><button type="submit">Tambah ke tujuan ini</button></p>
      </form>
    </div>`).join('')}
  </div>
  <div class="callout green" style="margin-top:16px"><p><strong>Cara keluarga ini menabung:</strong> Rp2,5 juta dipindah otomatis setiap tanggal 1 — Rp1,5 juta ke dana darurat, Rp700 ribu ke pendidikan, Rp300 ribu ke liburan. Motor ditabung dari sisa akhir bulan, bukan dari jatah tetap. Begitu dana darurat penuh (target Rp45 juta), jatahnya dialihkan ke pendidikan anak.</p></div>`;
}

export function tips(state) {
  const tag = state.tag ?? 'Semua';
  const tags = ['Semua', ...new Set(TIPS.map((t) => t.tag))];
  const list = tag === 'Semua' ? TIPS : TIPS.filter((t) => t.tag === tag);
  return `
  <p class="breadcrumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Tips &amp; Panduan Anggaran Rumah Tangga</h1>
  <p class="lede">Delapan kebiasaan yang benar-benar dipakai Keluarga Santoso — lengkap dengan angka dampaknya, bukan sekadar anjuran umum.</p>
  <div class="chip-row" role="group" aria-label="Saring tips">
    ${tags.map((t) => `<button class="chip ${t === tag ? 'active' : ''}" data-tip-tag="${t}">${esc(t)}</button>`).join('')}
  </div>
  <div class="grid grid-2">
    ${list.map((t) => `<article class="card tip-card"><div class="tip-tag">${esc(t.tag)}</div><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></article>`).join('')}
  </div>
  <p class="small">Menampilkan ${list.length} dari ${TIPS.length} tips.</p>`;
}

export function tentang() {
  return `
  <p class="breadcrumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Tentang DompetKeluarga</h1>
  <p class="lede">DompetKeluarga adalah contoh situs anggaran rumah tangga — dibuat untuk menunjukkan seperti apa rasanya mengelola uang keluarga dengan rapi: satu dasbor, satu kalkulator, satu pelacak, satu perencana, dan tujuan tabungan yang terlihat progresnya.</p>
  <h2>Metode 50/30/20</h2>
  <p>Metode ini membagi pemasukan bersih menjadi tiga kantong. <strong>50% untuk kebutuhan</strong> — sewa, makanan, listrik, transport, sekolah, kesehatan. <strong>30% untuk keinginan</strong> — makan di luar, hiburan, langganan, belanja non-esensial. <strong>20% untuk tabungan</strong> — dana darurat, tabungan tujuan, dan pelunasan utang.</p>
  <p>Angka 50/30/20 adalah titik awal, bukan vonis. Keluarga dengan sewa tinggi atau anak sekolah sering berada di 55% kebutuhan — yang dijaga adalah tabungan tidak pernah nol dan keinginan tidak diam-diam memakan jatah tabungan.</p>
  <h2>Data contoh di situs ini</h2>
  <p>Keluarga Santoso adalah keluarga fiktif: Budi dan Sari, dua anak, tinggal di Jakarta Timur dengan pemasukan Rp12,5 juta per bulan (gaji Rp10 juta + freelance Rp2,5 juta). Semua transaksi, rencana, dan tujuan tabungan di situs ini adalah contoh yang konsisten satu sama lain — total per kategori di halaman Beranda sama dengan jumlah transaksi di Pelacak, dan rencana di Perencana sama dengan yang dipakai di Kalkulator.</p>
  <h2>Cara memakai situs ini</h2>
  <ul>
    <li><strong>Beranda</strong> — ringkasan bulan yang dipilih, lengkap dengan diagram 50/30/20.</li>
    <li><strong>Kalkulator</strong> — masukkan angkamu sendiri dan lihat perbandingannya dengan patokan.</li>
    <li><strong>Pengeluaran</strong> — cari, saring, urutkan, dan tambah transaksi.</li>
    <li><strong>Perencana</strong> — ubah rencana per kategori dan bandingkan dengan aktual tiap bulan.</li>
    <li><strong>Tabungan</strong> — pantau progres tiap tujuan dan tambah setoran.</li>
    <li><strong>Tips</strong> — kebiasaan hemat yang sudah terbukti di keluarga contoh.</li>
  </ul>
  <div class="callout"><p><strong>Privasi:</strong> situs ini tidak memakai akun, tidak mengirim data ke mana pun, dan tidak memuat apa pun dari internet. Perubahan yang kamu buat (transaksi tambahan, rencana, setoran) hanya tersimpan di perambanmu sendiri dan bisa dihapus dengan membersihkan data situs.</p></div>
  <p><a class="btn" href="#/kalkulator">Hitung anggaranmu sekarang &rarr;</a></p>`;
}

export function missing() {
  return `<div class="notfound"><h1>Halaman tidak ditemukan</h1><p>Halaman yang kamu cari tidak ada di DompetKeluarga.</p><p><a class="btn" href="#/">Kembali ke Beranda</a></p></div>`;
}
