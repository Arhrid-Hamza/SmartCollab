import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Printer,
  CreditCard,
  Building,
  GraduationCap,
  Users,
  Bookmark,
  Star,
  User,
  Users2,
  Mail,
  ShieldCheck,
  Award,
  BookOpen
} from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';
  const isProf = role === 'PROFESSOR';
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';
  const isHamza = user?.email === 'hamza.arhrid@emsi-edu.ma' || user?.firstName === 'Hamza';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Accueil</span>
            <span>›</span>
            <span className="text-slate-600 font-semibold">
              {isProf ? 'Profil Enseignant' : isAdmin ? 'Profil Coordination' : 'Mon Profil Étudiant'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isProf ? 'Dossier Enseignant-Chercheur' : isAdmin ? 'Fiche Direction Pédagogique' : 'Mon Profil'}
          </h1>
        </div>

        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Imprimer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          {isHamza ? (
            <img
              src="/hamza-avatar.png"
              alt="ARHRID Hamza"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-100 shadow-md"
            />
          ) : isProf ? (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-600 text-white font-black text-3xl flex items-center justify-center border-4 border-slate-100 shadow-md">
              KB
            </div>
          ) : isAdmin ? (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-700 text-white font-black text-3xl flex items-center justify-center border-4 border-slate-100 shadow-md">
              ED
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emsi-700 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-slate-100 shadow-md">
              {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isProf ? `Prof. ${user?.firstName} ${user?.lastName}` : `${user?.lastName?.toUpperCase() || 'ARHRID'} ${user?.firstName || 'Hamza'}`}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold self-center md:self-auto border ${
              isProf
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : isAdmin
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isProf ? 'bg-blue-500' : isAdmin ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
              <span>{isProf ? 'Enseignant Encadrant' : isAdmin ? 'Administration Centrale' : 'Étudiant actif'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs pt-1">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {isProf ? 'Matricule Enseignant' : isAdmin ? 'Identifiant Admin' : 'Matricule'}
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {isProf ? 'ENS-2026-042' : isAdmin ? 'ADM-2026-001' : (user?.matricule || user?.studentIdentifier || 'C-2025-000564')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {isProf ? 'Département' : isAdmin ? 'Service' : 'Programme'}
                </span>
                <span className="font-bold text-slate-800">
                  {isProf ? 'Génie Logiciel & Cloud (IIR)' : isAdmin ? 'Direction Pédagogique & PFE' : (user?.filiere || 'Ingénierie Informatique et Réseaux')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {isProf ? 'Grade Académique' : isAdmin ? 'Rôle' : 'Niveau'}
                </span>
                <span className="font-bold text-slate-800">
                  {isProf ? 'Professeur Habilité' : isAdmin ? 'Coordinateur PFE' : (user?.niveau || '5ème année')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Campus</span>
                <span className="font-bold text-slate-800">
                  {user?.campus || 'CASA ORANGERS'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {isProf ? 'Classes Assignées' : isAdmin ? 'Périmètre' : 'Groupe'}
                </span>
                <span className="font-bold text-slate-800">
                  {isProf ? '5DSIO G1, 5DSIO G2, 4IIR' : isAdmin ? 'Tous les Campus Maroc' : (user?.classeGroup || '5DSIO G2 - G22')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Année Universitaire</span>
                <span className="font-bold text-slate-800">2026-2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emsi-700" />
            <span>Informations personnelles</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Nom</span>
              <span className="font-bold text-slate-900">{user?.lastName?.toUpperCase() || (isProf ? 'BENALI' : 'ARHRID')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Prénom</span>
              <span className="font-bold text-slate-900">{user?.firstName || (isProf ? 'Karim' : 'Hamza')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Date de naissance</span>
              <span className="font-semibold text-slate-900">{isProf ? '12/05/1982' : '14/12/2003'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Lieu de naissance</span>
              <span className="font-bold text-slate-900">CASABLANCA</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Nationalité</span>
              <span className="font-bold text-slate-900">Marocaine</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Genre</span>
              <span className="font-semibold text-slate-900">Homme</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Téléphone</span>
              <span className="font-mono text-slate-900 font-semibold">{isProf ? '+212661894230' : '+212691107214'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email institutionnel</span>
              <span className="text-emsi-700 font-semibold font-mono">{user?.email || 'hamza.arhrid@emsi-edu.ma'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Adresse</span>
              <span className="font-semibold text-slate-800 text-right">
                {isProf ? 'Bureau B204, Campus Orangers, Casablanca' : 'OP AL FERDAOUS GH 5 IMM 141 APPT 17 EL OULFA CASABLANCA'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Users2 className="w-4 h-4 text-emsi-700" />
            <span>{isProf ? 'Spécialités & Responsabilités' : isAdmin ? 'Missions Pédagogiques' : 'Informations tuteur'}</span>
          </div>

          {isProf ? (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block">Domaines d'expertise :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Cloud Computing', 'Kubernetes', 'DevOps & GitOps', 'Spring Boot Microservices', 'Kafka Streaming', 'Sécurité Cloud'].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Sujets PFE encadrés :</span>
                  <span className="font-bold text-slate-900">5 projets</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Bureau d'accueil :</span>
                  <span className="font-bold text-slate-900">Bâtiment B - Étage 2 - Bureau 204</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Heures de permanence :</span>
                  <span className="font-bold text-slate-900">Mardi & Jeudi 14h - 16h</span>
                </div>
              </div>
            </div>
          ) : isAdmin ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 space-y-1.5">
                <span className="font-bold text-purple-900 block">Direction Centrale des PFE & Stages</span>
                <p className="text-[11px] text-purple-700">
                  Coordination de la validation des sujets, affectation des commissions de jurys et publication des délibérations.
                </p>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Contact Direction :</span>
                <span className="font-mono font-bold text-slate-900">pfe.direction@emsi-edu.ma</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Téléphone Siège :</span>
                <span className="font-mono text-slate-900 font-semibold">+212522987600</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-emsi-700 text-xs">Tuteur 1</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nom</span>
                    <span className="font-bold text-slate-900">Arhrid Ahmed</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Profession</span>
                    <span className="text-slate-400">—</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Téléphone</span>
                    <span className="font-mono text-slate-900 font-semibold">+212684524334</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Email tuteur</span>
                    <span className="text-emsi-700 font-mono">hamza.arhrid@emsi-edu.ma</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <h4 className="font-extrabold text-emsi-700 text-xs">Tuteur 2</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nom</span>
                    <span className="text-slate-400">—</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Profession</span>
                    <span className="text-slate-400">—</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Téléphone</span>
                    <span className="font-mono text-slate-900 font-semibold">+212520199349</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
