import React, { useEffect, useRef, useState } from 'react';
import {
  UserPlus,
  MapPin,
  ChevronDown,
  ImagePlus,
  Mail,
  Hash,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  User,
  UserRound,
  Users,
  Plus,
  X,
} from 'lucide-react';
import api, { assetUrl } from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';

const GREEN = '#15885a';
const MAX_PHOTO = 2 * 1024 * 1024; // 2 Mo
const NIVEAUX = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année'];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// Saisie filtrée : on retire à la frappe tout caractère non autorisé
const cleanName = (v) => v.replace(/[^\p{L} '\-]/gu, '').slice(0, 50);
const cleanFree = (v) => v.replace(/[^\p{L}\p{N} .,'/()&+\-_·]/gu, '').slice(0, 100);

// Même règle que le backend : "Éléonore" -> "eleonore", "El Amrani" -> "elamrani"
const slug = (v) =>
  v
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white/70 border border-white/80 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] transition-colors';

// Champ avec libellé + animation d'entrée décalée
const Field = ({ label, required, index, className = '', children }) => (
  <label className={`form-in block ${className}`} style={{ animationDelay: `${0.25 + index * 0.07}s` }}>
    <span className="block text-xs font-semibold text-slate-600 mb-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
    {children}
  </label>
);

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
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0"
        style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}
      >
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
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#15885a] hover:bg-emerald-50 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const MAX_ROWS = 30;

const MAX_SIDE = 800; // une photo d'identité n'a pas besoin de plus
const RESIZE_ABOVE = 500 * 1024; // au-delà de 500 Ko on réduit la photo avant l'envoi

const formatMo = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;

// Réduit la photo (côté le plus long <= 800 px) et la ré-encode en PNG : même format, bien plus léger
const downscalePng = async (file) => {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size <= RESIZE_ABOVE) return file;
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    return blob && blob.size < file.size ? new File([blob], file.name, { type: 'image/png' }) : file;
  } finally {
    URL.revokeObjectURL(url);
  }
};

// Vérifie un fichier PNG (type, signature, taille) et le réduit si besoin : renvoie { file } ou { error }
const preparePng = async (file) => {
  if (!file) return { error: 'Aucun fichier.' };
  if (file.type !== 'image/png' || !/\.png$/i.test(file.name)) return { error: 'La photo doit être au format PNG.' };
  try {
    const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    if (!PNG_MAGIC.every((b, i) => head[i] === b)) return { error: 'Ce fichier n’est pas un vrai PNG.' };
  } catch {
    return { error: 'Impossible de lire la photo.' };
  }
  let ready = file;
  try {
    ready = await downscalePng(file);
  } catch {
    // image illisible par le navigateur : on garde l'original, le serveur la validera
  }
  if (ready.size > MAX_PHOTO) return { error: `La photo fait ${formatMo(ready.size)} : maximum 2 Mo.` };
  return { file: ready };
};

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

const apiMessage = (err) => {
  const status = err.response?.status;
  const data = err.response?.data;
  if (status === 413) return 'Le serveur a refusé la photo (taille). Vérifiez la limite d’upload du backend.';
  if (status === 403) return 'Action réservée à l’administrateur.';
  return (typeof data === 'object' && data?.message) || (typeof data === 'string' && data) || 'Impossible de créer l’étudiant.';
};

// Une ligne du mode "plusieurs étudiants" : photo + nom + prénom
const StudentRow = ({ index, row, onChange, onRemove, canRemove }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState('');
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    if (!row.photo) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(row.photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [row.photo]);

  const pick = async (file) => {
    const { file: ready, error } = await preparePng(file);
    if (error) {
      setPhotoError(error);
      return;
    }
    setPhotoError('');
    onChange({ photo: ready });
  };

  return (
    <div className="form-in rounded-2xl bg-white/50 border border-white/80 p-3" style={{ animationDelay: '0s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: GREEN }}
          >
            {index + 1}
          </span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label={`Choisir la photo de l’étudiant ${index + 1}`}
            title="Photo PNG (max 2 Mo)"
            className="relative inline-flex items-center justify-center w-14 h-14 rounded-full overflow-hidden border-2 border-dashed border-white/90 bg-white/70 hover:bg-white transition shrink-0"
            style={{ color: GREEN }}
          >
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5" />}
          </button>
          <input ref={fileRef} type="file" accept="image/png" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
          <input
            type="text"
            value={row.lastName}
            onChange={(e) => onChange({ lastName: cleanName(e.target.value) })}
            className={inputClass}
            placeholder="Nom"
            aria-label={`Nom de l’étudiant ${index + 1}`}
            autoComplete="off"
          />
          <input
            type="text"
            value={row.firstName}
            onChange={(e) => onChange({ firstName: cleanName(e.target.value) })}
            className={inputClass}
            placeholder="Prénom"
            aria-label={`Prénom de l’étudiant ${index + 1}`}
            autoComplete="off"
          />
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Retirer l’étudiant ${index + 1}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-rose-600 hover:bg-white transition shrink-0 self-end sm:self-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {photoError && <p className="mt-1.5 text-xs text-rose-600">{photoError}</p>}
    </div>
  );
};

export const AdminStudentForm = ({ initialCampus, onBack }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [sexe, setSexe] = useState('');
  // Le campus est celui choisi (image) sur le tableau de bord : pas de choix dans le formulaire
  const campusId = initialCampus || CAMPUSES[0].id;
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [groupe, setGroupe] = useState('');

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Mode "plusieurs étudiants" : infos communes (sexe, filière, niveau, groupe) + une ligne par étudiant
  const [mode, setMode] = useState('single');
  const rowId = useRef(0);
  const newRow = () => ({ id: ++rowId.current, lastName: '', firstName: '', photo: null });
  const [rows, setRows] = useState(() => [{ id: ++rowId.current, lastName: '', firstName: '', photo: null }]);
  const [bulkResult, setBulkResult] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [copiedAll, setCopiedAll] = useState(false);

  const updateRow = (id, patch) => setRows((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((list) => (list.length >= MAX_ROWS ? list : [...list, newRow()]));
  const removeRow = (id) => setRows((list) => (list.length > 1 ? list.filter((r) => r.id !== id) : list));

  const campus = CAMPUSES.find((c) => c.id === campusId) || CAMPUSES[0];

  // Libère l'URL d'aperçu quand elle change / au démontage
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickPhoto = async (file) => {
    setPhotoError('');
    if (!file) return;
    const { file: ready, error } = await preparePng(file);
    if (error) {
      setPhotoError(error);
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
    setFiliere('');
    setNiveau('');
    setGroupe('');
    removePhoto();
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!lastName.trim() || !firstName.trim()) return setError('Le nom et le prénom sont obligatoires.');
    if (!slug(lastName) || !slug(firstName)) return setError('Le nom et le prénom doivent contenir des lettres latines.');
    if (!sexe) return setError('Choisissez le sexe (Femme ou Homme).');
    if (!filiere.trim()) return setError('La filière est obligatoire.');
    if (!niveau) return setError('Choisissez le niveau.');
    if (!groupe.trim()) return setError('Le groupe est obligatoire.');
    if (!photo) return setError('La photo PNG est obligatoire.');

    const fd = new FormData();
    fd.append('lastName', lastName.trim());
    fd.append('firstName', firstName.trim());
    fd.append('sexe', sexe);
    fd.append('campus', BACKEND_CAMPUS[campusId] || campusId);
    fd.append('filiere', filiere.trim());
    fd.append('niveau', niveau);
    fd.append('groupe', groupe.trim());
    fd.append('photo', photo);

    setLoading(true);
    try {
      const res = await api.post('/admin/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 413) setError('Le serveur a refusé la photo (taille). Vérifiez la limite d’upload du backend.');
      else if (status === 403) setError('Action réservée à l’administrateur.');
      else setError((typeof data === 'object' && data?.message) || (typeof data === 'string' && data) || 'Impossible de créer l’étudiant.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sexe) return setError('Choisissez le sexe (Femme ou Homme).');
    if (!filiere.trim()) return setError('La filière est obligatoire.');
    if (!niveau) return setError('Choisissez le niveau.');
    if (!groupe.trim()) return setError('Le groupe est obligatoire.');
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const n = `Étudiant n°${i + 1} : `;
      if (!r.lastName.trim() || !r.firstName.trim()) return setError(`${n}le nom et le prénom sont obligatoires.`);
      if (!slug(r.lastName) || !slug(r.firstName)) return setError(`${n}le nom et le prénom doivent contenir des lettres latines.`);
      if (!r.photo) return setError(`${n}la photo PNG est obligatoire.`);
    }

    setLoading(true);
    setProgress({ done: 0, total: rows.length });
    const created = [];
    const failed = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const fd = new FormData();
      fd.append('lastName', r.lastName.trim());
      fd.append('firstName', r.firstName.trim());
      fd.append('sexe', sexe);
      fd.append('campus', BACKEND_CAMPUS[campusId] || campusId);
      fd.append('filiere', filiere.trim());
      fd.append('niveau', niveau);
      fd.append('groupe', groupe.trim());
      fd.append('photo', r.photo);
      try {
        const res = await api.post('/admin/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        created.push({ row: r, data: res.data });
      } catch (err) {
        const message = apiMessage(err);
        failed.push({ row: r, message });
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          // Inutile de continuer : toutes les requêtes suivantes échoueraient aussi
          rows.slice(i + 1).forEach((rest) => failed.push({ row: rest, message }));
          break;
        }
      }
      setProgress({ done: i + 1, total: rows.length });
    }
    setLoading(false);
    setBulkResult({ created, failed });
  };

  const resetBulk = () => {
    // On garde les infos communes (même groupe) : on repart avec une ligne vide
    setRows([newRow()]);
    setBulkResult(null);
    setError('');
  };

  const fixFailed = () => {
    setRows(bulkResult.failed.map((f) => f.row));
    setBulkResult(null);
    setError('');
  };

  const copyAll = async () => {
    const text = bulkResult.created
      .map(({ data }) => [`${data.user?.lastName} ${data.user?.firstName}`, data.email, data.password, data.matricule].join('\t'))
      .join('\n');
    await copyText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const shell =
    'admin-form-in bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-4 sm:p-6';

  // Champs communs (sexe, filière, niveau, groupe) : utilisés par le mode simple ET le mode "plusieurs étudiants"
  const commonFields = (
    <>
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
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
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

            <Field label="Filière" required index={4} className="sm:col-span-2">
              <input
                type="text"
                value={filiere}
                onChange={(e) => setFiliere(cleanFree(e.target.value))}
                className={inputClass}
                placeholder="Ex. Ingénierie Informatique et Réseaux"
                autoComplete="off"
              />
            </Field>

            <Field label="Niveau" required index={5}>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  className={`${inputClass} appearance-none pl-9 pr-10 cursor-pointer`}
                >
                  <option value="" disabled>
                    Choisir le niveau…
                  </option>
                  {NIVEAUX.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </Field>

            <Field label="Groupe" required index={6}>
              <input
                type="text"
                value={groupe}
                onChange={(e) => setGroupe(cleanFree(e.target.value))}
                className={inputClass}
                placeholder="Ex. 5DSIO G2"
                autoComplete="off"
              />
            </Field>
    </>
  );

  // ------------------------------------------------------------------ Succès : identifiants générés
  if (result) {
    return (
      <section className={shell}>
        <div className="max-w-xl mx-auto text-center space-y-5">
          <div className="success-pop mx-auto w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-white">
            <img src={assetUrl(result.avatarUrl)} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="form-in" style={{ animationDelay: '0.2s' }}>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Check className="w-3.5 h-3.5" /> Étudiant créé
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {result.user?.firstName} {result.user?.lastName}
            </h2>
            <p className="text-xs text-slate-600">Rôle : Étudiant</p>
          </div>

          <div className="space-y-2.5 text-left">
            <div className="form-in" style={{ animationDelay: '0.3s' }}>
              <CopyRow icon={Hash} label="Matricule" value={result.matricule} mono />
            </div>
            <div className="form-in" style={{ animationDelay: '0.4s' }}>
              <CopyRow icon={Mail} label="Email" value={result.email} />
            </div>
            <div className="form-in" style={{ animationDelay: '0.5s' }}>
              <CopyRow icon={KeyRound} label="Mot de passe" value={result.password} mono />
            </div>
          </div>

          <p className="form-in text-xs text-slate-600" style={{ animationDelay: '0.6s' }}>
            Notez ces identifiants maintenant : ils sont aussi enregistrés dans le dossier <code>.env</code> du serveur
            (fichier <code>{result.matricule}.env</code>).
          </p>

          <div className="form-in flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '0.7s' }}>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 transition"
              style={{ backgroundColor: GREEN }}
            >
              <UserPlus className="w-4 h-4" /> Ajouter un autre étudiant
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border bg-white/70 hover:bg-white transition"
              style={{ color: GREEN, borderColor: GREEN }}
            >
              Terminer
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------------ Plusieurs étudiants : résultat
  if (bulkResult) {
    const { created, failed } = bulkResult;
    return (
      <section className={shell}>
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="text-center form-in" style={{ animationDelay: '0.05s' }}>
            <span
              className="success-pop inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Check className="w-3.5 h-3.5" /> {created.length} étudiant{created.length > 1 ? 's' : ''} créé{created.length > 1 ? 's' : ''}
            </span>
            {failed.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                <AlertCircle className="w-3.5 h-3.5" /> {failed.length} échec{failed.length > 1 ? 's' : ''}
              </span>
            )}
            <p className="mt-2 text-xs text-slate-600">
              Notez ces identifiants maintenant : ils sont aussi enregistrés dans le dossier <code>.env</code> du serveur.
            </p>
          </div>

          {failed.length > 0 && (
            <div className="form-in p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm space-y-1" style={{ animationDelay: '0.1s' }}>
              {failed.map(({ row, message }) => (
                <p key={row.id}>
                  <strong>
                    {row.firstName} {row.lastName}
                  </strong>{' '}
                  : {message}
                </p>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {created.map(({ data }, i) => (
              <div
                key={data.matricule}
                className="form-in rounded-2xl bg-white/50 border border-white/80 p-3"
                style={{ animationDelay: `${0.12 + i * 0.06}s` }}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <img src={assetUrl(data.avatarUrl)} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow" />
                  <span className="font-bold text-slate-900 truncate">
                    {data.user?.firstName} {data.user?.lastName}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <CopyRow icon={Mail} label="Email" value={data.email} />
                  <CopyRow icon={KeyRound} label="Mot de passe" value={data.password} mono />
                  <CopyRow icon={Hash} label="Matricule" value={data.matricule} mono />
                </div>
              </div>
            ))}
          </div>

          <div className="form-in flex flex-col sm:flex-row flex-wrap gap-3 justify-center" style={{ animationDelay: '0.3s' }}>
            {created.length > 0 && (
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border bg-white/70 hover:bg-white transition"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAll ? 'Copié !' : 'Copier tout'}
              </button>
            )}
            {failed.length > 0 && (
              <button
                type="button"
                onClick={fixFailed}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 transition bg-rose-500"
              >
                Corriger les échecs
              </button>
            )}
            <button
              type="button"
              onClick={resetBulk}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 transition"
              style={{ backgroundColor: GREEN }}
            >
              <UserPlus className="w-4 h-4" /> Ajouter d’autres étudiants
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border bg-white/70 hover:bg-white transition"
              style={{ color: GREEN, borderColor: GREEN }}
            >
              Terminer
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------------ Plusieurs étudiants : formulaire
  if (mode === 'bulk') {
    return (
      <section className={shell}>
        <form onSubmit={handleBulkSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
          <div className="flex flex-col gap-4">
            <div className="form-in relative rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] shadow-inner" style={{ animationDelay: '0.15s' }}>
              <img
                key={campus.id}
                src={campus.image}
                alt={`Campus EMSI ${campus.label}`}
                className="campus-img absolute inset-0 w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <span key={campus.id} className="campus-label inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                  <MapPin className="w-4 h-4" />
                  EMSI {campus.label}
                </span>
              </div>
            </div>
            <div className="form-in rounded-xl bg-white/50 border border-white/80 p-4 text-xs text-slate-600 space-y-1.5" style={{ animationDelay: '0.3s' }}>
              <p className="font-semibold text-slate-700">Comment ça marche</p>
              <p>1. Renseignez une seule fois le sexe, la filière, le niveau et le groupe.</p>
              <p>2. Ajoutez chaque étudiant (photo, nom, prénom) avec le bouton « + ».</p>
              <p>3. Un seul clic crée tous les comptes.</p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="form-in flex items-center gap-3 mb-5" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md" style={{ backgroundColor: GREEN }}>
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Ajouter plusieurs étudiants</h2>
                <p className="text-xs text-slate-600">Les identifiants de chaque étudiant sont générés automatiquement.</p>
              </div>
            </div>

            {error && (
              <div className="error-shake mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-2xl bg-white/40 border border-white/70 p-4 mb-5">
              <p className="text-sm font-bold text-slate-800 mb-3">1. Informations communes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{commonFields}</div>
            </div>

            <p className="text-sm font-bold text-slate-800 mb-3">
              2. Étudiants <span className="text-slate-500 font-semibold">({rows.length})</span>
            </p>
            <div className="space-y-3">
              {rows.map((row, i) => (
                <StudentRow
                  key={row.id}
                  index={i}
                  row={row}
                  canRemove={rows.length > 1}
                  onChange={(patch) => updateRow(row.id, patch)}
                  onRemove={() => removeRow(row.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= MAX_ROWS}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-dashed border-white/90 bg-white/40 hover:bg-white/70 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: GREEN }}
            >
              <Plus className="w-4 h-4" />
              {rows.length >= MAX_ROWS ? `Maximum ${MAX_ROWS} étudiants` : 'Ajouter un étudiant'}
            </button>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                style={{ backgroundColor: GREEN }}
                className="relative overflow-hidden w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15885a] disabled:cursor-wait transition"
              >
                {loading && <span className="btn-loading-sweep absolute inset-0" aria-hidden="true" />}
                {loading ? (
                  <span className="relative flex items-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Création {progress.done}/{progress.total}
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    Créer {rows.length} étudiant{rows.length > 1 ? 's' : ''}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setError('');
                  setMode('single');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline disabled:opacity-50"
                style={{ color: GREEN }}
              >
                <User className="w-4 h-4" />
                Un seul étudiant
              </button>
            </div>
          </div>
        </form>
      </section>
    );
  }

  // ------------------------------------------------------------------ Formulaire
  return (
    <section className={shell}>
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
        {/* Gauche : image du campus + photo de l'étudiant */}
        <div className="flex flex-col gap-4">
          <div className="form-in relative rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] shadow-inner" style={{ animationDelay: '0.15s' }}>
            <img
              key={campus.id}
              src={campus.image}
              alt={`Campus EMSI ${campus.label}`}
              className="campus-img absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span key={campus.id} className="campus-label inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                EMSI {campus.label}
              </span>
            </div>
          </div>

          <div className="form-in" style={{ animationDelay: '0.3s' }}>
            <span className="block text-xs font-semibold text-slate-600 mb-1">
              Photo de l’étudiant (PNG) <span className="text-rose-500">*</span>
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
                  <img src={preview} alt="Aperçu" className="success-pop w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md" />
                  <span className="text-xs text-slate-600 truncate max-w-full">{photo?.name}</span>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm"
                    aria-label="Retirer la photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}
                  >
                    <ImagePlus className="w-6 h-6" />
                  </span>
                  <span className="text-xs text-slate-600">Glissez une image PNG ici (max 2 Mo)</span>
                </>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border bg-white/80 hover:bg-white transition"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                {preview ? 'Changer la photo' : 'Choisir un fichier'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => pickPhoto(e.target.files?.[0])}
              />
            </div>
            {photoError && <p className="mt-1.5 text-xs text-rose-600">{photoError}</p>}
          </div>
        </div>

        {/* Droite : champs */}
        <div className="min-w-0">
          <div className="form-in flex items-center gap-3 mb-5" style={{ animationDelay: '0.1s' }}>
            <span
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md"
              style={{ backgroundColor: GREEN }}
            >
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Ajouter un étudiant</h2>
              <p className="text-xs text-slate-600">Les identifiants de l’étudiant sont générés automatiquement.</p>
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
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(cleanName(e.target.value))}
                className={inputClass}
                placeholder="Ex. Bouffa"
                autoComplete="off"
              />
            </Field>

            <Field label="Prénom" required index={1}>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(cleanName(e.target.value))}
                className={inputClass}
                placeholder="Ex. Issam"
                autoComplete="off"
              />
            </Field>

            {commonFields}
          </div>

          <div className="form-in mt-6 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ animationDelay: `${0.25 + 7 * 0.07}s` }}>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              style={{ backgroundColor: GREEN }}
              className="relative overflow-hidden w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15885a] disabled:cursor-wait transition"
            >
              {loading && <span className="btn-loading-sweep absolute inset-0" aria-hidden="true" />}
              {loading ? (
                <span className="relative flex items-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Création en cours
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  Créer l’étudiant
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setError('');
                setMode('bulk');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline disabled:opacity-50"
              style={{ color: GREEN }}
            >
              <Users className="w-4 h-4" />
              Plusieurs étudiants
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AdminStudentForm;

// Utilitaires partagés avec la page de modification d'un étudiant
export { preparePng, cleanName, cleanFree, NIVEAUX, inputClass, Field, GREEN as FORM_GREEN };
