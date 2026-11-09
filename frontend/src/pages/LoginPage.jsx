import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EmsiBar } from '../components/EmsiBar';
import FoldText from '../components/FoldText';
import loginBg from '../assets/login-bg.jpg';
import appLogo from '../assets/emsicollab-logo.png';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

// Email : uniquement lettres, chiffres et . _ - @  (tout autre caractère est supprimé à la saisie/au collage)
const EMAIL_FORBIDDEN = /[^A-Za-z0-9@._-]/g;
// Domaine autorisé pour la connexion
const ALLOWED_EMAIL_DOMAIN = '@emsi-edu.ma';
const EMAIL_REGEX = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// Mot de passe : tous les caractères permis, sauf les caractères de contrôle invisibles
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ---------- Adaptation automatique à la taille de la fenêtre ----------
  // Le bloc (logo + titre + carte) est réduit si la fenêtre est trop petite,
  // pour que tout reste visible sans scroll, comme sur un grand écran.
  const areaRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const fit = () => {
      const area = areaRef.current;
      const content = contentRef.current;
      if (!area || !content) return;
      const availH = area.clientHeight - 24;
      const availW = area.clientWidth - 16;
      const s = Math.min(1, availH / content.offsetHeight, availW / content.offsetWidth);
      setScale(Math.max(s, 0.4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(areaRef.current);
    ro.observe(contentRef.current);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    if (!EMAIL_REGEX.test(cleanEmail) || !cleanEmail.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)) {
      setError('Adresse email invalide.');
      return;
    }
    setLoading(true);
    try {
      await login(cleanEmail, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || 'Identifiants invalides ou service indisponible';
      setError(typeof msg === 'string' ? msg : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white/80 border border-slate-200/80 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-colors';

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100">
      <EmsiBar />

      <div
        ref={areaRef}
        style={{ backgroundImage: `url(${loginBg})` }}
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      >
        <div
          ref={contentRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="w-[28rem] max-w-full shrink-0"
        >
          {/* Logo centré + titre animé */}
          <div className="text-center">
            <img
              src={appLogo}
              alt="EMSICollab"
              className="h-24 w-auto mx-auto mb-2 select-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]"
              draggable="false"
            />
            <div style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.85))' }}>
              <FoldText
                text="EMSICollab"
                foldStyle="paper"
                splitBy="char"
                hinge="top"
                trigger="mount"
                foldAngle={92}
                duration={0.65}
                stagger={0.045}
                staggerFrom="start"
                ease="power3.out"
                loopDelay={1.4}
                hoverRefold
                refoldRadius={140}
                refoldAngle={45}
                perspective={700}
                creaseShading={0.55}
                fontSize={56}
                fontWeight={800}
                color="#168a55"
              />
            </div>
            <p className="mt-1.5 text-sm font-medium text-slate-800 drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              Plateforme Intelligente de Matching PFE & Compétences
            </p>
          </div>

          {/* Carte de connexion (glass léger) */}
          <div className="login-card-rise mt-6 bg-white/55 backdrop-blur-xl backdrop-saturate-150 py-7 px-6 sm:px-9 rounded-2xl shadow-2xl shadow-slate-900/20 border border-white/60 ring-1 ring-white/30">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    maxLength={100}
                    readOnly={loading}
                    autoComplete="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.replace(EMAIL_FORBIDDEN, ''));
                      setError('');
                    }}
                    className={`${inputClass} pl-9 pr-3`}
                    placeholder="nom@emsi-edu.ma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Mot de Passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength={128}
                    readOnly={loading}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value.replace(CONTROL_CHARS, ''));
                      setError('');
                    }}
                    className={`${inputClass} pl-9 pr-10`}
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

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="relative overflow-hidden w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#15885a] hover:bg-[#0f7048] focus:outline-none focus:ring-2 focus:ring-[#15885a] focus:ring-offset-2 shadow-md transition-all disabled:cursor-wait disabled:hover:bg-[#15885a]"
              >
                {loading && <span className="btn-loading-sweep absolute inset-0" aria-hidden="true" />}
                {loading ? (
                  <span className="relative flex items-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Connexion en cours</span>
                    <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
