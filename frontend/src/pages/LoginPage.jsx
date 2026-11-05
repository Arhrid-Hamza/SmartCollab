import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EmsiLogo } from '../components/EmsiLogo';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Building,
  CheckCircle2
} from 'lucide-react';

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
  const [role, setRole] = useState('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [filiere, setFiliere] = useState('Ingénierie Informatique et Réseaux');
  const [niveau, setNiveau] = useState('5ème année');
  const [campus, setCampus] = useState('CASA ORANGERS');

  const demoAccounts = [
    {
      role: 'STUDENT',
      label: 'Hamza Arhrid',
      sub: 'Élève Ingénieur (5DSIO)',
      email: 'hamza.arhrid@emsi-edu.ma',
      password: 'Student123!',
      icon: GraduationCap,
      color: 'border-emerald-600 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100/70',
    },
    {
      role: 'PROFESSOR',
      label: 'Prof. Karim Benali',
      sub: 'Enseignant Encadrant',
      email: 'karim.benali@emsi-edu.ma',
      password: 'Prof123!',
      icon: BookOpen,
      color: 'border-blue-600 bg-blue-50/60 text-blue-900 hover:bg-blue-100/70',
    },
    {
      role: 'ADMIN',
      label: 'Direction EMSI',
      sub: 'Coordination PFE',
      email: 'admin@emsi-edu.ma',
      password: 'Admin123!',
      icon: ShieldCheck,
      color: 'border-purple-600 bg-purple-50/60 text-purple-900 hover:bg-purple-100/70',
    },
  ];

  const handleFillDemo = (acc) => {
    setIsRegister(false);
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
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
          matricule: role === 'STUDENT' ? studentId : null,
          filiere,
          niveau,
          campus,
          classeGroup: role === 'STUDENT' ? '5DSIO G2 - G22' : null,
          academicYear: '2026-2027'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-slate-50 to-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Top EMSI Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center mb-2">
          <EmsiLogo variant="green" size="large" showSubtitle={true} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            EmsiCollab
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Portail Officiel de Gestion des Sujets PFE, PFA et Choix de Projets
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-7 px-6 shadow-xl shadow-slate-200/60 sm:rounded-3xl sm:px-9 border border-slate-200/90 space-y-6">
          {/* Quick Demo Accounts Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Accès Rapide (Comptes Démo EMSI)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleFillDemo(acc)}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-xs font-bold transition-all text-center ${acc.color}`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="truncate w-full text-[11px] font-bold leading-tight">{acc.label}</span>
                    <span className="text-[9px] opacity-75 font-normal truncate w-full">{acc.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Ou avec vos identifiants institutionnels
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration specific fields */}
            {isRegister && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Hamza"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Arhrid"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rôle</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                    >
                      <option value="STUDENT">Élève Ingénieur</option>
                      <option value="PROFESSOR">Professeur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Matricule</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="C-2025-000564"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Filière</label>
                    <select
                      value={filiere}
                      onChange={(e) => setFiliere(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                    >
                      <option value="Ingénierie Informatique et Réseaux">IIR</option>
                      <option value="Ingénierie Financière & Audit">IFA</option>
                      <option value="Génie Civil">Génie Civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Niveau</label>
                    <select
                      value={niveau}
                      onChange={(e) => setNiveau(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                    >
                      <option value="5ème année">5ème année</option>
                      <option value="4ème année">4ème année</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Éducatif EMSI :
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prenom@emsi-edu.ma"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mot de passe :
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Connexion en cours...' : (isRegister ? "S'inscrire sur EmsiCollab" : 'Se connecter')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs font-semibold text-emsi-700 hover:text-emsi-800"
            >
              {isRegister ? 'Déjà un compte ? Connectez-vous' : "Première visite ? Créer un profil étudiant"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          © {new Date().getFullYear()} École Marocaine des Sciences de l'Ingénieur (EMSI) — Membre d'Honoris United Universities
        </p>
      </div>
    </div>
  );
};
