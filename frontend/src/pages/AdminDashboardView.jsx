import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  Building,
  Calendar,
  BarChart2,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboardView = ({ onNavigate }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, appRes, grpRes] = await Promise.allSettled([
          api.get('/subjects'),
          api.get('/applications'),
          api.get('/groups')
        ]);
        if (subRes.status === 'fulfilled') setSubjects(subRes.value.data || []);
        if (appRes.status === 'fulfilled') setApplications(appRes.value.data || []);
        if (grpRes.status === 'fulfilled') setGroups(grpRes.value.data || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };
    fetchData();
  }, []);

  const approvedCount = applications.filter(a => a.status === 'ACCEPTE').length;
  const pendingCount = applications.filter(a => a.status === 'EN_ATTENTE').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Direction des Études & Commission PFE • EMSI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tableau de Bord Direction Pédagogique
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Supervision globale de la campagne des projets de fin d'études et coordination multi-campus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Année Universitaire 2026-2027</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Casablanca (Orangers, Roudani, Maarif)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>Cycle Ingénieur (IIR, IFA, GC, GE)</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => onNavigate('subjects')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Tous les Sujets ({subjects.length})</span>
          </button>
          <button
            onClick={() => onNavigate('applications')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-700" />
            <span>Toutes Candidatures ({applications.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Étudiants Inscrits
            </span>
            <Users className="w-4 h-4 text-emsi-700" />
          </div>
          <span className="text-3xl font-black text-slate-900 block">142</span>
          <span className="text-[11px] text-slate-500 font-medium">Promo 2026-2027 (5DSIO)</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Corps Professoral
            </span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-3xl font-black text-purple-700 block">18</span>
          <span className="text-[11px] text-slate-500 font-medium">Enseignants encadrants</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Catalogue Sujets
            </span>
            <FolderGit2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-blue-600 block">{subjects.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Sujets PFE & PFA validés</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Taux d'Affectation
            </span>
            <BarChart2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-600 block">78 %</span>
          <span className="text-[11px] text-slate-500 font-medium">{approvedCount} groupes affectés</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Supervision des Filières & Répartition des PFE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">IIR - Ingénierie Informatique</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  92% Affectés
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spécialités : Cloud-Native, DevOps, IA & Data, Architectures Réactives.
              </p>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emsi-700 w-[92%] rounded-full"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">IFA - Finance & Audit</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  75% Affectés
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spécialités : FinTech, Blockchain, Risk Management, Big Data Financier.
              </p>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-blue-600 w-[75%] rounded-full"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Génie Civil & BTP</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  68% Affectés
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spécialités : BIM, Structures durables, Géotechnique.
              </p>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 w-[68%] rounded-full"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Génie Électrique & IoT</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  80% Affectés
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spécialités : Énergies Renouvelables, Smart Grid, Systèmes Embarqués.
              </p>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-purple-600 w-[80%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Statut des Vœux & Groupes
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Groupes Constitués</span>
              <span className="font-bold text-slate-900">{groups.length} équipes</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
              <span className="font-medium">Candidatures en Attente</span>
              <span className="font-bold">{pendingCount} vœux</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
              <span className="font-medium">Candidatures Validées</span>
              <span className="font-bold">{approvedCount} affectations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
