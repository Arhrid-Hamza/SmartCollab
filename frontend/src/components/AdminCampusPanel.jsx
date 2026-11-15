import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, BookOpen, UserPlus, Users, MapPin, ChevronDown } from 'lucide-react';
import oranger from '../assets/campus/oranger.jpg';
import roudani from '../assets/campus/roudani.jpg';
import cfc from '../assets/campus/cfc.jpg';
import maarif from '../assets/campus/maarif.jpg';
import appLogo from '../assets/emsicollab-logo.png';
import api from '../api/client';
import CountUp from './CountUp';

export const CAMPUSES = [
  { id: 'ORANGER', label: 'Oranger', image: oranger },
  { id: 'ROUDANI', label: 'Roudani', image: roudani },
  { id: 'CFC', label: 'CFC', image: cfc },
  { id: 'MAARIF', label: 'Maarif', image: maarif },
];

const GREEN = '#15885a';

// Les ids du sélecteur ne correspondent pas toujours à l'enum Campus du backend (ex. ORANGER -> ORANGERS)
export const BACKEND_CAMPUS = { ORANGER: 'ORANGERS', ROUDANI: 'ROUDANI', CFC: 'CFC', MAARIF: 'MAARIF' };

// Petite carte "icône + compteur animé" pour les statistiques du campus
const StatTile = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/55 backdrop-blur-sm border border-white/80 shadow-sm px-2 py-3">
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: `${GREEN}1f`, color: GREEN }}>
      <Icon className="w-5 h-5" />
    </span>
    <CountUp
      from={0}
      to={value}
      mode="count"
      easing="easeOut"
      format="standard"
      separator=","
      direction="up"
      duration={1}
      delay={0}
      trigger="view"
      replayOnHover
      className="count-up-text leading-none"
      style={{ fontSize: '2.25rem', fontWeight: 700, color: GREEN }}
    />
    <span className="text-xs font-semibold text-slate-600">{label}</span>
  </div>
);

// Cadre unique : image du campus + sélecteur à gauche, boutons d'action à droite
export const AdminCampusPanel = ({ onAddStudent, onAddProfessor, onViewChange, onOpenList, initialCampus }) => {
  const [campusId, setCampusId] = useState(initialCampus || CAMPUSES[0].id);
  const [view, setView] = useState('ALL'); // STUDENTS | PROFESSORS | ALL
  const campus = CAMPUSES.find((c) => c.id === campusId);

  // Nombre d'étudiants / professeurs du campus sélectionné
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .get('/users')
        .then((res) => alive && setUsers(Array.isArray(res.data) ? res.data : []))
        .catch(() => {});
    load();
    window.addEventListener('focus', load);
    return () => {
      alive = false;
      window.removeEventListener('focus', load);
    };
  }, []);

  const counts = useMemo(() => {
    const code = BACKEND_CAMPUS[campusId] || campusId;
    const inCampus = users.filter((u) => u.campus === code);
    return {
      students: inCampus.filter((u) => u.role === 'STUDENT').length,
      professors: inCampus.filter((u) => u.role === 'PROFESSOR').length,
    };
  }, [users, campusId]);

  const chooseView = (next) => {
    setView(next);
    onViewChange?.({ view: next, campus: campusId });
    if (next === 'STUDENTS') onOpenList?.({ view: next, campus: campusId });
  };

  const pill =
    'w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15885a]';

  // Dégradé : blanc-vert très clair (Étudiants) -> vert plein (Tous)
  const STEPS = [
    { bg: '#eef7f2', fg: '#0b4a31', bd: '#cfe7da' },
    { bg: '#c9e5d6', fg: '#0b4a31', bd: '#a9d4bf' },
    { bg: '#97cdb1', fg: '#0b4a31', bd: '#7dbd9c' },
    { bg: '#3a9a70', fg: '#ffffff', bd: '#3a9a70' },
    { bg: '#15885a', fg: '#ffffff', bd: '#15885a' },
  ];
  const stepStyle = (i) => ({ '--cb-bg': STEPS[i].bg, '--cb-fg': STEPS[i].fg, '--cb-bd': STEPS[i].bd });

  const viewButton = (id, label, Icon, i) => (
    <button
      type="button"
      onClick={() => chooseView(id)}
      aria-pressed={view === id}
      style={stepStyle(i)}
      className={`cbtn ${pill}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const addButton = (label, onClick, i) => (
    <button type="button" onClick={onClick} style={stepStyle(i)} className={`cbtn ${pill}`}>
      <UserPlus className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <section className="bg-white/40 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(21,136,90,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 lg:gap-7">
        {/* Gauche : image + sélecteur de campus */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] lg:aspect-[16/9] shadow-inner">
            <img
              key={campus.id}
              src={campus.image}
              alt={`Campus EMSI ${campus.label}`}
              className="campus-img absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <span key={campus.id} className="campus-label inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                EMSI {campus.label}
              </span>
            </div>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Sélectionner un campus</span>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={campusId}
                onChange={(e) => {
                  setCampusId(e.target.value);
                  onViewChange?.({ view, campus: e.target.value });
                }}
                className="w-full appearance-none pl-9 pr-10 py-2.5 text-sm font-medium text-slate-800 bg-white/55 backdrop-blur-sm border border-white/80 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15885a] focus:border-[#15885a] cursor-pointer"
              >
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </label>
        </div>

        {/* Droite : boutons */}
        <div className="flex flex-col justify-center gap-3">
          <img
            src={appLogo}
            alt="EMSICollab"
            className="h-24 w-auto mx-auto mb-1 select-none"
            draggable="false"
          />
          <div className="cbtn-group flex flex-col gap-3">
          {viewButton('STUDENTS', 'Étudiants', GraduationCap, 0)}
          {viewButton('PROFESSORS', 'Professeurs', BookOpen, 1)}
          {addButton('Ajouter un étudiant', () => onAddStudent?.({ campus: campusId }), 2)}
          {addButton('Ajouter un professeur', () => onAddProfessor?.({ campus: campusId }), 3)}
          {viewButton('ALL', 'Tous', Users, 4)}
          </div>

          {/* Compteurs du campus sélectionné */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <StatTile icon={GraduationCap} value={counts.students} label="Étudiants" />
            <StatTile icon={BookOpen} value={counts.professors} label="Professeurs" />
          </div>
        </div>
      </div>
    </section>
  );
};
