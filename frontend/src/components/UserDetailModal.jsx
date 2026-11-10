import React from 'react';
import { X, Mail, Building2, Award, BookOpen, Layers, Users, Calendar, Hash } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

export const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const isStudent = user.role === 'STUDENT';
  const isProf = user.role === 'PROFESSOR';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with EMSI Green banner */}
        <div className="relative bg-gradient-to-r from-[#15885a] to-[#0e5f3e] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="xl" showStoryRing={true} className="bg-white" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  {user.role === 'STUDENT' ? 'Élève Ingénieur' : user.role === 'PROFESSOR' ? 'Professeur' : 'Administrateur'}
                </span>
                {user.campus && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100">
                    Campus {user.campus}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-white/80 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Matricule
              </span>
              <p className="text-sm font-semibold text-slate-900 font-mono">
                {user.matricule || user.studentIdentifier || 'Non renseigné'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Campus EMSI
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {user.campus === 'ALL' ? 'Tous les campus (Supervision)' : `EMSI ${user.campus || 'Non assigné'}`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                Filière EMSI
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {user.filiere ? `${user.filiere}` : 'Non renseignée'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Niveau
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {user.niveau || 'Non spécifié'}
              </p>
            </div>

            {isStudent && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Groupe TD/TP
                </span>
                <p className="text-sm font-semibold text-emerald-700">
                  {user.groupe || 'Non affecté à un groupe'}
                </p>
              </div>
            )}

            {isProf && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Matière(s) & Modules dispensés
                </span>
                <p className="text-sm font-semibold text-emerald-800">
                  {user.matiere || 'Non renseigné'}
                </p>
              </div>
            )}
          </div>

          {user.bio && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Biographie / Remarques</span>
              <p className="text-xs text-slate-700 leading-relaxed italic">{user.bio}</p>
            </div>
          )}

          {user.createdAt && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5" />
              <span>Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
