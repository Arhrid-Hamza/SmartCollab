import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Users,
  UserPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';

export const GroupsView = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Group Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [membersText, setMembersText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/groups');
      setGroups(res.data || []);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/groups', {
        name: groupName,
        filiere: user?.filiere || 'Ingénierie Informatique et Réseaux',
        niveau: user?.niveau || '5ème année',
        membersJson: membersText || `["${user?.firstName} ${user?.lastName} (Leader)"]`
      });
      setShowCreateModal(false);
      setGroupName('');
      setMembersText('');
      fetchGroups();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erreur lors de la création du groupe';
      setError(typeof msg === 'string' ? msg : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const parseMembers = (membersJson) => {
    if (!membersJson) return [];
    try {
      const parsed = JSON.parse(membersJson);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return membersJson.split(',').map(s => s.trim());
    }
    return [membersJson];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emsi-700" />
            <span>Groupes d'Étudiants PFE & Projets</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Formez des binômes ou trinômes pour postuler ensemble aux sujets de projets académiques EMSI.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          type="button"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Créer un groupe de projet</span>
        </button>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block w-8 h-8 border-4 border-emsi-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-500 font-medium">Chargement des groupes...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Aucun groupe constitué</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Soyez le premier à former une équipe avec vos camarades de promotion !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp) => {
            const members = parseMembers(grp.membersJson);
            const isUserLeader = grp.leaderId === user?.id || grp.leaderEmail === user?.email;

            return (
              <div
                key={grp.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {grp.niveau || '5ème année'} • {grp.filiere ? grp.filiere.substring(0, 3) : 'IIR'}
                    </span>
                    {isUserLeader && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                        Votre groupe
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {grp.name}
                  </h3>

                  {/* Leader info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chef de projet (Leader) :</span>
                    <p className="font-bold text-slate-800">{grp.leaderName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{grp.leaderEmail}</p>
                  </div>

                  {/* Members list */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Membres de l'équipe ({members.length}) :
                    </span>
                    <ul className="space-y-1 text-xs">
                      {members.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600 bg-slate-50/60 px-2.5 py-1 rounded-lg">
                          <User className="w-3.5 h-3.5 text-emsi-700 flex-shrink-0" />
                          <span className="font-medium truncate">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Créé le {new Date(grp.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="font-semibold text-emsi-700">Actif</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create Group */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emsi-700 bg-emsi-50 px-2 py-0.5 rounded-full">
                  Nouveau Groupe • EMSI
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Constituer une équipe de projet
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom du groupe :</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ex: 5DSIO Cloud & DevOps Team"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Membres de l'équipe (Noms & Prénoms) :
                </label>
                <textarea
                  rows={3}
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                  placeholder={`Exemple:\n${user?.firstName} ${user?.lastName} (Leader)\nOmar Mansouri\nSarah Tazi`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Indiquez un membre par ligne ou séparez par des virgules.
                </p>
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
                  disabled={submitting}
                  className="px-5 py-2 font-bold text-white bg-emsi-700 hover:bg-emsi-800 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Création...' : 'Créer le groupe'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
