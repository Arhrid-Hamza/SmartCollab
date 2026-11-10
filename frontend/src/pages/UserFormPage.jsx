import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import usersApi from '../api/users';
import {
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Camera,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const EMSI_CAMPUSES = [
  { code: 'ORANGERS', label: 'EMSI Les Orangers (Casablanca)' },
  { code: 'CFC', label: 'EMSI Casa Finance City (Casablanca)' },
  { code: 'ROUDANI', label: 'EMSI Roudani (Casablanca)' },
  { code: 'MAARIF', label: 'EMSI Maârif (Casablanca)' },
  { code: 'MOULAY_YOUSSEF', label: 'EMSI Moulay Youssef (Casablanca)' },
  { code: 'ALL', label: '🌐 Tous les campus (Supervision)' },
];

const EMSI_FILIERES = [
  { code: 'IIR', label: 'IIR — Ingénierie Informatique et Réseaux' },
  { code: 'GESI', label: 'GESI — Génie Électrique et Systèmes Intelligents' },
  { code: 'IAII', label: 'IAII — Ingénierie des Automatismes et Info. Industrielle' },
  { code: 'GI', label: 'GI — Génie Industriel' },
  { code: 'GCBTP', label: 'GCBTP — Génie Civil, Bâtiments et Travaux Publics' },
  { code: 'IFA', label: 'IFA — Ingénierie Financière et Audit' },
];

const NIVEAUX_STUDENT = [
  '1ère Année (Tronc Commun)',
  '2ème Année (Tronc Commun)',
  '3ème Année (Spécialisation)',
  '4ème Année',
  '5ème Année (PFE)',
];

const GROUPES = ['Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4', 'Groupe 5', 'Groupe 6'];

export const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);

  const initialRole = searchParams.get('role') === 'PROFESSOR' ? 'PROFESSOR' : 'STUDENT';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: initialRole,
    matricule: '',
    campus: 'ORANGERS',
    filiere: 'IIR',
    niveau: '3ème Année (Spécialisation)',
    groupe: 'Groupe 1',
    matiere: '',
    avatarUrl: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchUser = async () => {
        try {
          const user = await usersApi.getUserById(id);
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            password: '',
            role: user.role || 'STUDENT',
            matricule: user.matricule || user.studentIdentifier || '',
            campus: user.campus || 'ORANGERS',
            filiere: user.filiere || 'IIR',
            niveau: user.niveau || '3ème Année (Spécialisation)',
            groupe: user.groupe || 'Groupe 1',
            matiere: user.matiere || '',
            avatarUrl: user.avatarUrl || '',
            bio: user.bio || '',
          });
        } catch (err) {
          setError("Impossible de charger les informations de l'utilisateur.");
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const generateRandomAvatar = () => {
    const seed = `${formData.firstName || 'emsi'}-${Math.floor(Math.random() * 10000)}`;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    setFormData((prev) => ({ ...prev, avatarUrl: avatar }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation email @emsi-edu.ma
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@emsi-edu.ma')) {
      setError("L'adresse email doit obligatoirement être institutionnelle et se terminer par @emsi-edu.ma");
      return;
    }

    if (!isEditing && !formData.password) {
      setError('Le mot de passe initial est requis pour la création du compte.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await usersApi.updateUser(id, formData);
        setSuccess('Compte mis à jour avec succès !');
      } else {
        await usersApi.createUser(formData);
        setSuccess('Nouveau compte créé avec succès !');
      }

      setTimeout(() => {
        if (formData.role === 'PROFESSOR') {
          navigate('/admin/professors');
        } else {
          navigate('/admin/students');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || "Une erreur est survenue lors de l'enregistrement.";
      setError(typeof msg === 'string' ? msg : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = formData.role === 'STUDENT';
  const defaultPreview = formData.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.email || 'emsi'}`;

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all placeholder:text-slate-400';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Top Back & Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {isEditing ? 'Mode Édition' : 'Création de Compte EMSI'}
          </span>
        </div>

        {fetching ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <RefreshCw className="w-8 h-8 text-[#15885a] animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-medium">Chargement des données du compte...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Modifier le Compte Utilisateur' : 'Créer un Nouveau Compte'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Renseignez les informations institutionnelles de l'étudiant ou du professeur pour la plateforme EMSICollab.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Toggle Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Type de profil & Rôle
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'STUDENT' }))}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      isStudent
                        ? 'bg-emerald-50 border-[#15885a] text-[#15885a] shadow-sm ring-1 ring-[#15885a]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Élève Ingénieur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'PROFESSOR' }))}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      !isStudent
                        ? 'bg-emerald-50 border-[#15885a] text-[#15885a] shadow-sm ring-1 ring-[#15885a]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Professeur / Encadrant</span>
                  </button>
                </div>
              </div>

              {/* Photo de profil / Avatar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <img
                    src={defaultPreview}
                    alt="Aperçu Avatar"
                    className="w-20 h-20 rounded-2xl bg-white border-2 border-white shadow-md object-cover"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=fallback`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Photo de Profil (URL de l'image)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={generateRandomAvatar}
                      title="Générer un avatar automatique"
                      className="shrink-0 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-[#15885a]" />
                      <span className="hidden sm:inline">Aléatoire</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Laissez vide pour utiliser l'avatar généré par défaut ou cliquez sur "Aléatoire".
                  </span>
                </div>
              </div>

              {/* Identity & Matricule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ex: Yassine"
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
                    placeholder="Ex: Bennani"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matricule / Identifiant</label>
                  <input
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleChange}
                    placeholder={isStudent ? 'Ex: STU-EMSI-0042' : 'Ex: PROF-EMSI-12'}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Institutionnel (@emsi-edu.ma) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="prenom.nom@emsi-edu.ma"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isEditing ? 'Nouveau Mot de Passe (Optionnel)' : 'Mot de Passe Initial *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isEditing ? 'Laisser vide pour ne pas changer' : '••••••••'}
                      className={`${inputClass} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Campus & Filière EMSI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus EMSI (Casablanca) *</label>
                  <select name="campus" value={formData.campus} onChange={handleChange} className={inputClass}>
                    {EMSI_CAMPUSES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Filière d'ingénierie EMSI *</label>
                  <select name="filiere" value={formData.filiere} onChange={handleChange} className={inputClass}>
                    {EMSI_FILIERES.map((f) => (
                      <option key={f.code} value={f.code}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Fields: Student vs Professor */}
              {isStudent ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Niveau d'études de l'étudiant
                    </label>
                    <select name="niveau" value={formData.niveau} onChange={handleChange} className={inputClass}>
                      {NIVEAUX_STUDENT.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">Groupe TD/TP</label>
                    <select name="groupe" value={formData.groupe} onChange={handleChange} className={inputClass}>
                      {GROUPES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">
                      Matière(s) & Modules enseignés
                    </label>
                    <input
                      type="text"
                      name="matiere"
                      value={formData.matiere}
                      onChange={handleChange}
                      placeholder="Ex: Spring Boot, Architecture Cloud, DevOps"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">
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

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biographie / Remarques</label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Présentation rapide, compétences clés ou centres d'intérêt..."
                  className={inputClass}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#15885a] hover:bg-[#0f7048] text-white text-sm font-semibold shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'Enregistrer les modifications' : 'Créer le compte'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserFormPage;
