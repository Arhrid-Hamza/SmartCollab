import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EmsiBar } from '../components/EmsiBar';
import loginBg from '../assets/login-bg.jpg';
import {
  GraduationCap,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

// Thème par rôle (classes littérales pour que Tailwind les détecte)
const ROLE_THEME = {
  STUDENT: {
    icon: GraduationCap,
    iconBox: 'bg-indigo-600 shadow-indigo-200',
    glow: 'rgba(79, 70, 229, 0.45)',
    button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-200',
    input: 'focus:ring-indigo-500 focus:border-indigo-500',
    link: 'text-indigo-600',
    demoActive: 'border-indigo-500 bg-indigo-50/60',
  },
  PROFESSOR: {
    icon: BookOpen,
    iconBox: 'bg-emerald-600 shadow-emerald-200',
    glow: 'rgba(5, 150, 105, 0.45)',
    button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-200',
    input: 'focus:ring-emerald-500 focus:border-emerald-500',
    link: 'text-emerald-600',
    demoActive: 'border-emerald-500 bg-emerald-50/60',
  },
  ADMIN: {
    icon: ShieldCheck,
    iconBox: 'bg-purple-600 shadow-purple-200',
    glow: 'rgba(147, 51, 234, 0.45)',
    button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 shadow-purple-200',
    input: 'focus:ring-purple-500 focus:border-purple-500',
    link: 'text-purple-600',
    demoActive: 'border-purple-500 bg-purple-50/60',
  },
};

const demoAccounts = [
  {
    role: 'STUDENT',
    label: 'Étudiant Démo',
    email: 'student@smartcollab.edu',
    password: 'Student123!',
    color: 'hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-700',
  },
  {
    role: 'PROFESSOR',
    label: 'Professeur Démo',
    email: 'prof@smartcollab.edu',
    password: 'Prof123!',
    color: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700',
  },
  {
    role: 'ADMIN',
    label: 'Administrateur',
    email: 'admin@smartcollab.edu',
    password: 'Admin123!',
    color: 'hover:border-purple-500 hover:bg-purple-50/50 text-purple-700',
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('STUDENT'); // pilote aussi l'icône du haut
  const [studentId, setStudentId] = useState('');

  const theme = ROLE_THEME[role];
  const HeaderIcon = theme.icon;

  const inputBase =
    'w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white/80 border border-slate-200/80 rounded-lg focus:bg-white/90 focus:ring-2 outline-none transition-colors ' +
    theme.input;

  const handleFillDemo = (acc) => {
    setRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const flipTo = (register) => {
    setError('');
    setIsRegister(register);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email,
          password,
          firstName,
          lastName,
          role,
          studentIdentifier: role === 'STUDENT' ? studentId : null,
        });
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || 'Identifiants invalides ou service indisponible';
      setError(typeof msg === 'string' ? msg : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const ErrorBox = () =>
    error ? (
      <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
        <span>{error}</span>
      </div>
    ) : null;

  const passwordField = (
    <div>
      <label className="block text-xs font-semibold text-slate-800 mb-1">Mot de Passe</label>
      <div className="relative">
        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputBase} pl-9 pr-10`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const emailField = (
    <div>
      <label className="block text-xs font-semibold text-slate-800 mb-1">Adresse Email</label>
      <div className="relative">
        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputBase} pl-9 pr-3`}
          placeholder="nom@emsi-edu.ma"
        />
      </div>
    </div>
  );

  const submitButton = (label) => (
    <button
      type="submit"
      disabled={loading}
      className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md transition-all disabled:opacity-50 ${theme.button}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );

  const cardClasses =
    'bg-white/75 backdrop-blur-xl backdrop-saturate-150 py-8 px-6 shadow-2xl shadow-slate-900/20 sm:rounded-2xl sm:px-10 border border-white/60 ring-1 ring-white/30';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <EmsiBar />
      <div
        style={{ backgroundImage: `url(${loginBg})` }}
        className="flex-1 flex flex-col justify-center py-8 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Icône de rôle animée */}
        <div
          key={role}
          style={{ '--glow': theme.glow }}
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-xl mb-4 transition-colors duration-500 animate-role-pop animate-role-glow ${theme.iconBox}`}
        >
          <HeaderIcon className="w-9 h-9" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-[0_1px_8px_rgba(255,255,255,0.8)]">EMSICollab</h2>
        <p className="mt-2 text-sm font-medium text-slate-800 drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
          Plateforme Intelligente de Matching PFE & Compétences
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flip-scene">
        <div className={`flip-inner ${isRegister ? 'is-flipped' : ''}`}>
          {/* ---------- FACE AVANT : connexion ---------- */}
          <div className={`flip-face ${isRegister ? 'flip-hidden' : ''}`} aria-hidden={isRegister}>
            <div className={`${cardClasses} h-full`}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Connexion Rapide (Comptes Démo)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map((acc) => {
                    const Icon = ROLE_THEME[acc.role].icon;
                    const active = acc.email === email && role === acc.role;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleFillDemo(acc)}
                        className={`flex flex-col items-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          active ? ROLE_THEME[acc.role].demoActive : 'border-slate-200/80 bg-white/60'
                        } ${acc.color}`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="truncate w-full text-center">{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-slate-500/30" />
                <span className="text-xs uppercase text-slate-600 font-medium">Ou avec vos identifiants</span>
                <div className="flex-1 border-t border-slate-500/30" />
              </div>

              {!isRegister && <ErrorBox />}

              <form onSubmit={handleSubmit} className="space-y-4">
                {emailField}
                {passwordField}
                {submitButton('Se connecter')}
              </form>

              <div className="mt-6 text-center text-xs text-slate-700">
                <p>
                  Nouveau sur EMSICollab ?{' '}
                  <button
                    type="button"
                    onClick={() => flipTo(true)}
                    className={`font-semibold hover:underline ${theme.link}`}
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* ---------- FACE ARRIÈRE : création de compte ---------- */}
          <div className={`flip-face flip-back ${!isRegister ? 'flip-hidden' : ''}`} aria-hidden={!isRegister}>
            <div className={`${cardClasses} h-full`}>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Créer un compte</h3>
              <p className="text-xs text-slate-700 mb-5">Rejoignez la plateforme en quelques secondes.</p>

              {isRegister && <ErrorBox />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Prénom</label>
                    <input
                      type="text"
                      required={isRegister}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputBase}
                      placeholder="Hamza"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">Nom</label>
                    <input
                      type="text"
                      required={isRegister}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputBase}
                      placeholder="Arhrid"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Rôle sur la plateforme</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputBase}
                  >
                    <option value="STUDENT">Étudiant (STUDENT)</option>
                    <option value="PROFESSOR">Professeur (PROFESSOR)</option>
                    <option value="ADMIN">Administrateur (ADMIN)</option>
                  </select>
                </div>

                {role === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">N° Étudiant / CNE</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={inputBase}
                      placeholder="STU-2026-001"
                    />
                  </div>
                )}

                {emailField}
                {passwordField}
                {submitButton('Créer mon compte')}
              </form>

              <div className="mt-6 text-center text-xs text-slate-700">
                <p>
                  Vous possédez déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => flipTo(false)}
                    className={`font-semibold hover:underline ${theme.link}`}
                  >
                    Connectez-vous
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
