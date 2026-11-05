import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  FolderGit2,
  CheckSquare,
  Users,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building,
  GraduationCap,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export const ProfessorDashboardView = ({ onNavigate }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching professor data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingApps = applications.filter(a => a.status === 'EN_ATTENTE');
  const approvedApps = applications.filter(a => a.status === 'ACCEPTE');

  const handleQuickStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        feedback: newStatus === 'ACCEPTE' ? 'Candidature validée par le professeur encadrant.' : 'Candidature non retenue.'
      });
      const updated = await api.get('/applications');
      setApplications(updated.data || []);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Espace Enseignant Encadrant • EMSI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bonjour Professeur {user?.firstName} {user?.lastName} !
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Plateforme de gestion de vos sujets de PFE, validation des équipes d'étudiants et suivi des jalons.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Année {user?.academicYear || '2026-2027'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.campus || 'Campus Casablanca Orangers'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>Département IIR (Génie Logiciel & Cloud)</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => onNavigate('subjects')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer un sujet</span>
          </button>
          <button
            onClick={() => onNavigate('applications')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-emsi-700" />
            <span>Candidatures ({pendingApps.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('subjects')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 cursor-pointer hover:border-emsi-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sujets Déposés
            </span>
            <FolderGit2 className="w-4 h-4 text-emsi-700" />
          </div>
          <span className="text-3xl font-black text-slate-900 block">{subjects.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Sujets PFE & PFA publiés</span>
        </div>

        <div
          onClick={() => onNavigate('applications')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              À Valider
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-amber-600 block">{pendingApps.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Candidatures en attente</span>
        </div>

        <div
          onClick={() => onNavigate('groups')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Groupes Affectés
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-3xl font-black text-blue-600 block">{approvedApps.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Équipes confirmées</span>
        </div>

        <div
          onClick={() => onNavigate('schedule')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Prochain Encadrement
            </span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-lg font-black text-slate-900 block truncate">Ven. 08:30</span>
          <span className="text-[11px] text-slate-500 font-medium">DevOps (5DSIO G2)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emsi-700" />
              <span>Dernières candidatures à valider ({pendingApps.length})</span>
            </h2>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center gap-1"
            >
              Voir toutes <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingApps.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              Toutes les candidatures ont été traitées !
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {app.groupName ? `Groupe: ${app.groupName}` : 'Individuel'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Choix #{app.priorityOrder}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{app.subjectTitle}</h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      Candidat : {app.studentName} ({app.studentEmail})
                    </p>
                  </div>

                  {app.motivation && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2">
                      « {app.motivation} »
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleQuickStatus(app.id, 'REFUSE')}
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold"
                    >
                      Refuser
                    </button>
                    <button
                      onClick={() => handleQuickStatus(app.id, 'ACCEPTE')}
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-emsi-700 hover:bg-emsi-800 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valider & Affecter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emsi-700" />
              <span>Mes sujets déposés</span>
            </h2>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center gap-1"
            >
              Gérer <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {subjects.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {sub.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Max: {sub.maxStudentsPerGroup} étud.
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{sub.title}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-1">{sub.technologies}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
