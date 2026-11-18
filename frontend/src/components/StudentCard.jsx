import React, { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, Copy, Check, Hash, GraduationCap, BookOpen, Users, ChevronRight, ArrowLeft, Pencil, Trash2, Minus, X } from 'lucide-react';
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
  // La même carte sert pour les professeurs : matière + groupes à la place de matricule / filière / niveau
  const isProf = student.role === 'PROFESSOR';
  const groupes = student.groupes || [];

  return (
    <div ref={rootRef} className="student-card">
      <div className="student-card__body">
        {campus?.image && <span className="student-card__cover" style={{ backgroundImage: `url(${campus.image})` }} aria-hidden="true" />}

        {onEdit && (
          <button
            type="button"
            className="student-card__edit"
            title={isProf ? 'Modifier le professeur' : 'Modifier l’étudiant'}
            aria-label={isProf ? 'Modifier le professeur' : 'Modifier l’étudiant'}
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
          {isProf ? (
            <>
              {student.matiere && (
                <span className="student-card__chip" title={student.matiere}>
                  <BookOpen size={16} />
                  {student.matiere}
                </span>
              )}
              {groupes.slice(0, 3).map((g) => (
                <span key={g} className="student-card__chip" title={g}>
                  <Users size={16} />
                  {g}
                </span>
              ))}
              {groupes.length > 3 && (
                <span className="student-card__chip" title={groupes.slice(3).join(', ')}>
                  +{groupes.length - 3}
                </span>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="student-card__stats" style={isProf ? { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' } : undefined}>
          {(isProf
            ? [
                ['Groupes', groupes.length ? String(groupes.length) : ''],
                ['Campus', campus?.label || student.campus],
              ]
            : [
                ['Niveau', student.niveau],
                ['Groupe', student.groupe],
                ['Campus', campus?.label || student.campus],
              ]
          ).map(([label, value]) => (
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
            aria-label={isProf ? 'Copier l’email' : 'Copier le matricule'}
            title={isProf ? 'Copier l’email' : 'Copier le matricule'}
            onClick={async () => {
              await copyText((isProf ? student.email : student.matricule) || '');
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
export const StudentCardGrid = ({ students, query, kind = 'matricule', hideHeading = false, onEdit, onDelete }) => (
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
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(s)}
              className="sc-delete-in group mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-rose-600 bg-white/70 hover:bg-rose-600 hover:text-white border border-rose-300 hover:border-rose-600 shadow-sm hover:shadow-lg hover:shadow-rose-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
              {s.role === 'PROFESSOR' ? 'Supprimer le professeur' : 'Supprimer l’étudiant'}
            </button>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

// Plusieurs étudiants correspondent (même nom / prénom) : liste photo + nom prénom + matricule, un clic ouvre la carte
const Checkbox = ({ checked, indeterminate = false }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded-md border-2 transition-colors duration-200 ${
      checked || indeterminate ? 'bg-[#15885a] border-[#15885a]' : 'bg-white/80 border-slate-300'
    }`}
  >
    <AnimatePresence initial={false}>
      {(checked || indeterminate) && (
        <motion.span
          key={indeterminate && !checked ? 'dash' : 'check'}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="text-white"
        >
          {indeterminate && !checked ? <Minus className="w-3.5 h-3.5" strokeWidth={3} /> : <Check className="w-3.5 h-3.5" strokeWidth={3.5} />}
        </motion.span>
      )}
    </AnimatePresence>
  </span>
);

// Liste de résultats : clic = ouvre la carte ; icône "éditer" = mode sélection pour modifier niveau et filière en groupe
export const StudentResultList = ({
  students,
  query,
  onSelect,
  selectMode = false,
  onToggleMode,
  selectedIds,
  onToggleOne,
  onToggleAll,
  onBulkEdit,
  variant = 'student', // 'student' | 'professor'
}) => {
  const isProf = variant === 'professor';
  const count = selectedIds ? selectedIds.size : 0;
  const allSelected = count > 0 && count === students.length;
  const someSelected = count > 0 && !allSelected;

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm text-slate-600"
        >
          {students.length} résultats pour <strong className="text-slate-800">« {query.trim()} »</strong>
          <span className="block text-xs text-slate-500 mt-0.5">
            {selectMode
              ? `Cochez les ${isProf ? 'professeurs' : 'étudiants'} à modifier`
              : `Cliquez sur un ${isProf ? 'professeur' : 'étudiant'} pour afficher sa carte`}
          </span>
        </motion.p>

        {onToggleMode && (
          <motion.button
            type="button"
            onClick={onToggleMode}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            aria-pressed={selectMode}
            className={`inline-flex items-center gap-2 pl-2.5 pr-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm transition-colors cursor-pointer ${
              selectMode
                ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                : 'text-white border-transparent shadow-[0_8px_18px_-8px_rgba(21,136,90,0.9)]'
            }`}
            style={selectMode ? undefined : { background: 'linear-gradient(135deg,#1fa971,#0f6b46)' }}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={selectMode ? 'x' : 'pencil'}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  {selectMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </span>
            {selectMode ? 'Annuler' : isProf ? 'Éditer matière, groupes et campus' : 'Éditer niveau, filière et campus'}
          </motion.button>
        )}
      </div>

      <div className="rounded-2xl bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-white/70">
          {/* Colonne photo : en mode sélection, la case "tout sélectionner" + le mot "Tous" prennent la place de "Photo" */}
          <motion.div
            initial={false}
            animate={{ width: selectMode ? 82 : 44 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="shrink-0 overflow-hidden flex items-center"
          >
            {selectMode ? (
              <button type="button" onClick={onToggleAll} aria-label="Tout sélectionner" className="inline-flex items-center gap-2 cursor-pointer uppercase">
                <Checkbox checked={allSelected} indeterminate={someSelected} />
                <span className={allSelected ? 'text-[#15885a]' : ''}>Tous</span>
              </button>
            ) : (
              <span>Photo</span>
            )}
          </motion.div>
          <span className="flex-1 min-w-0">Nom et prénom</span>
          <span className="w-[120px] sm:w-[190px] shrink-0">{isProf ? 'Matière' : 'Matricule'}</span>
          <span className="w-4 shrink-0" />
        </div>

        <ul>
          {students.map((s, i) => {
            const name = `${s.firstName || ''} ${s.lastName || ''}`.trim();
            const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();
            const checked = !!selectedIds?.has(s.id);
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 22, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: Math.min(i, 12) * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
                className="relative border-b border-white/70 last:border-b-0"
              >
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleY: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#15885a] origin-center"
                />
                <button
                  type="button"
                  role={selectMode ? 'checkbox' : undefined}
                  aria-checked={selectMode ? checked : undefined}
                  onClick={() => (selectMode ? onToggleOne?.(s.id) : onSelect(s))}
                  className={`group w-full flex items-center gap-3 px-4 py-3 text-left focus-visible:outline-none transition-colors duration-200 cursor-pointer ${
                    checked ? 'bg-emerald-100/60' : 'bg-white/30 hover:bg-white/75 focus-visible:bg-white/75'
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={{ width: selectMode ? 26 : 0, opacity: selectMode ? 1 : 0, marginRight: selectMode ? 0 : -12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden shrink-0 flex items-center"
                  >
                    <Checkbox checked={checked} />
                  </motion.span>
                  <span
                    className={`inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-full overflow-hidden text-sm font-bold text-white bg-[#15885a] ring-2 transition-all duration-200 ${
                      checked ? 'ring-[#15885a] scale-105' : 'ring-emerald-300/60 group-hover:ring-emerald-400'
                    }`}
                  >
                    {s.avatarUrl ? (
                      <img src={assetUrl(s.avatarUrl)} alt={name} className="w-full h-full object-cover object-top" draggable={false} />
                    ) : (
                      initials
                    )}
                  </span>
                  <span className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-0.5">
                    <span className="block text-sm font-semibold text-slate-800 truncate">{name}</span>
                    <span className="block text-xs text-slate-500 truncate">{s.email}</span>
                  </span>
                  <span className={`w-[120px] sm:w-[190px] shrink-0 text-xs sm:text-sm font-medium text-slate-700 truncate ${isProf ? '' : 'font-mono'}`} title={isProf ? s.matiere || '' : undefined}>
                    {(isProf ? s.matiere : s.matricule) || '—'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-all duration-200 ${selectMode ? 'opacity-0' : 'group-hover:translate-x-1 group-hover:text-[#15885a]'}`}
                  />
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Barre du bas : apparaît dès qu'au moins une personne est cochée */}
      <AnimatePresence>
        {selectMode && count > 0 && (
          <motion.div
            key="bulk-bar"
            initial={{ y: 90, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 90, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[#0b3d2c]/95 backdrop-blur-xl border border-emerald-300/30 shadow-[0_18px_40px_-12px_rgba(6,43,32,0.8)] text-white">
              <span className="text-sm font-semibold">
                <motion.span key={count} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block font-extrabold text-emerald-300">
                  {count}
                </motion.span>{' '}
                sélectionné{count > 1 ? 's' : ''}
              </span>
              <button type="button" onClick={onToggleAll} className="text-xs font-semibold text-white/70 hover:text-white underline-offset-2 hover:underline cursor-pointer">
                {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              <button
                type="button"
                onClick={onBulkEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#06281c] bg-gradient-to-r from-emerald-300 to-emerald-400 hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
