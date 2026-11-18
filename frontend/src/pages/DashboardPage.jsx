import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { AnimatePresence, motion } from 'motion/react';
import { AdminCampusPanel } from '../components/AdminCampusPanel';
import { AdminUserList } from '../components/AdminUserList';
import { AdminStudentForm } from '../components/AdminStudentForm';
import { AdminProfessorForm } from '../components/AdminProfessorForm';
import MicroSlats from '../components/MicroSlats';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Code2,
  ArrowRight
} from 'lucide-react';

const SEARCH_DELAY = 900; // ms : durée minimale de l'animation de recherche

export const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  // Admin : null = accueil, sinon { view, campus } = page liste (cartes d'accueil masquées)
  const [adminList, setAdminList] = useState(null);
  const [adminCampus, setAdminCampus] = useState(undefined);
  const [adminSearch, setAdminSearch] = useState('');
  // Recherche par matricule : "searching" reste vrai un court instant (la loupe tourne, la carte fantôme s'affiche)
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (adminList?.view !== 'STUDENTS' || adminSearch.trim().length < 3) {
      setSearching(false);
      return undefined;
    }
    setSearching(true);
    const timer = setTimeout(() => setSearching(false), SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [adminSearch, adminList?.view]);
  // Page "Ajouter un étudiant" : null = fermée, sinon { campus }
  const [adminForm, setAdminForm] = useState(null);
  // Page "Ajouter un professeur" : null = fermée, sinon { campus }
  const [profForm, setProfForm] = useState(null);

  const todayRaw = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const today = todayRaw.charAt(0).toUpperCase() + todayRaw.slice(1);

  const getRolePresentation = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          title: 'Espace Administrateur',
          desc: 'Vous gérez les comptes des étudiants et des professeurs, leurs accès et toute l’activité de la plateforme.',
          icon: ShieldCheck,
          theme: 'from-[#15885a] to-[#0f7048]',
        };
      case 'PROFESSOR':
        return {
          title: 'Espace Professeur Encadrant',
          desc: 'Publication des sujets PFE, critères techniques et évaluation des candidatures.',
          icon: BookOpen,
          theme: 'from-emerald-600 to-teal-600',
        };
      default:
        return {
          title: 'Espace Étudiant Ingénieur',
          desc: 'Profil technique, recommandations intelligentes de PFE et matching de compétences.',
          icon: GraduationCap,
          theme: 'from-indigo-600 to-blue-600',
        };
    }
  };

  const roleInfo = getRolePresentation();
  const Icon = roleInfo.icon;

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`;

  // Admin : animation simple (fondu + glissement) et main qui salue
  const heading = isAdmin ? (
    <h1 className="text-2xl sm:text-3xl font-bold welcome-title">
      Bienvenue, {fullName} ! <span className="wave-hand">👋</span>
    </h1>
  ) : (
    <h1 className="text-2xl sm:text-3xl font-bold">Bienvenue, {fullName} ! 👋</h1>
  );

  const rightBox = isAdmin ? (
    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-xs">
      <span className="text-white/70 block">Aujourd’hui</span>
      <span className="text-sm font-semibold block whitespace-nowrap">{today}</span>
    </div>
  ) : (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-xs">
      <span className="text-white/70 block">Identifiant Session :</span>
      <span className="font-mono font-medium truncate max-w-[200px] block">{user?.id}</span>
    </div>
  );

  const banner = (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        isAdmin ? 'bg-[#0c2a1e]' : `bg-gradient-to-r ${roleInfo.theme}`
      } text-white p-6 sm:p-8 shadow-lg shadow-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
    >
      {isAdmin && (
        <>
          {/* Fond animé (MicroSlats) */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <MicroSlats
              preset="swell"
              color="#168a55"
              glintColor="#ffffff"
              backgroundColor="#0c2a1e"
              slatWidth={10}
              slatHeight={25}
              gap={3}
              roundness={0.75}
              interactive
              cursorStrength={1}
              cursorSize={40}
              swirl={0}
              trail={1.4}
              lean={0}
              intro
              introDuration={1.5}
              scale={1.5}
              speed={0.6}
              direction={250}
              chop={0.55}
              stretch={0}
              glint={0.7}
              contrast={1.25}
              perspective={0.55}
              fog={0.55}
            />
          </div>
          {/* Voile léger pour garder le texte lisible */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/45 via-black/15 to-black/0" />
        </>
      )}

      <div className="relative space-y-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm ${isAdmin ? 'welcome-badge' : ''}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{roleInfo.title}</span>
        </div>
        {heading}
        <p className={`text-sm text-white/80 max-w-xl ${isAdmin ? 'welcome-desc' : ''}`}>
          {roleInfo.desc}
        </p>
      </div>

      <div className={`relative ${isAdmin ? 'welcome-box' : ''}`}>{rightBox}</div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#eaf4ee] flex flex-col">
        <Navbar
          hideSearch={!!adminForm || !!profForm}
          onBack={
            adminList || adminForm || profForm
              ? () => {
                  setAdminList(null);
                  setAdminForm(null);
                  setProfForm(null);
                  setAdminSearch('');
                }
              : undefined
          }
          search={adminSearch}
          onSearch={setAdminSearch}
          searchLoading={searching}
          searchPlaceholder={
            adminList?.view === 'PROFESSORS'
              ? 'Rechercher un professeur…'
              : adminList?.view === 'ALL'
              ? 'Rechercher un utilisateur…'
              : 'Rechercher un étudiant…'
          }
        />
        <main className="flex-1 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <AnimatePresence mode="wait">
            {profForm ? (
              <motion.div
                key="professor-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <AdminProfessorForm
                  initialCampus={profForm.campus}
                  onBack={() => {
                    setProfForm(null);
                  }}
                />
              </motion.div>
            ) : adminForm ? (
              <motion.div
                key="student-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <AdminStudentForm
                  initialCampus={adminForm.campus}
                  onBack={() => {
                    setAdminForm(null);
                  }}
                />
              </motion.div>
            ) : !adminList ? (
              <motion.div
                key="home"
                className="space-y-6"
                exit={{ opacity: 0, y: -30, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeIn' }}
              >
                <div className="admin-banner-in">{banner}</div>
                <div className="admin-panel-in">
                  <AdminCampusPanel
                    initialCampus={adminCampus}
                    onViewChange={({ campus }) => setAdminCampus(campus)}
                    onAddStudent={({ campus }) => {
                      setAdminCampus(campus);
                      setAdminForm({ campus });
                    }}
                    onAddProfessor={({ campus }) => {
                      setAdminCampus(campus);
                      setProfForm({ campus });
                    }}
                    onOpenList={(next) => {
                      setAdminCampus(next.campus);
                      setAdminList(next);
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <AdminUserList view={adminList.view} campus={adminList.campus} search={adminSearch} searching={searching} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {banner}

        {/* Status of Feature 1 & Handover to Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Mon Profil Connecté
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Nom complet</span>
                <span className="font-semibold text-slate-800">{user?.firstName} {user?.lastName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block">Email institutionnel</span>
                <span className="font-semibold text-slate-800">{user?.email}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block">Rôle RBAC</span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user?.role}
                </span>
              </div>

              {user?.campus && (
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Campus EMSI</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {user?.campus === 'ALL' ? '🌐 Tous les campus (Supervision Globale)' : `EMSI ${user?.campus}`}
                  </span>
                </div>
              )}

              {user?.studentIdentifier && (
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Numéro Étudiant / CNE</span>
                  <span className="font-mono text-slate-800">{user?.studentIdentifier}</span>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500 font-medium block">Bio</span>
                <p className="text-slate-600 text-xs mt-0.5 italic">
                  {user?.bio || "Aucune biographie renseignée pour l'instant."}
                </p>
              </div>
            </div>
          </div>

          {/* Feature 1 Success Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Feature 1 : Authentification & Sécurité (Validée ✅)
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Prête à pousser
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              La brique d'authentification complète fonctionne de bout en bout :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">🔐 Backend Spring Boot (:8081)</span>
                <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                  <li>Tokens JWT signés avec Secret HMAC</li>
                  <li>Hachage des mots de passe en BCrypt</li>
                  <li>Filtre réactif OncePerRequestFilter</li>
                  <li>Base MySQL 8 <code className="text-indigo-600">emsicollab</code> (:3307) &amp; phpMyAdmin (:8085)</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">💻 Frontend React 18 (:5173)</span>
                <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                  <li>Client Axios avec intercepteurs JWT</li>
                  <li>AuthContext global pour la session</li>
                  <li>Page de Login avec boutons démo</li>
                  <li>Garde de route ProtectedRoute</li>
                </ul>
              </div>
            </div>

            {/* Next Step Handover */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  Prochaine Étape : Feature 2 (Profil & Skills)
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Votre collaborateur pourra tirer cette branche (`git pull`) et implémenter la déclaration des compétences (sliders 1 à 5 + radar chart).
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 whitespace-nowrap">
                <span>Relais prêt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
