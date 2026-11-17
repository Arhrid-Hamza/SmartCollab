import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, GraduationCap, Layers, MapPin, Minus, Sparkles, Users, X } from 'lucide-react';
import api, { assetUrl } from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';
import { NIVEAUX, cleanFree } from './AdminStudentForm';

const GREEN = '#15885a';
const EASE = [0.22, 1, 0.36, 1];

const errorMessage = (err) => {
  const status = err.response?.status;
  const data = err.response?.data;
  if (status === 403) return 'Action réservée à l’administrateur.';
  if (status === 404 || status === 405) return 'Cette fonction n’est pas disponible : mettez à jour le backend (endpoint /admin/students/bulk).';
  return (typeof data === 'object' && data?.message) || (typeof data === 'string' && data) || 'Impossible de modifier les étudiants.';
};

// Code backend d'un campus -> id du sélecteur (ex. ORANGERS -> ORANGER)
const campusIdOf = (code) => Object.keys(BACKEND_CAMPUS).find((k) => BACKEND_CAMPUS[k] === code) || code;
const campusLabelOf = (code) => CAMPUSES.find((c) => c.id === campusIdOf(code))?.label || code || '—';

const initialsOf = (s) => `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();

const Avatar = ({ s, className = '' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full overflow-hidden text-xs font-bold text-white bg-[#15885a] shrink-0 ${className}`}
  >
    {s.avatarUrl ? <img src={assetUrl(s.avatarUrl)} alt="" className="w-full h-full object-cover object-top" draggable={false} /> : initialsOf(s)}
  </span>
);

const StepTitle = ({ n, title, hint }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: GREEN }}>
      {n}
    </span>
    <div className="min-w-0">
      <h3 className="text-sm font-bold text-slate-800 leading-tight">{title}</h3>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  </div>
);

// Page "Modifier niveau et filière" : une seule saisie appliquée à tous les étudiants sélectionnés
export const AdminBulkEditForm = ({ students, suggestions = [], onCancel, onSaved }) => {
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [campusNew, setCampusNew] = useState(''); // id du sélecteur, '' = inchangé
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null); // liste mise à jour renvoyée par le serveur

  const campusLabel = [...new Set(students.map((s) => campusLabelOf(s.campus)))].join(' · ');
  const campusCodeNew = campusNew ? BACKEND_CAMPUS[campusNew] || campusNew : '';

  const filiereValue = filiere.trim();
  const preview = useMemo(
    () =>
      students.map((s) => {
        const nextNiveau = niveau || s.niveau || '';
        const nextFiliere = filiereValue || s.filiere || '';
        const nextCampus = campusCodeNew || s.campus || '';
        return {
          s,
          nextNiveau,
          nextFiliere,
          nextCampus,
          niveauChanged: !!niveau && niveau !== (s.niveau || ''),
          filiereChanged: !!filiereValue && filiereValue !== (s.filiere || ''),
          campusChanged: !!campusCodeNew && campusCodeNew !== (s.campus || ''),
        };
      }),
    [students, niveau, filiereValue, campusCodeNew]
  );
  const changedCount = preview.filter((p) => p.niveauChanged || p.filiereChanged || p.campusChanged).length;
  const nothingChosen = !niveau && !filiereValue && !campusNew;
  const nothingToDo = !nothingChosen && changedCount === 0;
  const canSubmit = !loading && !nothingChosen && !nothingToDo;

  const filiereChips = useMemo(() => {
    const set = new Set(suggestions.filter(Boolean));
    students.forEach((s) => s.filiere && set.add(s.filiere));
    return [...set].slice(0, 8);
  }, [suggestions, students]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.put('/admin/students/bulk', {
        ids: students.map((s) => s.id),
        filiere: filiereValue || null,
        niveau: niveau || null,
        campus: campusCodeNew || null,
      });
      setDone(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const shown = students.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="max-w-5xl mx-auto rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] shadow-[0_24px_60px_-20px_rgba(21,136,90,0.55)] border border-white/70"
    >
      {/* ------------------------------------------------------------ Panneau vert */}
      <div className="relative overflow-hidden p-7 sm:p-8 text-white bg-gradient-to-br from-[#0b5d3e] via-[#15885a] to-[#2fbf86]">
        <motion.span
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/20 blur-2xl"
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full bg-emerald-200/25 blur-3xl"
          animate={{ scale: [1, 1.12, 1], x: [0, 14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1.2px)', backgroundSize: '22px 22px' }}
        />

        <div className="relative z-10 flex flex-col h-full gap-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <div>
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
            >
              <Layers className="w-7 h-7" />
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
              className="mt-4 text-2xl font-extrabold leading-tight tracking-tight"
            >
              Modifier niveau,
              <br />filière & campus
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              className="mt-2 text-sm text-white/80"
            >
              Une seule saisie, appliquée en une fois à tous les étudiants sélectionnés.
            </motion.p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center">
              {shown.map((s, i) => (
                <motion.span
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.4, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 300, damping: 18 }}
                  className={i ? '-ml-3' : ''}
                >
                  <Avatar s={s} className="w-11 h-11 ring-2 ring-white shadow-md" />
                </motion.span>
              ))}
              {students.length > shown.length && (
                <span className="-ml-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#15885a] text-xs font-bold ring-2 ring-white shadow-md">
                  +{students.length - shown.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/25">
                <Users className="w-3.5 h-3.5" />
                {students.length} étudiant{students.length > 1 ? 's' : ''}
              </span>
              {campusLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/25">
                  <MapPin className="w-3.5 h-3.5" />
                  EMSI {campusLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Un champ laissé vide n’est pas modifié.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ Panneau blanc */}
      <div className="bg-white p-6 sm:p-8 min-w-0">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-4"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-full text-white shadow-[0_12px_30px_-8px_rgba(21,136,90,0.8)]"
                style={{ background: 'linear-gradient(135deg,#2fbf86,#0f6b46)' }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-emerald-300"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
                <Check className="w-10 h-10" strokeWidth={3} />
              </motion.span>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  {done.length || students.length} étudiant{(done.length || students.length) > 1 ? 's' : ''} mis à jour
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {niveau && <>Niveau : <strong className="text-slate-700">{niveau}</strong></>}
                  {niveau && filiereValue && ' · '}
                  {filiereValue && <>Filière : <strong className="text-slate-700">{filiereValue}</strong></>}
                  {(niveau || filiereValue) && campusNew && ' · '}
                  {campusNew && <>Campus : <strong className="text-slate-700">{campusLabelOf(campusCodeNew)}</strong></>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSaved(done)}
                className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:brightness-110 transition"
                style={{ background: 'linear-gradient(135deg,#1fa971,#0f6b46)' }}
              >
                Retour à la liste
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-7">
              {/* 1. Niveau */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45, ease: EASE }}>
                <StepTitle n="1" title="Niveau" hint="Choisissez le nouveau niveau, ou laissez « Inchangé »." />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[{ v: '', label: 'Inchangé' }, ...NIVEAUX.map((n) => ({ v: n, label: n }))].map((o) => {
                    const active = niveau === o.v;
                    return (
                      <motion.button
                        key={o.label}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setNiveau(o.v)}
                        aria-pressed={active}
                        className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                          active
                            ? 'text-white border-transparent shadow-[0_8px_18px_-8px_rgba(21,136,90,0.9)]'
                            : 'bg-emerald-50/60 text-slate-700 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300'
                        }`}
                        style={active ? { background: 'linear-gradient(135deg,#1fa971,#0f6b46)' } : undefined}
                      >
                        {o.v === '' ? <Minus className="w-3.5 h-3.5" /> : active && <Check className="w-3.5 h-3.5" />}
                        {o.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* 2. Filière */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45, ease: EASE }}>
                <StepTitle n="2" title="Filière" hint="Saisissez la nouvelle filière, ou laissez vide pour la conserver." />
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#15885a] pointer-events-none" />
                  <input
                    type="text"
                    value={filiere}
                    onChange={(e) => setFiliere(cleanFree(e.target.value))}
                    placeholder="Ex. Ingénierie informatique"
                    autoComplete="off"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-emerald-100 bg-emerald-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#15885a] focus:ring-4 focus:ring-emerald-100 transition"
                  />
                  {filiere && (
                    <button
                      type="button"
                      onClick={() => setFiliere('')}
                      aria-label="Effacer la filière"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {filiereChips.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {filiereChips.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFiliere(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          filiereValue === f ? 'bg-[#15885a] text-white border-[#15885a]' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-[#15885a]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* 3. Campus */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45, ease: EASE }}>
                <StepTitle n="3" title="Campus" hint="Choisissez le nouveau campus, ou laissez « Inchangé »." />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[{ id: '', label: 'Inchangé' }, ...CAMPUSES.map((c) => ({ id: c.id, label: c.label }))].map((o) => {
                    const active = campusNew === o.id;
                    return (
                      <motion.button
                        key={o.label}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setCampusNew(o.id)}
                        aria-pressed={active}
                        className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                          active
                            ? 'text-white border-transparent shadow-[0_8px_18px_-8px_rgba(21,136,90,0.9)]'
                            : 'bg-emerald-50/60 text-slate-700 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300'
                        }`}
                        style={active ? { background: 'linear-gradient(135deg,#1fa971,#0f6b46)' } : undefined}
                      >
                        {o.id === '' ? <Minus className="w-3.5 h-3.5" /> : active ? <Check className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5 text-[#15885a]" />}
                        {o.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* 4. Aperçu */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45, ease: EASE }}>
                <StepTitle n="4" title="Aperçu des changements" hint={nothingChosen ? 'Choisissez un niveau, une filière et/ou un campus.' : `${changedCount} étudiant${changedCount > 1 ? 's' : ''} concerné${changedCount > 1 ? 's' : ''}`} />
                <ul className="max-h-60 overflow-y-auto rounded-2xl border border-emerald-100 divide-y divide-emerald-50 bg-white">
                  {preview.map(({ s, nextNiveau, nextFiliere, nextCampus, niveauChanged, filiereChanged, campusChanged }, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + Math.min(i, 10) * 0.04, duration: 0.35, ease: 'easeOut' }}
                      className="flex items-center gap-3 px-3.5 py-2.5"
                    >
                      <Avatar s={s} className="w-9 h-9" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 truncate">{s.matricule}</p>
                      </div>
                      <div className="text-right text-xs space-y-0.5 min-w-0 max-w-[55%]">
                        <p className="truncate">
                          {niveauChanged && <span className="text-slate-400 line-through mr-1.5">{s.niveau || '—'}</span>}
                          <motion.span key={nextNiveau} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={niveauChanged ? 'font-bold text-[#15885a]' : 'text-slate-500'}>
                            {nextNiveau || '—'}
                          </motion.span>
                        </p>
                        <p className="truncate">
                          {filiereChanged && <span className="text-slate-400 line-through mr-1.5">{s.filiere || '—'}</span>}
                          <motion.span key={nextFiliere} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={filiereChanged ? 'font-bold text-[#15885a]' : 'text-slate-500'}>
                            {nextFiliere || '—'}
                          </motion.span>
                        </p>
                        <p className="truncate">
                          {campusChanged && <span className="text-slate-400 line-through mr-1.5">{campusLabelOf(s.campus)}</span>}
                          <motion.span key={nextCampus} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={campusChanged ? 'font-bold text-[#15885a]' : 'text-slate-500'}>
                            {campusLabelOf(nextCampus)}
                          </motion.span>
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                {nothingToDo && <p className="mt-2 text-xs text-amber-600">Ces valeurs sont déjà celles des étudiants sélectionnés.</p>}
              </motion.div>

              {error && (
                <div role="alert" className="error-shake p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="px-6 py-3 rounded-full text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  aria-busy={loading}
                  className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(21,136,90,0.9)] hover:brightness-110 transition disabled:opacity-45 disabled:shadow-none disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#1fa971,#0f6b46)' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Enregistrement…
                    </>
                  ) : (
                    <>
                      Appliquer à {changedCount || students.length} étudiant{(changedCount || students.length) > 1 ? 's' : ''}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
