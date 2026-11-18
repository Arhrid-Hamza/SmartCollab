import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Trash2, AlertCircle } from 'lucide-react';
import { assetUrl } from '../api/client';

const GREEN = '#15885a';
const MIN_LOADING = 1200; // ms : l'animation de chargement reste visible même si le serveur répond très vite
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const errorMessage = (err) => {
  const status = err?.response?.status;
  const data = err?.response?.data;
  if (status === 403) return 'Action réservée à l’administrateur.';
  if (data && typeof data === 'object' && data.message) return data.message;
  // 404 sans message du backend = la route de suppression n'existe pas dans le backend qui tourne (ancienne version)
  if (status === 404) return 'Le backend en cours ne connaît pas encore la suppression (404). Arrêtez-le, copiez les fichiers backend du zip, puis relancez-le.';
  return 'La suppression a échoué. Réessayez.';
};

const Avatar = ({ student }) => {
  const [broken, setBroken] = useState(false);
  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center w-14 h-14 rounded-full overflow-hidden text-base font-bold text-white ring-4 ring-white shadow-md shrink-0"
      style={{ backgroundColor: GREEN }}
    >
      {student.avatarUrl && !broken ? (
        <img
          src={assetUrl(student.avatarUrl)}
          alt=""
          onError={() => setBroken(true)}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      ) : (
        initials
      )}
    </span>
  );
};

/**
 * Confirmation de suppression d'un étudiant ou d'un professeur, en 4 étapes animées :
 *  confirm (alerte) -> deleting (chargement) -> done (✔ supprimé) | error
 * `onDelete` fait l'appel API ; `onDeleted` est appelé à la fin pour mettre à jour la liste.
 */
export const ConfirmDeleteDialog = ({ student, onDelete, onDeleted, onClose }) => {
  const [phase, setPhase] = useState('confirm');
  const [error, setError] = useState('');
  const cancelRef = useRef(null);
  const alive = useRef(true);
  const name = `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const isProf = student.role === 'PROFESSOR';

  useEffect(() => {
    alive.current = true;
    cancelRef.current?.focus();
    return () => {
      alive.current = false;
    };
  }, []);

  // Échap = annuler (impossible pendant la suppression)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && (phase === 'confirm' || phase === 'error')) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  // Bloque le défilement de la page derrière la fenêtre
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const confirmDelete = async () => {
    setError('');
    setPhase('deleting');
    try {
      await Promise.all([onDelete(), sleep(MIN_LOADING)]);
      if (!alive.current) return;
      setPhase('done');
      await sleep(1200);
      if (alive.current) onDeleted();
    } catch (err) {
      if (!alive.current) return;
      setError(errorMessage(err));
      setPhase('error');
    }
  };

  const locked = phase === 'deleting' || phase === 'done';

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked) onClose();
      }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] p-7 text-center overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.86, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Barre de chargement (indéterminée) */}
        {phase === 'deleting' && (
          <div className="absolute inset-x-0 top-0 h-1.5 bg-rose-100 overflow-hidden" aria-hidden="true">
            <div className="delete-progress-bar h-full w-2/5 rounded-full bg-rose-500" />
          </div>
        )}

        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Icône de l'étape */}
          <div className="relative mx-auto w-20 h-20 mb-4">
            {phase === 'deleting' && (
              <span className="absolute inset-0 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" aria-hidden="true" />
            )}
            <span
              className={`absolute inset-2 rounded-full flex items-center justify-center ${
                phase === 'done' ? 'text-white' : 'bg-rose-100 text-rose-600'
              } ${phase === 'confirm' ? 'dialog-icon-shake' : ''} ${phase === 'done' ? 'success-pop' : ''}`}
              style={phase === 'done' ? { backgroundColor: GREEN } : undefined}
            >
              {phase === 'done' ? (
                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path className="check-draw" d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : phase === 'error' ? (
                <AlertCircle className="w-9 h-9" />
              ) : (
                <Trash2 className="w-8 h-8" />
              )}
            </span>
          </div>

          <h2 id="delete-dialog-title" className="text-xl font-bold text-slate-900">
            {phase === 'confirm' && (isProf ? 'Supprimer ce professeur ?' : 'Supprimer cet étudiant ?')}
            {phase === 'deleting' && 'Suppression en cours…'}
            {phase === 'done' && (isProf ? 'Professeur supprimé' : 'Étudiant supprimé')}
            {phase === 'error' && 'Suppression impossible'}
          </h2>

          {(phase === 'confirm' || phase === 'deleting') && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-left">
              <Avatar student={student} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                <p className="text-xs font-mono text-slate-600 truncate">{student.matricule || student.email}</p>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-600">
            {phase === 'confirm' && 'Son compte, sa photo et ses identifiants seront effacés définitivement. Cette action est irréversible.'}
            {phase === 'deleting' && 'Merci de patienter, ne fermez pas cette page.'}
            {phase === 'done' && <><strong className="text-slate-800">{name}</strong> a été supprimé.</>}
            {phase === 'error' && error}
          </p>

          {phase === 'confirm' && (
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Oui, supprimer
              </button>
            </div>
          )}

          {phase === 'error' && (
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          )}

        </motion.div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ConfirmDeleteDialog;
