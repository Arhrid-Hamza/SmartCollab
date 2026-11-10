import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import FoldText from '../components/FoldText';
import { CampusCarousel } from '../components/CampusCarousel';
import { UserAvatar } from '../components/UserAvatar';
import usersApi from '../api/users';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  UserPlus,
  Users,
  Layers,
  MapPin,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCounts = async () => {
      try {
        const [studs, profs] = await Promise.all([
          usersApi.getStudents().catch(() => []),
          usersApi.getProfessors().catch(() => []),
        ]);
        if (isMounted) {
          setStudents(studs);
          setProfessors(profs);
        }
      } catch (err) {
        console.error('Erreur chargement données dashboard:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const getRolePresentation = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          title: 'Administration Centrale EMSI',
          desc: 'Supervision générale des 5 campus de Casablanca, gestion des comptes et attribution des accès.',
          icon: ShieldCheck,
        };
      case 'PROFESSOR':
        return {
          title: 'Espace Professeur Encadrant',
          desc: 'Publication des sujets PFE, évaluation des compétences et encadrement des élèves ingénieurs.',
          icon: BookOpen,
        };
      default:
        return {
          title: 'Espace Élève Ingénieur',
          desc: 'Déclaration des compétences, recherche intelligente de projets PFE et matching algorithmique.',
          icon: GraduationCap,
        };
    }
  };

  const roleInfo = getRolePresentation();
  const RoleIcon = roleInfo.icon;
  const isAdmin = user?.role === 'ADMIN';

  const welcomeName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Collaborateur EMSI';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Welcome Banner with FoldText Animation */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Decorative green accents */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-48 w-40 h-40 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
              <RoleIcon className="w-3.5 h-3.5 text-[#15885a]" />
              <span>{roleInfo.title}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>Casablanca</span>
            </div>

            {/* FoldText Animation for Greeting / Name */}
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Portail Académique Officiel
              </p>
              <div className="overflow-visible py-1">
                <FoldText
                  text={`Bienvenue, ${welcomeName}`}
                  splitBy="char"
                  hinge="top"
                  foldStyle="paper"
                  duration={0.65}
                  stagger={0.035}
                  foldAngle={90}
                  fontSize={28}
                  fontWeight={800}
                  color="#15885a"
                  className="font-bold tracking-tight"
                />
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {roleInfo.desc}
            </p>
          </div>

          {/* User Quick Identity Pill */}
          <div className="z-10 flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm shrink-0">
            <UserAvatar user={user} size="md" showRing={true} />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-500 font-mono text-[11px] leading-tight mt-0.5 truncate max-w-[170px]">
                {user?.email}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#15885a] text-white">
                  {user?.role}
                </span>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user?.campus === 'ALL' ? 'Tous les Campus' : `EMSI ${user?.campus || 'Casablanca'}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Key Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold text-slate-600">Élèves Ingénieurs</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#15885a] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loadingData ? '—' : students.length}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold">Inscrits</span>
              <span>sur la plateforme</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold text-slate-600">Corps Professoral</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loadingData ? '—' : professors.length}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold">Enseignants</span>
              <span>&amp; encadrants PFE</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold text-slate-600">Campus Casablanca</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">5</div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">Sites connectés</span>
              <span>à Casablanca</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold text-slate-600">Filières Ingénieur</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#15885a] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">6</div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold">Spécialités</span>
              <span>IIR, GESI, IAII, GI...</span>
            </p>
          </div>
        </div>

        {/* 3D Rotating Showcase of Casablanca Campuses */}
        <CampusCarousel students={students} professors={professors} />

        {/* Admin Navigation Shortcuts */}
        {isAdmin && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#15885a]" />
              <span>Actions Rapides &amp; Gestion des Comptes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/students"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15885a] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#15885a] transition-colors">
                      Annuaire Élèves Ingénieurs
                    </h4>
                    <p className="text-xs text-slate-500">
                      Consulter, filtrer et gérer les {students.length} étudiants
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#15885a] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/professors"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15885a] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#15885a] transition-colors">
                      Corps Enseignant &amp; Encadrants
                    </h4>
                    <p className="text-xs text-slate-500">
                      Consulter et gérer les {professors.length} professeurs
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#15885a] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/users/new"
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:shadow-lg transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Créer un Nouveau Compte
                    </h4>
                    <p className="text-xs text-white/80">
                      Ajouter un étudiant ou professeur
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        )}

        {/* Profile Details & Academic Network Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card with Instagram-Style Avatar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15885a]" />
                <span>Profil Connecté</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#15885a]">
                Actif
              </span>
            </div>

            {/* Instagram-style user presentation */}
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="lg" showRing={true} />
              <div>
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#15885a] text-white">
                    {user?.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {user?.campus === 'ALL' ? 'Tous les Campus' : `EMSI ${user?.campus || 'Casablanca'}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
              {user?.matricule && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Matricule :</span>
                  <span className="font-mono font-semibold text-slate-800">{user.matricule}</span>
                </div>
              )}

              {user?.filiere && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Filière :</span>
                  <span className="font-semibold text-[#15885a]">{user.filiere}</span>
                </div>
              )}

              {user?.niveau && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Niveau :</span>
                  <span className="font-semibold text-slate-800">{user.niveau}</span>
                </div>
              )}

              {user?.groupe && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Groupe :</span>
                  <span className="font-semibold text-slate-800">{user.groupe}</span>
                </div>
              )}

              {user?.matiere && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Matière(s) :</span>
                  <span className="font-semibold text-slate-800">{user.matiere}</span>
                </div>
              )}

              <div>
                <span className="text-slate-400 block mb-1">Notice Biographique :</span>
                <p className="text-slate-700 italic bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {user?.bio || 'Aucune biographie institutionnelle renseignée.'}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Casablanca Network Information */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#15885a]" />
                  <span>Présentation du Réseau EMSI Casablanca</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  École Marocaine des Sciences de l'Ingénieur
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Fondée en 1986, l'EMSI est la plus grande école d'ingénieurs privée au Maroc. À Casablanca, l'institution dispose de 5 campus stratégiquement implantés pour couvrir l'ensemble des spécialités d'ingénierie moderne :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#15885a]" />
                    <span>EMSI Les Orangers &amp; Maârif</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Spécialisés en Informatique, Réseaux, Systèmes d'Information et Automatique Industrielle (IIR, GESI, IAII).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span>EMSI CFC &amp; Roudani</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Centres de référence en Fintech, IA, Génie Civil (BTP), Procédés Industriels et Logistique (GCBTP, GI, IFA).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-900 font-medium">
                <Activity className="w-4 h-4 text-[#15885a] shrink-0" />
                <span>
                  Supervision globale active. Les comptes créés sur chaque campus sont synchronisés en temps réel.
                </span>
              </div>
              <Link
                to="/admin/users/new"
                className="px-3 py-1.5 rounded-xl bg-[#15885a] hover:bg-[#0f7048] text-white font-semibold transition-colors shrink-0 shadow-sm"
              >
                Ajouter un compte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
