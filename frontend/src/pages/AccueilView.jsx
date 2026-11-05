import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  DoorOpen,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Building,
  BookmarkCheck,
  UserCheck
} from 'lucide-react';

export const AccueilView = ({ onNavigate }) => {
  const { user } = useAuth();
  const isProf = user?.role === 'PROFESSOR';
  const isHamza = user?.email === 'hamza.arhrid@emsi-edu.ma' || user?.firstName === 'Hamza';

  const todayFormatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bonjour {user?.firstName || 'Hamza'} !
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 capitalize mt-0.5">
              {todayFormatted}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Année {user?.academicYear || '2026-2027'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.campus ? user.campus.replace('CASA ', '') : 'Casablanca'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.filiere || 'Ingénierie Informatique et Réseaux'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <BookmarkCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.niveau || (isProf ? 'Corps Professoral' : '5ème année')}</span>
            </span>

            {user?.classeGroup && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.classeGroup}</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 w-full lg:w-80 flex flex-col justify-between shadow-inner">
          <p className="text-xs sm:text-sm font-semibold italic text-slate-800 leading-snug">
            « Chaque apprentissage est une étape vers ton avenir. »
          </p>
          <div className="h-1 w-full bg-emsi-700 rounded-full mt-3"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emsi-700" />
              {isProf ? 'Prochain encadrement PFE' : 'Prochain cours'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Dans 10 h 57
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Devops
            </h2>

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>vendredi 6 nov.</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>08:30 - 10:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Les Orangers</span>
              </div>
              <div className="flex items-center gap-2">
                <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>SC34(0)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>5DSIO G2</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('schedule')}
            type="button"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Voir mon emploi du temps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emsi-700" />
              Aujourd'hui
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              3 cours
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold block">10:30 - 12:15</span>
                <p className="text-xs font-bold text-slate-900 leading-tight">Projet</p>
                <span className="text-[10px] text-slate-500 block">Les Orangers - Fictive(0)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 text-slate-600">
                Terminé
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold block">14:00 - 16:00</span>
                <p className="text-xs font-bold text-slate-900 leading-tight">ERP</p>
                <span className="text-[10px] text-slate-500 block">Les Orangers - SC20(0)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 text-slate-600">
                Terminé
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold block">16:15 - 17:45</span>
                <p className="text-xs font-bold text-slate-900 leading-tight">Gouvernance des systemes d'information</p>
                <span className="text-[10px] text-slate-500 block">Les Orangers - SC20(0)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 text-slate-600">
                Terminé
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-emsi-700" />
                Dernières annonces
              </span>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center gap-1"
              >
                Voir toutes <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">Note pédagogique</span>
                  <span className="text-slate-400 font-medium">5 nov. 2026</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Planning Global-Contrôles & Examens S1
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emsi-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Campagne PFE 2026-2027
                  </span>
                  <span className="text-emerald-700 text-[10px] font-semibold">Nouveau</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Publication des sujets de PFE et ouverture du choix des thèmes par les étudiants.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('subjects')}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-emsi-600 text-emsi-700 hover:bg-emsi-50 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>Accéder aux Sujets PFE & Projets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emsi-700" />
              Ma situation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-3xl font-extrabold text-rose-600 tracking-tight block">
                  14
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-tight">
                  Absences
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">justifiées ou non</p>
              </div>
              <button
                onClick={() => onNavigate('absences')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1"
              >
                Voir mes absences <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-3xl font-extrabold text-blue-600 tracking-tight block">
                  1
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-tight">
                  Nouvelles annonces
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">7 derniers jours</p>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
              >
                Voir mes annonces <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight block">
                  0
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-tight">
                  Rappel aujourd'hui
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">cours restants</p>
              </div>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-1"
              >
                Voir mon emploi du temps <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emsi-700" />
                Mon profil
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center gap-1"
              >
                Voir mon profil <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Matricule</span>
                <span className="font-bold text-slate-900 font-mono">
                  {user?.matricule || user?.studentIdentifier || 'C-2025-000564'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email éducatif</span>
                <span className="font-semibold text-slate-900 truncate max-w-[210px]">
                  {user?.email || 'hamza.arhrid@emsi-edu.ma'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Filière</span>
                <span className="font-bold text-slate-900 truncate max-w-[210px]">
                  {user?.filiere || 'Ingénierie Informatique et Réseaux'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Niveau</span>
                <span className="font-bold text-slate-900">
                  {user?.niveau || (isProf ? 'Enseignant' : '5ème année')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Groupe</span>
                <span className="font-bold text-slate-900">
                  {user?.classeGroup || '5DSIO G2 - G22'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Campus</span>
                <span className="font-bold text-slate-900">
                  {user?.campus || 'CASA ORANGERS'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
