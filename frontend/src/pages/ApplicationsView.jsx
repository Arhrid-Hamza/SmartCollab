import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  User,
  MessageSquare,
  Sparkles,
  ArrowRight,
  FolderGit2,
  AlertCircle
} from 'lucide-react';

export const ApplicationsView = () => {
  const { user } = useAuth();
  const isProf = user?.role === 'PROFESSOR';
  const isAdmin = user?.role === 'ADMIN';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [activeFeedbackAppId, setActiveFeedbackAppId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        feedback: feedbackInput || (newStatus === 'ACCEPTE' ? 'Candidature validée par le professeur encadrant.' : 'Candidature non retenue pour ce sujet.')
      });
      setActiveFeedbackAppId(null);
      setFeedbackInput('');
      fetchApplications();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-emsi-700" />
          <span>{isProf ? 'Validation des Candidatures & Choix des Sujets' : 'Mes Candidatures & Choix de Sujets (PFE/PFA)'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isProf
            ? 'Passez en revue les demandes formulées par les étudiants ou groupes et affectez les sujets.'
            : 'Suivez le statut de validation de vos vœux de sujets PFE / PFA auprès des professeurs encadrants.'}
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block w-8 h-8 border-4 border-emsi-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-500 font-medium">Chargement des candidatures...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Aucune candidature enregistrée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {isProf
              ? 'Aucun étudiant n\'a encore postulé à vos sujets pour le moment.'
              : 'Vous n\'avez pas encore déposé de candidature. Consultez les sujets disponibles.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isApproved = app.status === 'ACCEPTE';
            const isRejected = app.status === 'REFUSE';
            const isPending = app.status === 'EN_ATTENTE';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 hover:border-emsi-500/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        Choix #{app.priorityOrder}
                      </span>
                      {app.groupName ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <Users className="w-3 h-3" />
                          Groupe : {app.groupName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          <User className="w-3 h-3" />
                          Candidature Individuelle
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {app.subjectTitle}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Validé / Affecté</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>En attente de validation</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Non retenu</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate details & Motivation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Candidat postulant :</span>
                    <p className="font-bold text-slate-800">{app.studentName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{app.studentEmail}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Date de soumission :</span>
                    <p className="font-medium text-slate-700">
                      {new Date(app.submittedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {app.motivation && (
                    <div className="md:col-span-2 pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-bold block mb-0.5">Note de motivation :</span>
                      <p className="text-slate-700 italic">« {app.motivation} »</p>
                    </div>
                  )}

                  {app.professorFeedback && (
                    <div className="md:col-span-2 pt-2 border-t border-slate-200/60">
                      <span className="text-emerald-700 font-bold block mb-0.5">Retour de l'encadrant :</span>
                      <p className="text-slate-800 font-medium">{app.professorFeedback}</p>
                    </div>
                  )}
                </div>

                {/* Actions for Professors / Admins */}
                {(isProf || isAdmin) && isPending && (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={updatingId === app.id}
                      onClick={() => handleUpdateStatus(app.id, 'REFUSE')}
                      className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Refuser la candidature
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === app.id}
                      onClick={() => handleUpdateStatus(app.id, 'ACCEPTE')}
                      className="px-4 py-2 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valider & Affecter ce sujet</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
