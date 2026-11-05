import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  ShieldCheck,
  GraduationCap,
  Plus,
  Building
} from 'lucide-react';

export const AdminUsersView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'ARHRID Hamza', email: 'hamza.arhrid@emsi-edu.ma', role: 'STUDENT', matricule: 'C-2025-000564', filiere: 'IIR (5DSIO)', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 2, name: 'BENALI Karim', email: 'karim.benali@emsi-edu.ma', role: 'PROFESSOR', matricule: 'ENS-2026-042', filiere: 'Dép. Génie Logiciel', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 3, name: 'DIRECTION Pédagogique', email: 'admin@emsi-edu.ma', role: 'ADMIN', matricule: 'ADM-2026-001', filiere: 'Coordination Centrale', status: 'ACTIF', campus: 'Casablanca Siège' },
    { id: 4, name: 'BENNANI Yassine', email: 'yassine.bennani@emsi-edu.ma', role: 'STUDENT', matricule: 'C-2025-000565', filiere: 'IIR (5DSIO)', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 5, name: 'ALAMI Amina', email: 'amina.alami@emsi-edu.ma', role: 'PROFESSOR', matricule: 'ENS-2026-088', filiere: 'Dép. IA & Data Science', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 6, name: 'CHRAIBI Mehdi', email: 'mehdi.chraibi@emsi-edu.ma', role: 'STUDENT', matricule: 'C-2025-000570', filiere: 'IIR (5DSIO)', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 7, name: 'TAZI Mohammed', email: 'mohammed.tazi@emsi-edu.ma', role: 'PROFESSOR', matricule: 'ENS-2026-015', filiere: 'Dép. Management & SI', status: 'ACTIF', campus: 'Casablanca Orangers' },
    { id: 8, name: 'EL FASSI Sara', email: 'sara.elfassi@emsi-edu.ma', role: 'STUDENT', matricule: 'C-2025-000582', filiere: 'IIR (5DSIO)', status: 'ACTIF', campus: 'Casablanca Orangers' },
  ]);

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleUserStatus = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIF' ? 'SUSPENDU' : 'ACTIF' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Direction des Études</span>
            <span>›</span>
            <span className="text-slate-600 font-semibold">Gestion des Comptes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Annuaire & Gestion des Utilisateurs EMSI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervision des comptes étudiants, enseignants et coordination administrative.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Création de compte institutionnel')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau compte</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email ou matricule..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white font-medium"
            >
              <option value="ALL">Tous les rôles ({usersList.length})</option>
              <option value="STUDENT">Élèves Ingénieurs</option>
              <option value="PROFESSOR">Professeurs / Encadrants</option>
              <option value="ADMIN">Direction & Administration</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Utilisateur</th>
                <th className="px-3 py-3 text-left font-bold text-slate-700">Rôle</th>
                <th className="px-3 py-3 text-left font-bold text-slate-700">Matricule</th>
                <th className="px-3 py-3 text-left font-bold text-slate-700">Filière / Dép.</th>
                <th className="px-3 py-3 text-left font-bold text-slate-700">Campus</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">Statut</th>
                <th className="px-3 py-3 text-right font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                  </td>
                  <td className="px-3 py-3">
                    {u.role === 'STUDENT' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        <GraduationCap className="w-3 h-3 text-emerald-600" />
                        Élève Ingénieur
                      </span>
                    ) : u.role === 'PROFESSOR' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        <Users className="w-3 h-3 text-blue-600" />
                        Enseignant
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800">
                        <ShieldCheck className="w-3 h-3 text-purple-600" />
                        Administration
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-slate-700">{u.matricule}</td>
                  <td className="px-3 py-3 font-semibold text-slate-600">{u.filiere}</td>
                  <td className="px-3 py-3 text-slate-500">{u.campus}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                        u.status === 'ACTIF'
                          ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'ACTIF' ? 'Suspendre' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
