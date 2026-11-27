// DompetKeluarga — sample data for a fictional household, Keluarga Santoso (Jakarta).
// All figures are Indonesian rupiah (IDR) per month. Months are keyed YYYY-MM.
// Category actuals are stored per month so the month picker really changes the figures.

export const HOUSEHOLD = {
  name: 'Keluarga Santoso',
  city: 'Jakarta Timur',
  members: 'Budi (38) · Sari (35) · Naya (9) · Dimas (6)',
  currency: 'IDR',
};

export const MONTHS = [
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08', '2026-09', '2026-10', '2026-11',
];

export const MONTH_NAMES = {
  '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
  '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
  '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember',
};

export function monthLabel(key) {
  const [y, m] = key.split('-');
  return `${MONTH_NAMES[m]} ${y}`;
}

// Planned budget (the family's standing monthly plan) and what actually happened.
export const CATEGORIES = [
  { id: 'sewa', name: 'Sewa rumah', group: 'needs', planned: 2500000 },
  { id: 'dapur', name: 'Belanja dapur', group: 'needs', planned: 1800000 },
  { id: 'listrik', name: 'Listrik, air & gas', group: 'needs', planned: 650000 },
  { id: 'transport', name: 'Transport & bensin', group: 'needs', planned: 900000 },
  { id: 'pulsa', name: 'Pulsa & internet', group: 'needs', planned: 350000 },
  { id: 'sekolah', name: 'Sekolah anak', group: 'needs', planned: 1200000 },
  { id: 'kesehatan', name: 'Kesehatan', group: 'needs', planned: 400000 },
  { id: 'makan-luar', name: 'Makan di luar', group: 'wants', planned: 600000 },
  { id: 'hiburan', name: 'Hiburan & nonton', group: 'wants', planned: 450000 },
  { id: 'langganan', name: 'Langganan aplikasi', group: 'wants', planned: 250000 },
  { id: 'belanja', name: 'Belanja pakaian & rumah', group: 'wants', planned: 500000 },
  { id: 'darurat', name: 'Dana darurat', group: 'savings', planned: 1500000 },
  { id: 'pendidikan', name: 'Tabungan pendidikan', group: 'savings', planned: 700000 },
  { id: 'liburan', name: 'Tabungan liburan', group: 'savings', planned: 300000 },
];

export const GROUP_LABELS = {
  needs: 'Kebutuhan',
  wants: 'Keinginan',
  savings: 'Tabungan',
};

export const GROUP_COLORS = {
  needs: '#1e6b4a',
  wants: '#c25e3a',
  savings: '#2f6f8f',
};

// income: gaji + freelance. actuals: what was really spent per category that month.
export const MONTHLY = {
  '2026-01': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1920000, listrik: 688000, transport: 845000, pulsa: 350000, sekolah: 1200000, kesehatan: 275000, 'makan-luar': 720000, hiburan: 510000, langganan: 250000, belanja: 640000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-02': { income: 11800000, gaji: 10000000, freelance: 1800000, actual: { sewa: 2500000, dapur: 1740000, listrik: 612000, transport: 910000, pulsa: 350000, sekolah: 1200000, kesehatan: 520000, 'makan-luar': 585000, hiburan: 380000, langganan: 250000, belanja: 310000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-03': { income: 13200000, gaji: 10000000, freelance: 3200000, actual: { sewa: 2500000, dapur: 1865000, listrik: 704000, transport: 880000, pulsa: 350000, sekolah: 1350000, kesehatan: 340000, 'makan-luar': 660000, hiburan: 470000, langganan: 250000, belanja: 455000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-04': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1790000, listrik: 655000, transport: 930000, pulsa: 350000, sekolah: 1200000, kesehatan: 410000, 'makan-luar': 540000, hiburan: 420000, langganan: 250000, belanja: 380000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-05': { income: 14100000, gaji: 10000000, freelance: 4100000, actual: { sewa: 2500000, dapur: 2010000, listrik: 742000, transport: 965000, pulsa: 350000, sekolah: 1200000, kesehatan: 295000, 'makan-luar': 815000, hiburan: 560000, langganan: 250000, belanja: 720000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-06': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1875000, listrik: 698000, transport: 890000, pulsa: 350000, sekolah: 1450000, kesehatan: 610000, 'makan-luar': 690000, hiburan: 495000, langganan: 250000, belanja: 520000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-07': { income: 12900000, gaji: 10000000, freelance: 2900000, actual: { sewa: 2500000, dapur: 1760000, listrik: 671000, transport: 905000, pulsa: 350000, sekolah: 1200000, kesehatan: 355000, 'makan-luar': 610000, hiburan: 440000, langganan: 250000, belanja: 395000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-08': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1930000, listrik: 725000, transport: 940000, pulsa: 350000, sekolah: 1200000, kesehatan: 480000, 'makan-luar': 745000, hiburan: 520000, langganan: 250000, belanja: 610000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-09': { income: 13600000, gaji: 10000000, freelance: 3600000, actual: { sewa: 2500000, dapur: 1820000, listrik: 663000, transport: 875000, pulsa: 350000, sekolah: 1200000, kesehatan: 300000, 'makan-luar': 625000, hiburan: 455000, langganan: 250000, belanja: 430000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-10': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1895000, listrik: 691000, transport: 915000, pulsa: 350000, sekolah: 1200000, kesehatan: 365000, 'makan-luar': 700000, hiburan: 480000, langganan: 250000, belanja: 505000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
  '2026-11': { income: 12500000, gaji: 10000000, freelance: 2500000, actual: { sewa: 2500000, dapur: 1840000, listrik: 672000, transport: 890000, pulsa: 350000, sekolah: 1200000, kesehatan: 420000, 'makan-luar': 640000, hiburan: 460000, langganan: 250000, belanja: 470000, darurat: 1500000, pendidikan: 700000, liburan: 300000 } },
};

export const DEFAULT_MONTH = '2026-11';

// Day-by-day transactions for the current month (November 2026). Extra entries the
// user adds in the tracker are kept in the browser and merged on top of these.
export const TRANSACTIONS = [
  { date: '2026-11-01', desc: 'Sewa rumah November', cat: 'sewa', amount: 2500000 },
  { date: '2026-11-01', desc: 'Gaji bulanan masuk', cat: 'income', amount: 10000000 },
  { date: '2026-11-02', desc: 'Belanja mingguan — pasar', cat: 'dapur', amount: 486000 },
  { date: '2026-11-02', desc: 'Token listrik', cat: 'listrik', amount: 300000 },
  { date: '2026-11-03', desc: 'Bensin motor', cat: 'transport', amount: 120000 },
  { date: '2026-11-04', desc: 'SPP Naya & Dimas', cat: 'sekolah', amount: 1200000 },
  { date: '2026-11-05', desc: 'Makan malam keluarga di luar', cat: 'makan-luar', amount: 285000 },
  { date: '2026-11-06', desc: 'Paket internet rumah', cat: 'pulsa', amount: 350000 },
  { date: '2026-11-07', desc: 'Belanja mingguan — supermarket', cat: 'dapur', amount: 512000 },
  { date: '2026-11-08', desc: 'Tiket bioskop keluarga', cat: 'hiburan', amount: 260000 },
  { date: '2026-11-09', desc: 'Transfer dana darurat', cat: 'darurat', amount: 1500000 },
  { date: '2026-11-10', desc: 'Ongkos ojek online', cat: 'transport', amount: 86000 },
  { date: '2026-11-11', desc: 'Obat & vitamin anak', cat: 'kesehatan', amount: 185000 },
  { date: '2026-11-12', desc: 'Freelance desain masuk', cat: 'income', amount: 2500000 },
  { date: '2026-11-13', desc: 'Belanja mingguan — pasar', cat: 'dapur', amount: 428000 },
  { date: '2026-11-14', desc: 'Langganan streaming & musik', cat: 'langganan', amount: 250000 },
  { date: '2026-11-15', desc: 'Bensin mobil', cat: 'transport', amount: 250000 },
  { date: '2026-11-15', desc: 'Tol dalam kota', cat: 'transport', amount: 150000 },
  { date: '2026-11-16', desc: 'Transfer tabungan pendidikan', cat: 'pendidikan', amount: 700000 },
  { date: '2026-11-17', desc: 'Jajan & kopi', cat: 'makan-luar', amount: 95000 },
  { date: '2026-11-18', desc: 'Belanja mingguan — supermarket', cat: 'dapur', amount: 414000 },
  { date: '2026-11-19', desc: 'Servis AC', cat: 'listrik', amount: 372000 },
  { date: '2026-11-20', desc: 'Beli sepatu sekolah Dimas', cat: 'belanja', amount: 320000 },
  { date: '2026-11-21', desc: 'Makan siang akhir pekan', cat: 'makan-luar', amount: 260000 },
  { date: '2026-11-22', desc: 'Bensin motor', cat: 'transport', amount: 110000 },
  { date: '2026-11-23', desc: 'Cek gigi Naya', cat: 'kesehatan', amount: 235000 },
  { date: '2026-11-24', desc: 'Transfer tabungan liburan', cat: 'liburan', amount: 300000 },
  { date: '2026-11-25', desc: 'Nonton + popcorn', cat: 'hiburan', amount: 200000 },
  { date: '2026-11-26', desc: 'Beli baju rumah', cat: 'belanja', amount: 150000 },
  { date: '2026-11-26', desc: 'Parkir bulanan kantor', cat: 'transport', amount: 100000 },
  { date: '2026-11-27', desc: 'Ongkos ojek online', cat: 'transport', amount: 74000 },
];

export const GOALS = [
  { id: 'darurat', name: 'Dana darurat 6 bulan', target: 45000000, saved: 31200000, note: 'Target: 6× pengeluaran pokok. Terisi 69% — sekitar 9 bulan lagi dengan Rp1,5 jt/bulan.' },
  { id: 'pendidikan', name: 'Tabungan pendidikan anak', target: 25000000, saved: 9800000, note: 'Untuk biaya masuk sekolah Naya tahun depan. Terisi 39%.' },
  { id: 'liburan', name: 'Liburan keluarga ke Yogyakarta', target: 6000000, saved: 3600000, note: 'Berangkat Juni 2027. Terisi 60% — kurang Rp2,4 jt lagi.' },
  { id: 'motor', name: 'Ganti motor lama', target: 18000000, saved: 4200000, note: 'Motor 2016 sudah sering mogok. Terisi 23%.' },
];

export const TIPS = [
  { tag: 'Dasar', title: 'Mulai dari 50/30/20, lalu sesuaikan', body: 'Bagi pemasukan bersih: 50% kebutuhan, 30% keinginan, 20% tabungan. Di Jakarta sewa sering membuat kebutuhan tembus 55% — itu wajar. Yang penting tabungan tidak pernah nol. Geser target di Kalkulator sampai angkanya terasa bisa dijalani, bukan sekadar ideal di kertas.' },
  { tag: 'Belanja', title: 'Belanja dapur seminggu sekali, dengan daftar', body: 'Keluarga Santoso memangkas Rp200–300 ribu per bulan hanya dengan belanja mingguan pakai daftar dan tidak mampir minimarket setiap pulang kerja. Satu kali belanja besar lebih murah daripada lima kali belanja kecil yang selalu berakhir dengan jajan.' },
  { tag: 'Dana darurat', title: 'Dana darurat dulu, investasi kemudian', body: 'Sebelum memikirkan saham atau reksa dana, siapkan dana darurat 3–6 bulan pengeluaran pokok di rekening terpisah yang mudah dicairkan. Keluarga Santoso menabung Rp1,5 juta per bulan dan sudah di Rp31,2 juta dari target Rp45 juta.' },
  { tag: 'Langganan', title: 'Audit langganan setiap tiga bulan', body: 'Streaming, musik, cloud, aplikasi anak — masing-masing kecil, totalnya Rp250 ribu per bulan di contoh ini. Buka daftar langganan tiap tiga bulan dan batalkan yang sebulan terakhir tidak dibuka. Satu langganan yang dibatalkan sama dengan Rp1,8 juta setahun.' },
  { tag: 'Transport', title: 'Bensin dan ojek: catat, jangan ditebak', body: 'Transport keluarga ini Rp890 ribu di November — bensin motor dan mobil plus ojek online. Begitu dicatat per perjalanan, terlihat ojek pulang kerja yang sebenarnya bisa diganti bus TransJakarta tiga kali seminggu, hemat sekitar Rp150 ribu per bulan.' },
  { tag: 'Anak', title: 'Libatkan anak dalam anggaran', body: 'Naya (9) punya amplop uang jajan mingguan Rp50 ribu. Kalau habis sebelum waktunya, tidak ada tambahan. Dalam tiga bulan ia belajar menahan diri dan malah menabung Rp120 ribu untuk mainan yang ia mau. Anggaran yang diajarkan sejak kecil jauh lebih awet daripada yang didikte.' },
  { tag: 'Gajian', title: 'Bayar dirimu sendiri di hari gajian', body: 'Atur transfer otomatis ke rekening tabungan di tanggal gajian, sebelum uang sempat terpakai. Prinsipnya: tabungan adalah tagihan pertama, bukan sisa. Keluarga Santoso memindahkan Rp2,5 juta setiap tanggal 1 — dan tidak pernah merasa kehilangan karena tidak pernah melihatnya di rekening utama.' },
  { tag: 'Hiburan', title: 'Anggaran hiburan itu perlu, bukan dosa', body: 'Keluarga yang menghapus semua hiburan biasanya gagal di bulan kedua. Rp460 ribu untuk bioskop dan nonton di November membuat anggaran ini bertahan 11 bulan. Hiburan yang direncanakan jauh lebih murah daripada hiburan impulsif karena stres.' },
];
