import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { UserDetailModal } from '../components/UserDetailModal';
import { UserEditModal } from '../components/UserEditModal';
import { UserAvatar } from '../components/UserAvatar';
import usersApi from '../api/users';
import {
  GraduationCap,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const StudentsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCampus = searchParams.get('campus') || 'ALL';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCampus, setFilterCampus] = useState(initialCampus);
  const [filterFiliere, setFilterFiliere] = useState('ALL');
  const [filterNiveau, setFilterNiveau] = useState('ALL');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Sync campus filter if URL query param changes
  useEffect(() => {
    const campusParam = searchParams.get('campus');
    if (campusParam) {
      setFilterCampus(campusParam);
    }
  }, [searchParams]);

  const handleCampusChange = (newCampus) => {
    setFilterCampus(newCampus);
    const nextParams = new URLSearchParams(searchParams);
    if (newCampus === 'ALL') {
      nextParams.delete('campus');
    } else {
      nextParams.set('campus', newCampus);
    }
    setSearchParams(nextParams);
  };

  const handleUserUpdated = (updated) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setUserToEdit(null);
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usersApi.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des étudiants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await usersApi.deleteUser(userToDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      alert("Erreur lors de la suppression de l'étudiant.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const email = (s.email || '').toLowerCase();
    const matricule = (s.matricule || s.studentIdentifier || '').toLowerCase();

    const matchesSearch = fullName.includes(term) || email.includes(term) || matricule.includes(term);
    const matchesCampus = filterCampus === 'ALL' || s.campus === filterCampus;
    const matchesFiliere = filterFiliere === 'ALL' || s.filiere === filterFiliere;
    const matchesNiveau = filterNiveau === 'ALL' || (s.niveau && s.niveau.includes(filterNiveau));

    return matchesSearch && matchesCampus && matchesFiliere && matchesNiveau;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-[#15885a]" />
              <span>Annuaire Académique</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Liste des Élèves Ingénieurs EMSI ({filteredStudents.length} / {students.length})
            </h1>
            <p className="text-sm text-slate-500">
              Supervision des étudiants inscrits sur les campus EMSI Casablanca.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/users/new?role=STUDENT')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15885a] hover:bg-[#0f7048] text-white text-sm font-semibold shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Étudiant</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher nom, matricule..."
              className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <select
              value={filterCampus}
              onChange={(e) => handleCampusChange(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all"
            >
              <option value="ALL">Tous les campus</option>
              <option value="ORANGERS">EMSI Les Orangers</option>
              <option value="CFC">EMSI CFC</option>
              <option value="ROUDANI">EMSI Roudani</option>
              <option value="MAARIF">EMSI Maârif</option>
              <option value="MOULAY_YOUSSEF">EMSI Moulay Youssef</option>
            </select>
          </div>

          <div>
            <select
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all"
            >
              <option value="ALL">Toutes les filières</option>
              <option value="IIR">IIR (Informatique & Réseaux)</option>
              <option value="GESI">GESI (Génie Électrique)</option>
              <option value="IAII">IAII (Automatismes)</option>
              <option value="GI">GI (Génie Industriel)</option>
              <option value="GCBTP">GCBTP (Génie Civil)</option>
              <option value="IFA">IFA (Finance & Audit)</option>
            </select>
          </div>

          <div>
            <select
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] outline-none transition-all"
            >
              <option value="ALL">Tous les niveaux</option>
              <option value="1ère">1ère Année</option>
              <option value="2ème">2ème Année</option>
              <option value="3ème">3ème Année</option>
              <option value="4ème">4ème Année</option>
              <option value="5ème">5ème Année</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 text-[#15885a] animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-medium">Chargement des étudiants...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center text-rose-700 shadow-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Aucun étudiant trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aucun profil ne correspond aux critères de recherche actuels.
            </p>
            <button
              onClick={() => navigate('/admin/users/new?role=STUDENT')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15885a] text-white text-xs font-semibold shadow hover:bg-[#0f7048] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer un compte étudiant</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Étudiant</th>
                    <th className="py-3.5 px-4">Sexe</th>
                    <th className="py-3.5 px-4">Matricule</th>
                    <th className="py-3.5 px-4">Campus</th>
                    <th className="py-3.5 px-4">Filière</th>
                    <th className="py-3.5 px-4">Niveau</th>
                    <th className="py-3.5 px-4">Groupe</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={s} size="sm" showStoryRing={true} />
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                          {s.sexe === 'FEMME' ? 'Femme' : s.sexe === 'HOMME' ? 'Homme' : (s.sexe || '—')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-slate-700">
                        {s.matricule || s.studentIdentifier || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {s.campus || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-xs text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded-md border border-emerald-200">
                          {s.filiere || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-700">{s.niveau || '—'}</td>

                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {s.groupe || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setSelectedUser(s)}
                            title="Voir les détails"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setUserToEdit(s)}
                            title="Modifier les informations (popup)"
                            className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(s)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Show Details Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Edit User Modal Popup (rôle non modifiable) */}
      {userToEdit && (
        <UserEditModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le compte de{' '}
              <strong className="text-slate-900 font-semibold">
                {userToDelete.firstName} {userToDelete.lastName}
              </strong>{' '}
              ({userToDelete.email}) ? Cette action est irréversible.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                {deleting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Supprimer le compte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsListPage;
