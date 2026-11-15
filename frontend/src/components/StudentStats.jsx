import React, { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, GraduationCap, MapPin, TrendingUp, Layers } from 'lucide-react';
import CountUp from './CountUp';

const GREEN = '#15885a';
const CARD =
  'rounded-2xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] p-5 sm:p-6';

const fr = (n) => Number(n).toLocaleString('fr-FR');

/* ---------- Outils ---------- */
const naturalKey = (label) => {
  const m = String(label).match(/\d+/);
  return m ? Number(m[0]) : Number.POSITIVE_INFINITY;
};
const sortLabels = (a, b) => naturalKey(a) - naturalKey(b) || String(a).localeCompare(String(b), 'fr');

const countBy = (rows, pick, fallback) => {
  const map = new Map();
  rows.forEach((r) => {
    const key = (pick(r) || '').toString().trim() || fallback;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return map;
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a);
  const B = hex(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};
// Palette verte : foncé -> moyen -> clair
const shade = (i, n) => {
  if (n <= 1) return '#0b5d3e';
  const t = i / (n - 1);
  return t < 0.5 ? mix('#0b5d3e', '#17b26a', t * 2) : mix('#17b26a', '#9be8c0', (t - 0.5) * 2);
};

const niceStep = (max) => {
  const raw = Math.max(1, max) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow;
};

const smoothPath = (pts, top, bottom) => {
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1y = Math.min(bottom, Math.max(top, p1.y + (p2.y - p0.y) / 6));
    const c2y = Math.min(bottom, Math.max(top, p2.y - (p3.y - p1.y) / 6));
    d += ` C${p1.x + (p2.x - p0.x) / 6},${c1y} ${p2.x - (p3.x - p1.x) / 6},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
};

const CardTitle = ({ icon: Icon, children, sub }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
      <Icon className="w-5 h-5" />
    </span>
    <div>
      <h3 className="text-base font-bold text-slate-800 leading-tight">{children}</h3>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  </div>
);

const Empty = () => <p className="text-sm text-slate-500 py-10 text-center">Aucune donnée pour ce campus.</p>;

/* ---------- 1) Courbe : nouveaux étudiants par année ---------- */
const YearChart = ({ rows }) => {
  const uid = useId().replace(/[^\w-]/g, '');
  const [hover, setHover] = useState(null);

  const data = useMemo(() => {
    const years = rows.map((r) => (r.createdAt ? new Date(r.createdAt).getFullYear() : null)).filter(Boolean);
    if (!years.length) return [];
    const now = new Date().getFullYear();
    const from = Math.min(Math.min(...years), now - 1);
    const to = Math.max(Math.max(...years), now);
    const out = [];
    let total = 0;
    for (let y = from; y <= to; y++) {
      const n = years.filter((v) => v === y).length;
      total += n;
      out.push({ year: y, count: n, total });
    }
    return out;
  }, [rows]);

  if (!data.length) return <Empty />;

  const W = 600;
  const H = 280;
  const L = 44;
  const R = 24;
  const T = 24;
  const B = 38;
  const step = niceStep(Math.max(...data.map((d) => d.count)));
  const yMax = step * 4;
  const x = (i) => (data.length === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (data.length - 1));
  const y = (v) => T + (1 - v / yMax) * (H - T - B);
  const pts = data.map((d, i) => ({ x: x(i), y: y(d.count) }));
  const line = smoothPath(pts, T, H - B);
  const area = `${line} L${pts[pts.length - 1].x},${H - B} L${pts[0].x},${H - B} Z`;
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" role="img" aria-label="Nouveaux étudiants par année">
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <motion.rect x="0" y="0" height={H} initial={{ width: 0 }} animate={{ width: W }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
          </clipPath>
        </defs>

        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k}>
            <line x1={L} x2={W - R} y1={y(k * step)} y2={y(k * step)} stroke="#15885a" strokeOpacity={k === 0 ? 0.3 : 0.12} strokeDasharray={k === 0 ? '0' : '4 5'} />
            <text x={L - 10} y={y(k * step) + 4} textAnchor="end" fontSize="11" fill="#64748b">
              {fr(k * step)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${uid}-fill)`} clipPath={`url(#${uid}-clip)`} />
        <motion.path
          d={line}
          fill="none"
          stroke={GREEN}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {data.map((d, i) => (
          <g key={d.year}>
            <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="12" fill="#475569" fontWeight={hover === i ? 700 : 500}>
              {d.year}
            </text>
            <motion.circle
              cx={pts[i].x}
              cy={pts[i].y}
              r={hover === i ? 7 : 5}
              fill="#fff"
              stroke={GREEN}
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + (i / Math.max(1, data.length - 1)) * 1.1, type: 'spring', stiffness: 400, damping: 18 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <rect
              x={x(i) - (W - L - R) / Math.max(1, data.length - 1) / 2}
              y={T}
              width={(W - L - R) / Math.max(1, data.length - 1)}
              height={H - T - B}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/90 text-white text-xs px-3 py-2 shadow-lg whitespace-nowrap"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(active.count) / H) * 100}%`, marginTop: -12 }}
        >
          <p className="font-bold">{active.year}</p>
          <p>{fr(active.count)} nouveau(x) étudiant(s)</p>
          <p className="text-white/70">Total cumulé : {fr(active.total)}</p>
        </div>
      )}
    </div>
  );
};

/* ---------- 2) Donut : étudiants par année d'études ---------- */
const DonutLevels = ({ rows }) => {
  const items = useMemo(() => {
    const map = countBy(rows, (r) => r.niveau, 'Non précisé');
    return [...map.entries()].sort((a, b) => sortLabels(a[0], b[0])).map(([label, count]) => ({ label, count }));
  }, [rows]);

  if (!items.length) return <Empty />;

  const total = items.reduce((s, i) => s + i.count, 0);
  const r = 78;
  const C = 2 * Math.PI * r;
  const gap = items.length > 1 ? 3 : 0;
  let acc = 0;
  const segs = items.map((it, i) => {
    const len = (it.count / total) * C;
    const seg = { ...it, color: shade(i, items.length), start: acc, len: Math.max(0, len - gap), pct: (it.count / total) * 100 };
    acc += len;
    return seg;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" stroke="#15885a" strokeOpacity="0.08" strokeWidth="30" />
          {segs.map((s, i) => (
            <motion.circle
              key={s.label}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="30"
              strokeDashoffset={-s.start}
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={{ strokeDasharray: `${s.len} ${C - s.len}` }}
              transition={{ delay: 0.15 + i * 0.35, duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUp
            from={0}
            to={total}
            duration={1.2}
            separator=" "
            trigger="view"
            className="leading-none"
            style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f2a1f' }}
          />
          <span className="text-sm font-semibold text-slate-600 mt-1">Total</span>
        </div>
      </div>

      <ul className="flex-1 w-full divide-y divide-slate-200/70">
        {segs.map((s, i) => (
          <motion.li
            key={s.label}
            className="flex items-center gap-3 py-2.5"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="flex-1 text-sm text-slate-700 truncate">{s.label}</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-bold text-slate-800">{fr(s.count)}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800 w-16 text-center">
              {s.pct.toFixed(1)}%
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

/* ---------- 3) Barres : étudiants par filière ---------- */
const FiliereBars = ({ rows }) => {
  const items = useMemo(() => {
    const map = countBy(rows, (r) => r.filiere, 'Non précisée');
    return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  }, [rows]);

  if (!items.length) return <Empty />;

  const step = niceStep(Math.max(...items.map((i) => i.count)));
  const yMax = step * 4;

  return (
    <div className="flex gap-3">
      <div className="relative h-56 w-8 shrink-0 text-[11px] text-slate-500">
        {[0, 1, 2, 3, 4].map((k) => (
          <span key={k} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(k * step * 100) / yMax}%`, transform: 'translateY(50%)' }}>
            {fr(k * step)}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="relative min-w-full" style={{ width: Math.max(items.length * 84, 0) }}>
          <div className="relative h-56">
            {[0, 1, 2, 3, 4].map((k) => (
              <div
                key={k}
                className="absolute left-0 right-0 border-t"
                style={{ bottom: `${(k * step * 100) / yMax}%`, borderColor: 'rgba(21,136,90,0.14)', borderStyle: k === 0 ? 'solid' : 'dashed' }}
              />
            ))}
            <div className="absolute inset-0 flex items-end justify-around gap-3 px-2">
              {items.map((it, i) => (
                <div key={it.label} className="flex flex-col items-center justify-end h-full flex-1 max-w-[72px]" title={`${it.label} : ${it.count}`}>
                  <CountUp
                    from={0}
                    to={it.count}
                    duration={1}
                    delay={0.2 + i * 0.1}
                    trigger="view"
                    className="text-xs font-bold text-slate-700 mb-1"
                  />
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{ background: `linear-gradient(180deg, ${shade(i % 6, 6)} 0%, ${GREEN} 100%)`, originY: 1 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(it.count / yMax) * 100}%` }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around gap-3 px-2 mt-2">
            {items.map((it) => (
              <span key={it.label} className="flex-1 max-w-[72px] text-center text-[11px] font-medium text-slate-600 leading-tight line-clamp-2" title={it.label}>
                {it.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */
export const StudentStats = ({ rows, campusLabel }) => (
  <div className="space-y-6">
    <motion.div className={`${CARD} flex items-center justify-between gap-3`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
          <GraduationCap className="w-6 h-6" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">Étudiants</h2>
          <p className="text-xs text-slate-600 inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> EMSI {campusLabel}
          </p>
        </div>
      </div>
      <span className="px-4 py-1.5 rounded-full text-white font-bold" style={{ backgroundColor: GREEN }}>
        <CountUp from={0} to={rows.length} duration={1} trigger="view" />
      </span>
    </motion.div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <motion.div className={CARD} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
        <CardTitle icon={TrendingUp} sub="Selon l'année d'inscription">
          Évolution des étudiants par année
        </CardTitle>
        <YearChart rows={rows} />
      </motion.div>

      <motion.div className={CARD} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
        <CardTitle icon={BarChart3}>Étudiants par année d’études</CardTitle>
        <DonutLevels rows={rows} />
      </motion.div>
    </div>

    <motion.div className={CARD} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45 }}>
      <CardTitle icon={Layers} sub="Nombre d’étudiants dans chaque filière">
        Étudiants par filière
      </CardTitle>
      <FiliereBars rows={rows} />
    </motion.div>
  </div>
);
