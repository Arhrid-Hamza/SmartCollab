import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Code2,
  ArrowRight
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();

  const getRolePresentation = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          title: 'Espace Administrateur',
          desc: 'Gestion des rôles, référentiel de compétences et supervision système.',
          icon: ShieldCheck,
          theme: 'from-purple-600 to-indigo-600',
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Welcome Banner */}
        <div className={`rounded-2xl bg-gradient-to-r ${roleInfo.theme} text-white p-6 sm:p-8 shadow-lg shadow-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Icon className="w-3.5 h-3.5" />
              <span>{roleInfo.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Bienvenue, {user?.firstName} {user?.lastName} ! 👋
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              {roleInfo.desc}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-xs">
            <span className="text-white/70 block">Identifiant Session :</span>
            <span className="font-mono font-medium truncate max-w-[200px] block">{user?.id}</span>
          </div>
        </div>

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
                  <li>Base PostgreSQL <code className="text-indigo-600">auth_db</code> (:5431)</li>
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
