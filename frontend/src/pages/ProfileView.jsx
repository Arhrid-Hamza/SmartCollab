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
  Users2
} from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
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
            <span className="text-slate-600 font-semibold">Profil</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Mon Profil
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
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emsi-700 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-slate-100 shadow-md">
              {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
            </div>
          )}
        </div>

        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {user?.lastName?.toUpperCase() || 'ARHRID'} {user?.firstName || 'Hamza'}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-center md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Étudiant actif</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs pt-1">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Matricule</span>
                <span className="font-bold text-slate-800 font-mono">
                  {user?.matricule || user?.studentIdentifier || 'C-2025-000564'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Programme</span>
                <span className="font-bold text-slate-800">
                  {user?.filiere || 'Ingénierie Informatique et Réseaux'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Niveau</span>
                <span className="font-bold text-slate-800">
                  {user?.niveau || '5ème année'}
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
                <span className="text-[10px] text-slate-400 block leading-tight">Groupe</span>
                <span className="font-bold text-slate-800">
                  {user?.classeGroup || '5DSIO G2 - G22'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Note diplôme</span>
                <span className="font-bold text-slate-800">—</span>
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
              <span className="font-bold text-slate-900">{user?.lastName?.toUpperCase() || 'ARHRID'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Prénom</span>
              <span className="font-bold text-slate-900">{user?.firstName || 'Hamza'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Date de naissance</span>
              <span className="font-semibold text-slate-900">14/12/2003</span>
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
              <span className="font-mono text-slate-900 font-semibold">+212691107214</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email personnel</span>
              <span className="text-slate-400">—</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email institutionnel</span>
              <span className="font-medium text-blue-600 hover:underline">
                {user?.email || 'hamza.arhrid@emsi-edu.ma'}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Adresse</span>
              <span className="font-semibold text-slate-800 text-right max-w-[260px]">
                OP AL FERDAOUS GH 5 IMM 141 APPT 17 EL
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Users2 className="w-4 h-4 text-emsi-700" />
            <span>Informations tuteur</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block text-emsi-700">
                Tuteur 1
              </span>

              <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Nom</span>
                  <span className="font-bold text-slate-900">Arhrid Ahmed</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Profession</span>
                  <span className="text-slate-400">—</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Téléphone</span>
                  <span className="font-mono text-slate-900 font-semibold">+212684524334</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Email tuteur</span>
                  <span className="font-medium text-blue-600 hover:underline">
                    {user?.email || 'hamza.arhrid@emsi-edu.ma'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block text-slate-500">
                Tuteur 2
              </span>

              <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Nom</span>
                  <span className="text-slate-400">—</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Profession</span>
                  <span className="text-slate-400">—</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Téléphone</span>
                  <span className="font-mono text-slate-900 font-semibold">+212520199349</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
