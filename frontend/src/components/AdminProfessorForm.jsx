import React, { useEffect, useRef, useState } from 'react';
import {
  UserPlus,
  MapPin,
  ImagePlus,
  Mail,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  BookOpen,
  User,
  UserRound,
  Users,
  Plus,
  X,
} from 'lucide-react';
import api, { assetUrl } from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';
import { preparePng, cleanName, cleanFree, inputClass, Field, FORM_GREEN as GREEN } from './AdminStudentForm';

const MAX_GROUPES = 20;
const MAX_GROUPE_LENGTH = 50;

// Même règle que le backend : "Éléonore" -> "eleonore", "El Amrani" -> "elamrani"
const slug = (v) =>
  v
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const shell =
  'admin-form-in bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-4 sm:p-6';

const apiMessage = (err) => {
  const status = err.response?.status;
  const data = err.response?.data;
  if (status === 413) return 'Le serveur a refusé la photo (taille). Vérifiez la limite d’upload du backend.';
  if (status === 403) return 'Action réservée à l’administrateur.';
  if (status === 404) return 'Le backend en cours ne connaît pas encore la création de professeur (404). Relancez-le avec les nouveaux fichiers.';
  return (typeof data === 'object' && data?.message) || (typeof data === 'string' && data) || 'Impossible de créer le professeur.';
};

const CopyRow = ({ icon: Icon, label, value, mono }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/70 border border-white/80 px-3.5 py-2.5">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold text-slate-500">{label}</span>
        <span className={`block text-sm font-semibold text-slate-900 truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copier ${label}`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#15885a] hover:bg-emerald-50 transition-colors cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

// Page "Ajouter un professeur" : nom, prénom, sexe, matière, PLUSIEURS groupes, photo PNG.
// Le rôle (Professeur), l'email et le mot de passe sont générés automatiquement par le backend.
export const AdminProfessorForm = ({ initialCampus, onBack }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [sexe, setSexe] = useState('');
  const [matiere, setMatiere] = useState('');

  const [groupes, setGroupes] = useState([]);
  const [groupeInput, setGroupeInput] = useState('');

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Le campus est celui choisi (image) sur le tableau de bord
  const campusId = initialCampus || CAMPUSES[0].id;
  const campus = CAMPUSES.find((c) => c.id === campusId) || CAMPUSES[0];

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ----- Groupes : un professeur peut en avoir plusieurs -----
  const addGroupes = (raw, current = groupes) => {
    const next = [...current];
    for (const part of raw.split(',')) {
      const g = part.trim().replace(/\s+/g, ' ').slice(0, MAX_GROUPE_LENGTH);
      if (!g) continue;
      if (next.length >= MAX_GROUPES) break;
      if (next.some((x) => x.toLowerCase() === g.toLowerCase())) continue;
      next.push(g);
    }
    return next;
  };

  const commitGroupe = () => {
    if (!groupeInput.trim()) return;
    setGroupes(addGroupes(groupeInput));
    setGroupeInput('');
  };

  const removeGroupe = (g) => setGroupes((list) => list.filter((x) => x !== g));

  const pickPhoto = async (file) => {
    setPhotoError('');
    if (!file) return;
    const { file: ready, error: msg } = await preparePng(file);
    if (msg) {
      setPhotoError(msg);
      return;
    }
    setPhoto(ready);
    setPreview(URL.createObjectURL(ready));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview('');
    setPhotoError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const resetForm = () => {
    setLastName('');
    setFirstName('');
    setSexe('');
    setMatiere('');
    setGroupes([]);
    setGroupeInput('');
    removePhoto();
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Un groupe tapé mais pas encore validé (Entrée / "Ajouter") est pris en compte
    const finalGroupes = addGroupes(groupeInput);

    if (!lastName.trim() || !firstName.trim()) return setError('Le nom et le prénom sont obligatoires.');
    if (!slug(lastName) || !slug(firstName)) return setError('Le nom et le prénom doivent contenir des lettres latines.');
    if (!sexe) return setError('Choisissez le sexe (Femme ou Homme).');
    if (!matiere.trim()) return setError('La matière est obligatoire.');
    if (finalGroupes.length === 0) return setError('Ajoutez au moins un groupe.');
    if (!photo) return setError('La photo PNG est obligatoire.');

    const fd = new FormData();
    fd.append('lastName', lastName.trim());
    fd.append('firstName', firstName.trim());
    fd.append('sexe', sexe);
    fd.append('campus', BACKEND_CAMPUS[campusId] || campusId);
    fd.append('matiere', matiere.trim());
    finalGroupes.forEach((g) => fd.append('groupes', g));
    fd.append('photo', photo);

    setLoading(true);
    try {
      const res = await api.post('/admin/professors', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------ Succès : identifiants générés
  if (result) {
    const created = result.user || {};
    return (
      <section className={shell}>
        <div className="max-w-xl mx-auto text-center space-y-5">
          <div className="success-pop mx-auto w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-white">
            <img src={assetUrl(result.avatarUrl)} alt="" className="w-full h-full object-cover object-top" />
          </div>
          <div className="form-in" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: GREEN }}>
              <Check className="w-3.5 h-3.5" /> Professeur créé
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {created.firstName} {created.lastName}
            </h2>
            <p className="text-xs text-slate-600">Rôle : Professeur · {created.matiere}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {(created.groupes || []).map((g, i) => (
                <span
                  key={g}
                  className="success-pop px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${GREEN}1f`, color: GREEN, animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 text-left">
            <div className="form-in" style={{ animationDelay: '0.4s' }}>
              <CopyRow icon={Mail} label="Email" value={result.email} />
            </div>
            <div className="form-in" style={{ animationDelay: '0.5s' }}>
              <CopyRow icon={KeyRound} label="Mot de passe" value={result.password} mono />
            </div>
          </div>

          <p className="form-in text-xs text-slate-600" style={{ animationDelay: '0.6s' }}>
            Notez ces identifiants maintenant : ils sont aussi enregistrés dans le dossier <code>.env/prof</code> du serveur.
          </p>

          <div className="form-in flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '0.7s' }}>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 transition cursor-pointer"
              style={{ backgroundColor: GREEN }}
            >
              <UserPlus className="w-4 h-4" /> Ajouter un autre professeur
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border bg-white/70 hover:bg-white transition cursor-pointer"
              style={{ color: GREEN, borderColor: GREEN }}
            >
              Terminer
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------------ Formulaire
  return (
    <section className={shell}>
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
        {/* Gauche : image du campus + photo du professeur */}
        <div className="flex flex-col gap-4">
          <div className="form-in relative rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] shadow-inner" style={{ animationDelay: '0.15s' }}>
            <img src={campus.image} alt={`Campus EMSI ${campus.label}`} className="campus-img absolute inset-0 w-full h-full object-cover" draggable="false" />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span className="campus-label inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                EMSI {campus.label}
              </span>
            </div>
          </div>

          <div className="form-in" style={{ animationDelay: '0.3s' }}>
            <span className="block text-xs font-semibold text-slate-600 mb-1">
              Photo du professeur (PNG) <span className="text-rose-500">*</span>
            </span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickPhoto(e.dataTransfer.files?.[0]);
              }}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
                dragging ? 'border-[#15885a] bg-emerald-50/80' : 'border-white/90 bg-white/50'
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Aperçu" className="success-pop w-28 h-28 rounded-full object-cover object-top ring-4 ring-white shadow-md" />
                  <span className="text-xs text-slate-600 truncate max-w-full">{photo?.name}</span>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm cursor-pointer"
                    aria-label="Retirer la photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
                    <ImagePlus className="w-6 h-6" />
                  </span>
                  <span className="text-xs text-slate-600">Glissez une image PNG ici (max 2 Mo)</span>
                </>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border bg-white/80 hover:bg-white transition cursor-pointer"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                {preview ? 'Changer la photo' : 'Choisir un fichier'}
              </button>
              <input ref={fileRef} type="file" accept="image/png" className="hidden" onChange={(e) => pickPhoto(e.target.files?.[0])} />
            </div>
            {photoError && <p className="mt-1.5 text-xs text-rose-600">{photoError}</p>}
          </div>
        </div>

        {/* Droite : champs */}
        <div className="min-w-0">
          <div className="form-in flex items-center gap-3 mb-5" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md" style={{ backgroundColor: GREEN }}>
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Ajouter un professeur</h2>
              <p className="text-xs text-slate-600">Les identifiants du professeur sont générés automatiquement.</p>
            </div>
          </div>

          {error && (
            <div className="error-shake mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom" required index={0}>
              <input type="text" value={lastName} onChange={(e) => setLastName(cleanName(e.target.value))} className={inputClass} placeholder="Ex. Alaoui" autoComplete="off" />
            </Field>

            <Field label="Prénom" required index={1}>
              <input type="text" value={firstName} onChange={(e) => setFirstName(cleanName(e.target.value))} className={inputClass} placeholder="Ex. Karim" autoComplete="off" />
            </Field>

            <div className="form-in sm:col-span-2" style={{ animationDelay: `${0.25 + 2 * 0.07}s` }}>
              <span className="block text-xs font-semibold text-slate-600 mb-1">
                Sexe <span className="text-rose-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sexe">
                {[
                  { id: 'FEMME', label: 'Femme', Icon: UserRound },
                  { id: 'HOMME', label: 'Homme', Icon: User },
                ].map(({ id, label, Icon }) => {
                  const active = sexe === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSexe(id)}
                      style={active ? { backgroundColor: GREEN, borderColor: GREEN } : undefined}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        active ? 'text-white shadow-md scale-[1.02]' : 'bg-white/70 border-white/80 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Matière enseignée" required index={3} className="sm:col-span-2">
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={matiere}
                  onChange={(e) => setMatiere(cleanFree(e.target.value))}
                  className={`${inputClass} pl-9`}
                  placeholder="Ex. Frameworks JEE et Architecture Micro-service"
                  autoComplete="off"
                />
              </div>
            </Field>

            {/* Plusieurs groupes */}
            <div className="form-in sm:col-span-2" style={{ animationDelay: `${0.25 + 4 * 0.07}s` }}>
              <span className="block text-xs font-semibold text-slate-600 mb-1">
                Groupes <span className="text-rose-500">*</span>
                <span className="font-normal text-slate-500"> · un professeur peut en avoir plusieurs</span>
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={groupeInput}
                    onChange={(e) => {
                      const v = cleanFree(e.target.value).slice(0, MAX_GROUPE_LENGTH + 1);
                      if (v.includes(',')) {
                        setGroupes(addGroupes(v));
                        setGroupeInput('');
                      } else {
                        setGroupeInput(v);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitGroupe();
                      } else if (e.key === 'Backspace' && !groupeInput && groupes.length) {
                        setGroupes((list) => list.slice(0, -1));
                      }
                    }}
                    className={`${inputClass} pl-9`}
                    placeholder="Ex. 5DSIO G1  (Entrée pour ajouter)"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  onClick={commitGroupe}
                  disabled={!groupeInput.trim() || groupes.length >= MAX_GROUPES}
                  className="inline-flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  style={{ backgroundColor: GREEN }}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {groupes.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2" aria-live="polite">
                  {groupes.map((g) => (
                    <span
                      key={g}
                      className="success-pop inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-sm font-semibold border"
                      style={{ backgroundColor: `${GREEN}14`, color: GREEN, borderColor: `${GREEN}55` }}
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => removeGroupe(g)}
                        aria-label={`Retirer le groupe ${g}`}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-in mt-6" style={{ animationDelay: `${0.25 + 6 * 0.07}s` }}>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              style={{ backgroundColor: GREEN }}
              className="relative overflow-hidden w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15885a] disabled:cursor-wait transition cursor-pointer"
            >
              {loading && <span className="btn-loading-sweep absolute inset-0" aria-hidden="true" />}
              {loading ? (
                <span className="relative flex items-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Création en cours
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  Créer le professeur
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AdminProfessorForm;
