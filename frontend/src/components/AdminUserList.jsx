import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, BookOpen, Users, MapPin, SearchX } from 'lucide-react';
import api from '../api/client';
import { CAMPUSES, BACKEND_CAMPUS } from './AdminCampusPanel';
import { StudentStats } from './StudentStats';
import { StudentCardGrid, StudentResultList, BackToListButton } from './StudentCard';
import { StudentCardSkeleton } from './StudentCardSkeleton';
import { AdminStudentEditForm } from './AdminStudentEditForm';

const GREEN = '#15885a';

const VIEWS = {
  STUDENTS: { title: 'Étudiants', none: 'Aucun étudiant', role: 'STUDENT', icon: GraduationCap },
  PROFESSORS: { title: 'Professeurs', none: 'Aucun professeur', role: 'PROFESSOR', icon: BookOpen },
  ALL: { title: 'Tous les utilisateurs', none: 'Aucun utilisateur', role: null, icon: Users },
};

// Aucun résultat pour la recherche saisie
const NoResult = ({ label, query }) => (
  <div
    role="status"
    aria-live="polite"
    className="admin-form-in mx-auto max-w-md bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-8 text-center"
  >
    <span
      className="success-pop inline-flex items-center justify-center w-16 h-16 rounded-full"
      style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}
    >
      <SearchX className="w-8 h-8" />
    </span>
    <h3 className="mt-4 text-lg font-bold text-slate-800">{label} avec ces caractéristiques</h3>
    <p className="mt-1 text-sm text-slate-500 truncate">« {query.trim()} »</p>
  </div>
);

// Liste simple des utilisateurs d'un campus (étudiants / professeurs / tous)
export const AdminUserList = ({ view = 'STUDENTS', campus = 'ORANGER', search = '', searching = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Étudiant choisi dans la liste de résultats (affiche sa carte)
  const [selected, setSelected] = useState(null);
  // Étudiant en cours de modification (page formulaire)
  const [editing, setEditing] = useState(null);
  const config = VIEWS[view] || VIEWS.STUDENTS;
  const Icon = config.icon;
  const campusLabel = CAMPUSES.find((c) => c.id === campus)?.label || campus;

  useEffect(() => {
    let alive = true;
    api
      .get('/users')
      .then((res) => alive && setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const q = search.trim().toLowerCase();
  // Une saisie qui commence par "C-" est une recherche de matricule : il doit être complet et exact
  const looksLikeMatricule = /^c-/i.test(q);

  const rows = useMemo(() => {
    const code = BACKEND_CAMPUS[campus] || campus;
    return users
      .filter((u) => u.campus === code && u.role !== 'ADMIN' && (!config.role || u.role === config.role))
      .filter((u) => {
        if (!q) return true;
        if (looksLikeMatricule) return (u.matricule || '').toLowerCase() === q;
        return [u.firstName, u.lastName, `${u.firstName} ${u.lastName}`, u.email, u.matricule, u.filiere, u.niveau, u.matiere]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
  }, [users, campus, config.role, q, looksLikeMatricule]);

  // Recherche étudiants :
  //  1. matricule complet et exact (tous campus)  -> carte
  //  2. email complet et exact                    -> carte
  //  3. nom / prénom : 1 seul résultat -> carte, plusieurs -> liste (photo, nom prénom, matricule) puis clic -> carte
  const studentSearch = useMemo(() => {
    if (view !== 'STUDENTS' || !q) return { kind: null, list: [] };
    const students = users.filter((u) => u.role === 'STUDENT');
    const byMatricule = students.filter((u) => (u.matricule || '').toLowerCase() === q);
    if (byMatricule.length) return { kind: 'matricule', list: byMatricule };
    if (q.includes('@')) {
      const byEmail = students.filter((u) => (u.email || '').toLowerCase() === q);
      if (byEmail.length) return { kind: 'email', list: byEmail };
    }
    return { kind: 'nom', list: rows };
  }, [users, q, view, rows]);

  // Nouvelle saisie : on referme la carte ouverte depuis la liste
  useEffect(() => {
    setSelected(null);
    setEditing(null);
  }, [q]);

  // Après enregistrement : on met à jour la liste en mémoire (la carte affiche aussitôt les nouvelles valeurs)
  const handleSaved = (updated) => {
    setUsers((list) => list.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelected((cur) => (cur && cur.id === updated.id ? { ...cur, ...updated } : cur));
    setEditing(null);
  };

  if (view === 'STUDENTS' && !loading) {
    const { kind, list } = studentSearch;
    if (editing) return <AdminStudentEditForm student={editing} onCancel={() => setEditing(null)} onSaved={handleSaved} />;
    if (searching) return <StudentCardSkeleton />;
    if (selected) {
      return (
        <div>
          <BackToListButton onClick={() => setSelected(null)} />
          <StudentCardGrid students={[selected]} query={search} kind={kind || 'nom'} hideHeading onEdit={setEditing} />
        </div>
      );
    }
    if (kind === 'matricule' || kind === 'email') return <StudentCardGrid students={list} query={search} kind={kind} onEdit={setEditing} />;
    if (kind === 'nom' && list.length === 1) return <StudentCardGrid students={list} query={search} kind="nom" onEdit={setEditing} />;
    if (kind === 'nom' && list.length > 1) return <StudentResultList students={list} query={search} onSelect={setSelected} />;
    if (q && rows.length === 0) return <NoResult label={config.none} query={search} />;
    return <StudentStats rows={rows} campusLabel={campusLabel} />;
  }

  return (
    <section className="bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
            <Icon className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">{config.title}</h2>
            <p className="text-xs text-slate-600 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> EMSI {campusLabel}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ backgroundColor: GREEN }}>
          {rows.length}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600 py-8 text-center">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-600 py-8 text-center">{search.trim() ? `${config.none} avec ces caractéristiques.` : 'Aucun utilisateur pour ce campus.'}</p>
      ) : (
        <ul className="divide-y divide-white/70 rounded-xl bg-white/55 border border-white/80 overflow-hidden">
          {rows.map((u) => (
            <li key={u.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: GREEN }}
              >
                {(u.firstName?.[0] || '').toUpperCase()}
                {(u.lastName?.[0] || '').toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {u.firstName} {u.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
              <span className="text-xs font-medium text-slate-600 hidden sm:block">
                {u.role === 'STUDENT' ? [u.filiere, u.niveau].filter(Boolean).join(' · ') : u.matiere || ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
