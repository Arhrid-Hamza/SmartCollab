import React, { useEffect, useRef, useState } from 'react';
import {
  Pencil,
  ImagePlus,
  Mail,
  Hash,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  GraduationCap,
  AlertCircle,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import api, { assetUrl } from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';
import { preparePng, cleanName, cleanFree, NIVEAUX, inputClass, Field, FORM_GREEN as GREEN } from './AdminStudentForm';

const shell =
  'admin-form-in bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-4 sm:p-6';

const errorMessage = (err) => {
  const status = err.response?.status;
  const data = err.response?.data;
  if (status === 413) return 'Le serveur a refusé la photo (taille). Vérifiez la limite d’upload du backend.';
  if (status === 403) return 'Action réservée à l’administrateur.';
  if (status === 404) return 'Étudiant introuvable.';
  return (typeof data === 'object' && data?.message) || (typeof data === 'string' && data) || 'Impossible de modifier l’étudiant.';
};

// Page "Modifier l'étudiant" (admin) : photo, nom, prénom, filière, niveau, groupe et mot de passe
export const AdminStudentEditForm = ({ student, onCancel, onSaved }) => {
  const [lastName, setLastName] = useState(student.lastName || '');
  const [firstName, setFirstName] = useState(student.firstName || '');
  const [filiere, setFiliere] = useState(student.filiere || '');
  const [niveau, setNiveau] = useState(student.niveau || '');
  const [groupe, setGroupe] = useState(student.groupe || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const campusId = Object.keys(BACKEND_CAMPUS).find((k) => BACKEND_CAMPUS[k] === student.campus) || student.campus;
  const campus = CAMPUSES.find((c) => c.id === campusId) || null;
  const niveaux = niveau && !NIVEAUX.includes(niveau) ? [niveau, ...NIVEAUX] : NIVEAUX;
  const currentPhoto = preview || (student.avatarUrl ? assetUrl(student.avatarUrl) : '');
  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickPhoto = async (file) => {
    setPhotoError('');
    if (!file) return;
    const { file: ready, error: err } = await preparePng(file);
    if (err) {
      setPhotoError(err);
      return;
    }
    setPhoto(ready);
    setPreview(URL.createObjectURL(ready));
  };

  const cancelPhoto = () => {
    setPhoto(null);
    setPreview('');
    setPhotoError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!lastName.trim() || !firstName.trim()) return setError('Le nom et le prénom sont obligatoires.');
    if (!filiere.trim()) return setError('La filière est obligatoire.');
    if (!niveau) return setError('Choisissez le niveau.');
    if (!groupe.trim()) return setError('Le groupe est obligatoire.');
    if (password && password.trim().length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');

    const fd = new FormData();
    fd.append('lastName', lastName.trim());
    fd.append('firstName', firstName.trim());
    fd.append('filiere', filiere.trim());
    fd.append('niveau', niveau);
    fd.append('groupe', groupe.trim());
    if (password.trim()) fd.append('password', password.trim());
    if (photo) fd.append('photo', photo);

    setLoading(true);
    try {
      const res = await api.put(`/admin/students/${student.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSaved(res.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={shell}>
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
        {/* Gauche : image du campus + photo de l'étudiant */}
        <div className="flex flex-col gap-4">
          {campus?.image && (
            <div className="form-in relative rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] shadow-inner" style={{ animationDelay: '0.15s' }}>
              <img src={campus.image} alt={`Campus EMSI ${campus.label}`} className="campus-img absolute inset-0 w-full h-full object-cover" draggable="false" />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <span className="campus-label inline-flex items-center gap-1.5 text-white text-sm font-semibold">EMSI {campus.label}</span>
              </div>
            </div>
          )}

          <div className="form-in" style={{ animationDelay: '0.3s' }}>
            <span className="block text-xs font-semibold text-slate-600 mb-1">Photo de l’étudiant (PNG)</span>
            <div
              onDragOver={(ev) => {
                ev.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(ev) => {
                ev.preventDefault();
                setDragging(false);
                pickPhoto(ev.dataTransfer.files?.[0]);
              }}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
                dragging ? 'border-[#15885a] bg-emerald-50/80' : 'border-white/90 bg-white/50'
              }`}
            >
              {currentPhoto ? (
                <img
                  key={currentPhoto}
                  src={currentPhoto}
                  alt="Photo"
                  className="success-pop w-28 h-28 rounded-full object-cover object-top ring-4 ring-white shadow-md"
                />
              ) : (
                <span className="inline-flex items-center justify-center w-28 h-28 rounded-full text-3xl font-bold text-white ring-4 ring-white shadow-md" style={{ backgroundColor: GREEN }}>
                  {initials}
                </span>
              )}
              {photo ? (
                <>
                  <span className="text-xs text-slate-600 truncate max-w-full">{photo.name}</span>
                  <button
                    type="button"
                    onClick={cancelPhoto}
                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm"
                    aria-label="Annuler le changement de photo"
                    title="Garder la photo actuelle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-600 inline-flex items-center gap-1.5">
                  <ImagePlus className="w-4 h-4" style={{ color: GREEN }} /> Glissez un PNG ici (max 2 Mo)
                </span>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border bg-white/80 hover:bg-white transition"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                Changer la photo
              </button>
              <input ref={fileRef} type="file" accept="image/png" className="hidden" onChange={(ev) => pickPhoto(ev.target.files?.[0])} />
            </div>
            {photoError && <p className="mt-1.5 text-xs text-rose-600">{photoError}</p>}
          </div>
        </div>

        {/* Droite : champs */}
        <div className="min-w-0">
          <div className="form-in flex items-center gap-3 mb-4" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md" style={{ backgroundColor: GREEN }}>
              <Pencil className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Modifier l’étudiant</h2>
              <p className="text-xs text-slate-600">Le matricule et l’email ne changent pas.</p>
            </div>
          </div>

          <div className="form-in flex flex-wrap gap-2 mb-5" style={{ animationDelay: '0.18s' }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/70 border border-white/80 text-slate-700">
              <Hash className="w-3.5 h-3.5" /> {student.matricule || '—'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 border border-white/80 text-slate-700 max-w-full">
              <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{student.email}</span>
            </span>
          </div>

          {error && (
            <div className="error-shake mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom" required index={0}>
              <input type="text" value={lastName} onChange={(e) => setLastName(cleanName(e.target.value))} className={inputClass} autoComplete="off" />
            </Field>

            <Field label="Prénom" required index={1}>
              <input type="text" value={firstName} onChange={(e) => setFirstName(cleanName(e.target.value))} className={inputClass} autoComplete="off" />
            </Field>

            <Field label="Filière" required index={2} className="sm:col-span-2">
              <input type="text" value={filiere} onChange={(e) => setFiliere(cleanFree(e.target.value))} className={inputClass} autoComplete="off" />
            </Field>

            <Field label="Niveau" required index={3}>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className={`${inputClass} appearance-none pl-9 pr-10 cursor-pointer`}>
                  <option value="" disabled>
                    Choisir le niveau…
                  </option>
                  {niveaux.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </Field>

            <Field label="Groupe" required index={4}>
              <input type="text" value={groupe} onChange={(e) => setGroupe(cleanFree(e.target.value))} className={inputClass} autoComplete="off" />
            </Field>

            <Field label="Nouveau mot de passe" index={5} className="sm:col-span-2">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.slice(0, 64))}
                  className={`${inputClass} pl-9 pr-11`}
                  placeholder="Laisser vide pour ne pas le changer (8 caractères minimum)"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/80 transition"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>

          <div className="form-in mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: `${0.25 + 6 * 0.07}s` }}>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              style={{ backgroundColor: GREEN }}
              className="relative overflow-hidden w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15885a] disabled:cursor-wait transition"
            >
              {loading && <span className="btn-loading-sweep absolute inset-0" aria-hidden="true" />}
              {loading ? (
                <span className="relative flex items-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Enregistrement en cours
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Enregistrer les modifications
                </span>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border bg-white/70 hover:bg-white transition disabled:opacity-50"
              style={{ color: GREEN, borderColor: GREEN }}
            >
              <ArrowLeft className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AdminStudentEditForm;
