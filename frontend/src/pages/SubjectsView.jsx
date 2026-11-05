import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  Sparkles,
  BookOpen,
  Send,
  X,
  FileText
} from 'lucide-react';

export const SubjectsView = ({ onNavigateToApplications, onNavigateToGroups }) => {
  const { user } = useAuth();
  const isProf = user?.role === 'PROFESSOR';
  const isAdmin = user?.role === 'ADMIN';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [userApplications, setUserApplications] = useState([]);
  const [groups, setGroups] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [priorityOrder, setPriorityOrder] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('PFE');
  const [newFiliere, setNewFiliere] = useState(user?.filiere || 'Ingénierie Informatique et Réseaux');
  const [newNiveau, setNewNiveau] = useState('5ème année');
  const [newDescription, setNewDescription] = useState('');
  const [newObjectives, setNewObjectives] = useState('');
  const [newTechnologies, setNewTechnologies] = useState('Spring Boot, React, Docker, Kubernetes');
  const [newMaxStudents, setNewMaxStudents] = useState(2);
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/subjects', { params });
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsAndGroups = async () => {
    try {
      const [appsRes, groupsRes] = await Promise.allSettled([
        api.get('/applications'),
        api.get('/groups')
      ]);
      if (appsRes.status === 'fulfilled') {
        setUserApplications(appsRes.value.data || []);
      }
      if (groupsRes.status === 'fulfilled') {
        setGroups(groupsRes.value.data || []);
      }
    } catch (err) {
      console.error('Error fetching applications or groups:', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [typeFilter, search]);

  useEffect(() => {
    fetchApplicationsAndGroups();
  }, []);

  const handleOpenApply = (subject) => {
    setSelectedSubject(subject);
    setSelectedGroupId('');
    setPriorityOrder(1);
    setMotivation('');
    setApplyError('');
    setApplySuccess(false);
    setShowApplyModal(true);
  };

  const handleOpenDetails = (subject) => {
    setSelectedSubject(subject);
    setShowDetailsModal(true);
  };

  const handleSubmitApply = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    setApplySubmitting(true);
    setApplyError('');

    try {
      await api.post('/applications', {
        subjectId: selectedSubject.id,
        groupId: selectedGroupId ? selectedGroupId : null,
        priorityOrder: parseInt(priorityOrder),
        motivation
      });
      setApplySuccess(true);
      fetchApplicationsAndGroups();
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erreur lors du dépôt de la candidature';
      setApplyError(typeof msg === 'string' ? msg : 'Erreur serveur');
    } finally {
      setApplySubmitting(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError('');

    try {
      await api.post('/subjects', {
        title: newTitle,
        type: newType,
        filiere: newFiliere,
        niveau: newNiveau,
        description: newDescription,
        objectives: newObjectives,
        technologies: newTechnologies,
        maxStudentsPerGroup: parseInt(newMaxStudents),
        maxGroups: 1,
        deadline: newDeadline || null
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewObjectives('');
      fetchSubjects();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erreur lors de la création du sujet';
      setCreateError(typeof msg === 'string' ? msg : 'Erreur');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const isApplied = (subjectId) => {
    return userApplications.some(app => app.subjectId === subjectId);
  };

  const getApplicationForSubject = (subjectId) => {
    return userApplications.find(app => app.subjectId === subjectId);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-emsi-700" />
            <span>Sujets de Projets & PFE (EMSI)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explorez les sujets académiques proposés par les enseignants de l'EMSI et postulez selon vos compétences.
          </p>
        </div>

        {/* Professor Action Button */}
        {(isProf || isAdmin) && (
          <button
            onClick={() => setShowCreateModal(true)}
            type="button"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer un nouveau sujet</span>
          </button>
        )}
      </div>

      {/* Filters & Search bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, technologie (ex: Kafka, Spring), mots-clés..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 focus:border-transparent"
          />
        </div>

        {/* Type Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {[
            { id: 'ALL', label: 'Tous les sujets' },
            { id: 'PFE', label: 'PFE (5ème année)' },
            { id: 'PFA', label: 'PFA (4ème année)' },
            { id: 'PROJET_MODULE', label: 'Projets de Module' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                typeFilter === item.id
                  ? 'bg-emsi-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Cards Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block w-8 h-8 border-4 border-emsi-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-500 font-medium">Chargement des sujets EMSI en cours...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Aucun sujet trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Aucun sujet ne correspond à vos critères de recherche. Essayez de réinitialiser vos filtres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const applied = isApplied(subject.id);
            const app = getApplicationForSubject(subject.id);
            const isFull = subject.status === 'AFFECTE' || subject.assignedGroupsCount >= subject.maxGroups;

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badge: Type & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      subject.type === 'PFE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : subject.type === 'PFA'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {subject.type} • {subject.niveau || '5ème année'}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isFull
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isFull ? 'Affecté' : 'Disponible'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {subject.title}
                  </h3>

                  {/* Professor Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emsi-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {subject.professorName ? subject.professorName.charAt(0) : 'P'}
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate leading-none">
                        Prof. {subject.professorName || 'Enseignant EMSI'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {subject.professorEmail}
                      </p>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Technologies tags */}
                  {subject.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {subject.technologies.split(',').map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Équipe : max {subject.maxStudentsPerGroup} étudiant{subject.maxStudentsPerGroup > 1 ? 's' : ''}
                    </span>
                    {subject.deadline && (
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Délai : {new Date(subject.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetails(subject)}
                      type="button"
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                    >
                      Détails
                    </button>

                    {!isProf && (
                      applied ? (
                        <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Choix envoyé</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenApply(subject)}
                          type="button"
                          disabled={isFull}
                          className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                            isFull
                              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                              : 'bg-emsi-700 hover:bg-emsi-800'
                          }`}
                        >
                          <span>Choisir ce sujet</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>

                  {applied && app && (
                    <div className="text-[10px] text-center text-slate-500 font-medium">
                      Statut : <span className="font-bold text-emsi-700 uppercase">{app.status}</span>
                      {app.groupName && ` • Groupe : ${app.groupName}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Apply / Choose Subject */}
      {showApplyModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emsi-700 bg-emsi-50 px-2 py-0.5 rounded-full">
                  Candidature PFE / PFA • EMSI
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedSubject.title}
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold">Votre choix a été enregistré avec succès !</p>
                <p className="text-xs text-emerald-700">Le professeur responsable examinera votre candidature.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApply} className="space-y-4">
                {applyError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                {/* Candidate identity reminder */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Étudiant :</span>
                    <span className="font-bold text-slate-800">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Matricule :</span>
                    <span className="font-mono text-slate-800">{user?.matricule || user?.studentIdentifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Filière / Niveau :</span>
                    <span className="font-semibold text-slate-800">{user?.filiere} ({user?.niveau})</span>
                  </div>
                </div>

                {/* Select Group (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidature individuelle ou en groupe :
                  </label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                  >
                    <option value="">👤 Candidature Individuelle</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        👥 Groupe : {g.name} (Leader: {g.leaderName})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Vous n'avez pas encore de groupe ? Créez-en un dans la section "Mes Groupes".
                  </p>
                </div>

                {/* Priority order */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ordre de priorité du vœu :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPriorityOrder(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          priorityOrder === num
                            ? 'bg-emsi-700 text-white border-emsi-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Choix n° {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motivation Letter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Motivation & Technologies maîtrisées (Optionnel) :
                  </label>
                  <textarea
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Expliquez brièvement votre intérêt pour ce sujet et les compétences techniques que vous apporterez..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={applySubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-emsi-700 hover:bg-emsi-800 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{applySubmitting ? 'Envoi...' : 'Confirmer mon choix'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Subject Details */}
      {showDetailsModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  {selectedSubject.type} • {selectedSubject.niveau}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {selectedSubject.title}
                </h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-500 font-semibold block">Encadrant académique :</span>
                <p className="font-bold text-slate-900 text-sm">Prof. {selectedSubject.professorName}</p>
                <p className="text-slate-500">{selectedSubject.professorEmail}</p>
                <p className="text-slate-500 font-medium">{selectedSubject.filiere}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wide text-[11px]">
                  Description détaillée & Cahier des charges :
                </h4>
                <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-line">
                  {selectedSubject.description}
                </p>
              </div>

              {selectedSubject.objectives && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wide text-[11px]">
                    Objectifs & Livrables attendus :
                  </h4>
                  <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-line font-mono text-[11px]">
                    {selectedSubject.objectives}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wide text-[11px]">
                  Technologies et Frameworks requis :
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubject.technologies?.split(',').map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Taille d'équipe : max {selectedSubject.maxStudentsPerGroup} étudiant(s)
              </span>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-emsi-700 hover:bg-emsi-800 rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Subject (For Professor) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emsi-700 bg-emsi-50 px-2.5 py-0.5 rounded-full">
                  Espace Enseignant • Dépôt de Sujet
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Déposer un nouveau sujet de projet / PFE
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre du sujet :</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Conception et Déploiement d'une Plateforme Cloud-Native..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type de projet :</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                  >
                    <option value="PFE">PFE (5ème année)</option>
                    <option value="PFA">PFA (4ème année)</option>
                    <option value="PROJET_MODULE">Projet de Module</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Filière :</label>
                  <select
                    value={newFiliere}
                    onChange={(e) => setNewFiliere(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white"
                  >
                    <option value="Ingénierie Informatique et Réseaux">IIR</option>
                    <option value="Ingénierie Financière & Audit">IFA</option>
                    <option value="Génie Civil">Génie Civil</option>
                    <option value="Génie Électrique">Génie Électrique</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max étudiants / groupe :</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={newMaxStudents}
                    onChange={(e) => setNewMaxStudents(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technologies requises (séparées par des virgules) :</label>
                <input
                  type="text"
                  value={newTechnologies}
                  onChange={(e) => setNewTechnologies(e.target.value)}
                  placeholder="Ex: Spring Boot, React, Kafka, Docker, Kubernetes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description détaillée / Problématique :</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Décrivez les objectifs généraux du projet..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Objectifs & Livrables attendus :</label>
                <textarea
                  rows={2}
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                  placeholder="1. Architecture logicielle&#10;2. Déploiement CI/CD..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2 font-bold text-white bg-emsi-700 hover:bg-emsi-800 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{createSubmitting ? 'Publication...' : 'Publier le sujet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
