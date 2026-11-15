import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, Hash, GraduationCap, ChevronRight, ArrowLeft, Pencil } from 'lucide-react';
import { assetUrl } from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';

import './StudentCard.css';

const TILT = 12; // degrés d'inclinaison max
const PARALLAX = 8; // décalage de la photo (px)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};

const campusOf = (code) => {
  const id = Object.keys(BACKEND_CAMPUS).find((k) => BACKEND_CAMPUS[k] === code) || code;
  return CAMPUSES.find((c) => c.id === id) || null;
};

// Carte étudiant : design "Spotlight" + mouvement de la ProfileCard (inclinaison à ressort, lumière qui suit le pointeur, parallaxe, intro)
const StudentCard = ({ student, onEdit }) => {
  const rootRef = useRef(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const size = { width: root.offsetWidth, height: root.offsetHeight };
    const x = { p: 0, v: 0, target: 0 };
    const y = { p: 0, v: 0, target: 0 };
    const light = { p: 0, target: 0 };
    let raf = 0;
    let last = 0;
    let slowUntil = 0;
    let touchId = null;

    const write = () => {
      const angle = reduced ? 0 : TILT;
      const tilt = Math.min(1, Math.hypot(x.p, y.p));
      const style = root.style;
      style.setProperty('--sc-light-x', `${((x.p + 1) * 0.5 * size.width).toFixed(1)}px`);
      style.setProperty('--sc-light-y', `${((y.p + 1) * 0.5 * size.height).toFixed(1)}px`);
      style.setProperty('--sc-rotate-x', `${(y.p * angle).toFixed(3)}deg`);
      style.setProperty('--sc-rotate-y', `${(-x.p * angle).toFixed(3)}deg`);
      style.setProperty('--sc-shift-x', `${(x.p * (reduced ? 0 : PARALLAX)).toFixed(2)}px`);
      style.setProperty('--sc-shift-y', `${(y.p * (reduced ? 0 : PARALLAX)).toFixed(2)}px`);
      style.setProperty('--sc-tilt', (tilt * light.p).toFixed(4));
      style.setProperty('--sc-active', light.p.toFixed(4));
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const slow = now < slowUntil;
      const stiffness = slow ? 24 : 120;
      const damping = slow ? 9 : 16;
      const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        for (const axis of [x, y]) {
          axis.v += (stiffness * (axis.target - axis.p) - damping * axis.v) * h;
          axis.p += axis.v * h;
        }
      }
      const tau = light.target > light.p ? 0.18 : slow ? 0.9 : 0.45;
      light.p += (light.target - light.p) * (1 - Math.exp(-dt / tau));
      write();
      const moving =
        Math.abs(x.target - x.p) > 0.0005 ||
        Math.abs(y.target - y.p) > 0.0005 ||
        Math.abs(x.v) > 0.0005 ||
        Math.abs(y.v) > 0.0005 ||
        Math.abs(light.target - light.p) > 0.002;
      if (moving) {
        raf = requestAnimationFrame(frame);
      } else {
        x.p = x.target;
        y.p = y.target;
        light.p = light.target;
        write();
        raf = 0;
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const aim = (nx, ny, on = true) => {
      x.target = clamp(nx, -1, 1);
      y.target = clamp(ny, -1, 1);
      light.target = on ? 1 : 0;
      slowUntil = 0;
      wake();
    };
    const aimAt = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      aim(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const release = () => aim(0, 0, false);

    const onEnter = (e) => e.pointerType === 'mouse' && aimAt(e);
    const onMove = (e) => (e.pointerType === 'mouse' || e.pointerId === touchId) && aimAt(e);
    const onLeave = (e) => e.pointerType === 'mouse' && release();
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return;
      touchId = e.pointerId;
      aimAt(e);
    };
    const onUp = (e) => {
      if (e.pointerId !== touchId) return;
      touchId = null;
      release();
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);

    const observer = new ResizeObserver(() => {
      size.width = root.offsetWidth;
      size.height = root.offsetHeight;
      write();
    });
    observer.observe(root);

    // Intro : la carte "balaye" brièvement la lumière puis se pose
    if (!reduced) {
      x.p = 0.62;
      y.p = -0.55;
      light.p = 1;
      slowUntil = performance.now() + 1400;
      write();
      wake();
    } else {
      write();
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const flash = (key) => {
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const campus = campusOf(student.campus);
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div ref={rootRef} className="student-card">
      <div className="student-card__body">
        {campus?.image && <span className="student-card__cover" style={{ backgroundImage: `url(${campus.image})` }} aria-hidden="true" />}

        {onEdit && (
          <button
            type="button"
            className="student-card__edit"
            title="Modifier l’étudiant"
            aria-label="Modifier l’étudiant"
            onClick={() => onEdit(student)}
          >
            <Pencil size={18} />
          </button>
        )}

        <div className="student-card__top">
          <span className="student-card__avatar">
            {student.avatarUrl ? <img src={assetUrl(student.avatarUrl)} alt={fullName} draggable={false} /> : initials}
          </span>
        </div>

        <h3 className="student-card__name">{fullName}</h3>
        <p className="student-card__sub" title={student.email}>
          <Mail size={18} />
          <span>{student.email}</span>
        </p>

        <div className="student-card__chips">
          {student.matricule && (
            <span className="student-card__chip student-card__chip--mono">
              <Hash size={16} />
              {student.matricule}
            </span>
          )}
          {student.filiere && (
            <span className="student-card__chip" title={student.filiere}>
              <GraduationCap size={16} />
              {student.filiere}
            </span>
          )}
        </div>

        <div className="student-card__stats">
          {[
            ['Niveau', student.niveau],
            ['Groupe', student.groupe],
            ['Campus', campus?.label || student.campus],
          ].map(([label, value]) => (
            <div key={label} className="student-card__stat">
              <div className="student-card__stat-value" title={value || ''}>
                {value || '—'}
              </div>
              <div className="student-card__stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="student-card__actions">
          <a className="student-card__cta" href={`mailto:${student.email}`}>
            <Mail size={19} />
            Envoyer un email
          </a>
          <button
            type="button"
            className="student-card__square"
            aria-label="Copier le matricule"
            title="Copier le matricule"
            onClick={async () => {
              await copyText(student.matricule || '');
              flash('matricule');
            }}
          >
            {copied === 'matricule' ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <span className="student-card__glare" />
        <span className="student-card__shade" />
        <span className="student-card__rim" />
      </div>
    </div>
  );
};

const MemoCard = memo(StudentCard);

const HEADINGS = {
  matricule: 'pour le matricule',
  email: "pour l'email",
  nom: 'pour',
};

// Résultat d'une recherche : une ou plusieurs cartes, qui apparaissent l'une après l'autre
// kind : 'matricule' | 'email' | 'nom' (adapte la phrase d'en-tête) ; hideHeading : masque la phrase
export const StudentCardGrid = ({ students, query, kind = 'matricule', hideHeading = false, onEdit }) => (
  <div>
    {!hideHeading && (
      <p className="text-sm text-slate-600 mb-8 text-center">
        {students.length} résultat{students.length > 1 ? 's' : ''} {HEADINGS[kind] || HEADINGS.matricule}{' '}
        <strong className="text-slate-800">« {query.trim()} »</strong>
      </p>
    )}
    <div className="flex flex-wrap justify-center gap-8">
      {students.map((s, i) => (
        <motion.div
          key={s.id}
          className="student-card-reveal"
          style={{ '--sc-delay': `${i * 0.15}s`, transformPerspective: 1000 }}
          initial={{ opacity: 0, y: 90, scale: 0.82, rotateX: -24 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{
            delay: i * 0.15,
            type: 'spring',
            stiffness: 130,
            damping: 15,
            opacity: { duration: 0.4, delay: i * 0.15 },
          }}
        >
          <MemoCard student={s} onEdit={onEdit} />
        </motion.div>
      ))}
    </div>
  </div>
);

// Plusieurs étudiants correspondent (même nom / prénom) : liste photo + nom prénom + matricule, un clic ouvre la carte
export const StudentResultList = ({ students, query, onSelect }) => (
  <div className="max-w-3xl mx-auto">
    <p className="text-sm text-slate-600 mb-6 text-center">
      {students.length} résultats pour <strong className="text-slate-800">« {query.trim()} »</strong>
      <span className="block text-xs text-slate-500 mt-1">Cliquez sur un étudiant pour afficher sa carte</span>
    </p>

    <div className="rounded-2xl bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
      <div className="grid grid-cols-[56px_1fr_auto_20px] sm:grid-cols-[64px_1fr_200px_20px] gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-white/70">
        <span>Photo</span>
        <span>Nom et prénom</span>
        <span>Matricule</span>
        <span />
      </div>

      <ul className="divide-y divide-white/70">
        {students.map((s, i) => {
          const name = `${s.firstName || ''} ${s.lastName || ''}`.trim();
          const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full grid grid-cols-[56px_1fr_auto_20px] sm:grid-cols-[64px_1fr_200px_20px] gap-3 items-center px-4 py-3 text-left bg-white/30 hover:bg-white/70 focus-visible:bg-white/70 focus-visible:outline-none transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full overflow-hidden text-sm font-bold text-white bg-[#15885a] ring-2 ring-emerald-300/60">
                  {s.avatarUrl ? (
                    <img src={assetUrl(s.avatarUrl)} alt={name} className="w-full h-full object-cover object-top" draggable={false} />
                  ) : (
                    initials
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800 truncate">{name}</span>
                  <span className="block text-xs text-slate-500 truncate">{s.email}</span>
                </span>
                <span className="font-mono text-xs sm:text-sm font-medium text-slate-700 truncate">{s.matricule || '—'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  </div>
);

// Bouton "retour à la liste" affiché au-dessus de la carte ouverte depuis la liste
export const BackToListButton = ({ onClick }) => (
  <div className="max-w-3xl mx-auto mb-6">
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#15885a] bg-white/60 hover:bg-white/90 border border-white/80 shadow-sm transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Retour à la liste
    </button>
  </div>
);

export default MemoCard;
