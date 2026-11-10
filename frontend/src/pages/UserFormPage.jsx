import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { UserAvatar } from '../components/UserAvatar';
import usersApi from '../api/users';
import {
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Trash2,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck
} from 'lucide-react';

const EMSI_CAMPUSES = [
  { code: 'ORANGERS', label: 'EMSI Les Orangers (Casablanca)' },
  { code: 'CFC', label: 'EMSI Casa Finance City (Casablanca)' },
  { code: 'ROUDANI', label: 'EMSI Roudani (Casablanca)' },
  { code: 'MAARIF', label: 'EMSI Maârif (Casablanca)' },
  { code: 'MOULAY_YOUSSEF', label: 'EMSI Moulay Youssef (Casablanca)' },
  { code: 'ALL', label: 'Tous les campus (Supervision Globale)' },
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

export const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(id);

  const initialRole = searchParams.get('role') === 'PROFESSOR' ? 'PROFESSOR' : 'STUDENT';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: initialRole,
    sexe: 'HOMME',
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
            sexe: user.sexe || 'HOMME',
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
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@emsi-edu.ma')) {
      setError("L'adresse email doit obligatoirement être une adresse institutionnelle se terminant par @emsi-edu.ma");
      return;
    }

    if (!isEditing && !formData.password) {
      setError('Le mot de passe initial est requis.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await usersApi.updateUser(id, formData);
        setSuccess('Compte mis à jour avec succès.');
      } else {
        await usersApi.createUser(formData);
        setSuccess('Nouveau compte créé avec succès.');
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
      const msg = err.response?.data?.message || err.response?.data || "Erreur lors de l'enregistrement.";
      setError(typeof msg === 'string' ? msg : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = formData.role === 'STUDENT';
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
                Renseignez les informations institutionnelles du membre pour la plateforme EMSICollab.
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
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Profil & Rôle
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
                    <span>Professeur</span>
                  </button>
                </div>
              </div>

              {/* Photo de profil - Téléchargement de fichier avec aperçu style Instagram */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <UserAvatar
                    user={{
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      email: formData.email,
                      avatarUrl: formData.avatarUrl,
                    }}
                    size="xl"
                    showStoryRing={true}
                  />
                  <span className="text-[11px] font-medium text-slate-500">Aperçu Profil</span>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Photo de profil</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Téléchargez une photo depuis votre appareil (PNG, JPG, WebP jusqu'à 5 Mo). Si aucune photo n'est fournie, un avatar style profil sera généré automatiquement.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <UploadCloud className="w-4 h-4 text-[#15885a]" />
                      <span>{formData.avatarUrl ? 'Changer la photo' : 'Importer une photo'}</span>
                    </button>

                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer la photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Identité, Sexe & Matricule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sexe / Civilité *</label>
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
                      placeholder="nom.prenom@emsi-edu.ma"
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
                      placeholder={isEditing ? 'Laisser vide pour ne pas modifier' : 'Minimum 4 caractères'}
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

              {/* Campus & Filière */}
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

              {/* Conditional Fields */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
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
                  placeholder="Présentation, compétences clés ou centres d'intérêt..."
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
                      <span>Enregistrement...</span>
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
