import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Building2,
  Award,
  Layers,
  Users,
  BookOpen,
  UploadCloud,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import usersApi from '../api/users';

const CASABLANCA_CAMPUSES = [
  { code: 'ORANGERS', label: 'EMSI Les Orangers' },
  { code: 'CFC', label: 'EMSI Casa Finance City' },
  { code: 'ROUDANI', label: 'EMSI Roudani' },
  { code: 'MAARIF', label: 'EMSI Maârif' },
  { code: 'MOULAY_YOUSSEF', label: 'EMSI Moulay Youssef' },
  { code: 'ALL', label: 'Tous les campus (Supervision)' },
];

const EMSI_FILIERES = [
  { code: 'IIR', label: 'IIR - Ingénierie Informatique et Réseaux' },
  { code: 'GESI', label: 'GESI - Génie Électrique et Systèmes Intelligents' },
  { code: 'IAII', label: 'IAII - Ingénierie des Automatismes et Info. Industrielle' },
  { code: 'GI', label: 'GI - Génie Industriel' },
  { code: 'GCBTP', label: 'GCBTP - Génie Civil, Bâtiments et Travaux Publics' },
  { code: 'IFA', label: 'IFA - Ingénierie Financière et Audit' },
];

const NIVEAUX_STUDENT = [
  '1ère Année (Tronc Commun)',
  '2ème Année (Tronc Commun)',
  '3ème Année (Spécialisation)',
  '4ème Année',
  '5ème Année (PFE)',
];

const GROUPES = ['Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4', 'Groupe 5', 'Groupe 6'];

export const UserEditModal = ({ user, onClose, onUserUpdated }) => {
  if (!user) return null;

  const fileInputRef = useRef(null);
  const isStudent = user.role === 'STUDENT';
  const isProf = user.role === 'PROFESSOR';

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    password: '',
    role: user.role, // Non modifiable
    sexe: user.sexe || 'HOMME',
    matricule: user.matricule || user.studentIdentifier || '',
    campus: user.campus || 'ORANGERS',
    filiere: user.filiere || 'IIR',
    niveau: user.niveau || (isStudent ? '3ème Année (Spécialisation)' : '4ème & 5ème Année'),
    groupe: user.groupe || 'Groupe 1',
    matiere: user.matiere || '',
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image est trop volumineuse (maximum 5 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@emsi-edu.ma')) {
      setError("L'adresse email doit obligatoirement se terminer par @emsi-edu.ma");
      return;
    }

    setLoading(true);
    try {
      // Ensure role is preserved from original user (cannot be edited)
      const payload = {
        ...formData,
        role: user.role,
      };

      const updated = await usersApi.updateUser(user.id, payload);
      setSuccess('Modifications enregistrées avec succès.');
      if (onUserUpdated) {
        onUserUpdated(updated);
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Erreur lors de la mise à jour des informations.";
      setError(typeof msg === 'string' ? msg : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all placeholder:text-slate-400';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#15885a] to-[#0e5f3e] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold leading-tight">
                  Modifier les informations
                </h3>
                {/* Role is FIXED & READ-ONLY */}
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {isStudent ? 'Élève Ingénieur' : isProf ? 'Professeur' : 'Administrateur'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {user.firstName} {user.lastName} ({user.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs font-medium">
              <Check className="w-4 h-4 shrink-0 text-[#15885a] mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Role Status Note (Role non modifiable) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#15885a]" />
              <span className="font-semibold">Rôle du compte :</span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-[#15885a] text-white text-[11px]">
                {user.role}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Le rôle est fixé à la création et ne peut être modifié
            </span>
          </div>

          {/* Photo de profil - Téléchargement & Aperçu Instagram */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
            <UserAvatar
              user={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                avatarUrl: formData.avatarUrl,
              }}
              size="lg"
              showStoryRing={true}
            />
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-slate-800">Photo de profil</p>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG ou WebP. L'avatar style Instagram est appliqué par défaut.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#15885a]" />
                  <span>{formData.avatarUrl ? 'Changer' : 'Télécharger'}</span>
                </button>

                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Retirer</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Identité, Sexe & Matricule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Civilité / Sexe *</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="HOMME">Homme</option>
                <option value="FEMME">Femme</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Matricule</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Ex: STU-2026-001"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          {/* Email & Mot de Passe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Institutionnel (@emsi-edu.ma) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nouveau mot de passe (optionnel)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Laisser vide pour ne pas modifier"
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Campus & Filière */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus EMSI Casablanca *
              </label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className={inputClass}
              >
                {CASABLANCA_CAMPUSES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Filière d'ingénierie EMSI *
              </label>
              <select
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
                className={inputClass}
              >
                {EMSI_FILIERES.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champs Spécifiques Rôle */}
          {isStudent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  Niveau d'études de l'étudiant
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {NIVEAUX_STUDENT.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  Groupe TD/TP
                </label>
                <select
                  name="groupe"
                  value={formData.groupe}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {GROUPES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  Matière(s) &amp; Modules enseignés
                </label>
                <input
                  type="text"
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleChange}
                  placeholder="Ex: Spring Boot, Architecture Cloud"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  Niveaux d'intervention
                </label>
                <input
                  type="text"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  placeholder="Ex: 4ème & 5ème Année"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Biographie */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Biographique / Remarques
            </label>
            <textarea
              rows={2}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Présentation, compétences clés ou centres d'intérêt..."
              className={inputClass}
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#15885a] hover:bg-[#0f7048] text-white text-xs font-semibold shadow-md shadow-emerald-900/10 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
