import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

import orangersImg from '../assets/campuses/campus-orangers.jpg';
import cfcImg from '../assets/campuses/campus-cfc.jpg';
import roudaniImg from '../assets/campuses/campus-roudani.jpg';
import maarifImg from '../assets/campuses/campus-maarif.jpg';
import moulayYoussefImg from '../assets/campuses/campus-moulay-youssef.jpg';

export const CASABLANCA_CAMPUSES = [
  {
    id: 'ORANGERS',
    name: 'EMSI Les Orangers',
    shortName: 'Les Orangers',
    tagline: "Campus Historique d'Excellence",
    address: "Boulevard d'Anfa & Rue des Orangers, Casablanca",
    filieres: ['IIR', 'GESI', 'IFA'],
    badge: 'Pôle Ingénierie & Réseaux',
    established: '1986',
    description:
      "Campus fondateur de l'EMSI à Casablanca. Doté d'infrastructures technologiques de pointe et de laboratoires spécialisés en réseaux, télécoms et développement logiciel.",
    image: orangersImg,
    color: '#15885a',
  },
  {
    id: 'CFC',
    name: 'EMSI Casa Finance City',
    shortName: 'CFC',
    tagline: 'Pôle Haute Technologie & Fintech',
    address: 'Boulevard Main Street, Casa Finance City, Casablanca',
    filieres: ['IIR', 'IAII', 'GI', 'IFA'],
    badge: 'Intelligence Artificielle & Data',
    established: '2020',
    description:
      "Implanté au cœur du hub financier international de Casablanca, ce campus ultra-moderne forme aux technologies émergentes : IA, cybersécurité et ingénierie financière.",
    image: cfcImg,
    color: '#0d9488',
  },
  {
    id: 'ROUDANI',
    name: 'EMSI Roudani',
    shortName: 'Roudani',
    tagline: "Centre d'Ingénierie & Génie Civil",
    address: 'Boulevard Brahim Roudani, Casablanca',
    filieres: ['IIR', 'GI', 'GCBTP'],
    badge: 'BTP, Énergie & Industrie',
    established: '2004',
    description:
      "Campus de référence dédié aux grands ouvrages, au Génie Civil BTP et aux procédés industriels. Équipé de laboratoires d'essais mécaniques et de modélisation BIM.",
    image: roudaniImg,
    color: '#16a34a',
  },
  {
    id: 'MAARIF',
    name: 'EMSI Maârif',
    shortName: 'Maârif',
    tagline: 'Hub Systèmes Électroniques & Embarqués',
    address: 'Rue Abou El Kacem Kotbani, Quartier Maârif, Casablanca',
    filieres: ['IIR', 'IAII', 'GESI'],
    badge: 'Automatique & Robotique',
    established: '1998',
    description:
      "Focalisé sur l'Automatisme, l'Informatique Industrielle et les Systèmes Embarqués. Accueille des fablabs étudiants et incubateurs de projets robotiques innovants.",
    image: maarifImg,
    color: '#047857',
  },
  {
    id: 'MOULAY_YOUSSEF',
    name: 'EMSI Moulay Youssef',
    shortName: 'Moulay Youssef',
    tagline: 'Pôle Multi-Disciplinaire Ingénieur',
    address: 'Boulevard Moulay Youssef, Casablanca',
    filieres: ['GCBTP', 'GI', 'IIR'],
    badge: 'Polytechnique & Logistique',
    established: '2012',
    description:
      "Campus spacieux doté d'amphithéâtres connectés, d'espaces de coworking et de centres de recherche favorisant l'interdisciplinarité et l'entrepreneuriat.",
    image: moulayYoussefImg,
    color: '#0f766e',
  },
];

export const CampusCarousel = ({ students = [], professors = [] }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageErrorMap, setImageErrorMap] = useState({});
  const timerRef = useRef(null);

  const totalCampuses = CASABLANCA_CAMPUSES.length;
  const currentCampus = CASABLANCA_CAMPUSES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCampuses);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCampuses) % totalCampuses);
  };

  // Auto-rotation timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIndex]);

  // Statistics for active campus
  const campusStudents = students.filter(
    (s) => s.campus === currentCampus.id || (s.campus === 'ALL' && false)
  );
  const campusProfessors = professors.filter(
    (p) => p.campus === currentCampus.id || (p.campus === 'ALL' && false)
  );
  const studentsShare = students.length > 0
    ? Math.round((campusStudents.length / students.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#15885a]" />
            <span>Réseau EMSI Casablanca</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Universitaires & Statistiques en Direct
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sélectionnez ou faites tourner les campus pour observer la répartition académique.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Mettre en pause la rotation automatique' : 'Activer la rotation automatique'}
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? 'Rotation active' : 'En pause'}</span>
          </button>

          <button
            onClick={handlePrev}
            aria-label="Campus précédent"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Campus suivant"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Rotating Showcase */}
      <div
        className="relative h-72 sm:h-84 md:h-96 w-full flex items-center justify-center overflow-hidden py-4 select-none"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {CASABLANCA_CAMPUSES.map((campus, index) => {
          // Calculate relative position to activeIndex (-2, -1, 0, 1, 2)
          let offset = index - activeIndex;
          if (offset > 2) offset -= totalCampuses;
          if (offset < -2) offset += totalCampuses;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isFar = Math.abs(offset) >= 2;

          let transformClass = '';
          let opacityClass = 'opacity-0 pointer-events-none';
          let zIndexClass = 'z-0';

          if (isCenter) {
            transformClass = 'translate-x-0 scale-100';
            opacityClass = 'opacity-100 cursor-default';
            zIndexClass = 'z-20';
          } else if (isLeft) {
            transformClass = '-translate-x-[48%] sm:-translate-x-[55%] scale-90 sm:scale-95';
            opacityClass = 'opacity-55 hover:opacity-90 cursor-pointer';
            zIndexClass = 'z-10';
          } else if (isRight) {
            transformClass = 'translate-x-[48%] sm:translate-x-[55%] scale-90 sm:scale-95';
            opacityClass = 'opacity-55 hover:opacity-90 cursor-pointer';
            zIndexClass = 'z-10';
          } else {
            transformClass = offset < 0 ? '-translate-x-[90%] scale-75' : 'translate-x-[90%] scale-75';
            opacityClass = 'opacity-0 pointer-events-none';
            zIndexClass = 'z-0';
          }

          const hasImageError = imageErrorMap[campus.id];

          return (
            <div
              key={campus.id}
              onClick={() => setActiveIndex(index)}
              style={{
                transition: 'all 650ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className={`absolute w-[86%] sm:w-[68%] md:w-[58%] lg:w-[52%] h-full rounded-2xl overflow-hidden shadow-xl border ${
                isCenter
                  ? 'border-[#15885a] ring-4 ring-[#15885a]/15 shadow-[#15885a]/15'
                  : 'border-slate-200/90 shadow-slate-900/5'
              } ${transformClass} ${opacityClass} ${zIndexClass}`}
            >
              {/* Campus Image Background */}
              <div className="relative w-full h-full bg-slate-900">
                {!hasImageError ? (
                  <img
                    src={campus.image}
                    alt={campus.name}
                    onError={() =>
                      setImageErrorMap((prev) => ({ ...prev, [campus.id]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: campus.color }}
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center"
                  >
                    <Building2 className="w-16 h-16 opacity-40 mb-2" />
                    <span className="font-bold text-lg">{campus.name}</span>
                  </div>
                )}

                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

                {/* Badge Top Left */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#15885a] text-xs font-bold shadow-md">
                    <Building2 className="w-3.5 h-3.5 text-[#15885a]" />
                    <span>EMSI {campus.shortName}</span>
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/20">
                    Fondé en {campus.established}
                  </span>
                </div>

                {/* Badge Top Right */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow">
                    {campus.badge}
                  </span>
                </div>

                {/* Card Bottom Content */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                    {campus.name}
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1.5 leading-snug truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{campus.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {campus.filieres.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/25"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Selector Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
        {CASABLANCA_CAMPUSES.map((c, index) => {
          const isSelected = activeIndex === index;
          return (
            <button
              key={c.id}
              onClick={() => setActiveIndex(index)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#15885a] text-white shadow-md shadow-emerald-900/15 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-slate-400'
                }`}
              />
              <span>EMSI {c.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Campus Statistics Panel */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#15885a]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Statistiques du Campus Actif</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {currentCampus.name} ({currentCampus.shortName})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentCampus.tagline} — {currentCampus.address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/admin/students?campus=${currentCampus.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#15885a] hover:bg-[#0f7048] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Voir Étudiants de {currentCampus.shortName} ({campusStudents.length})</span>
            </button>
            <button
              onClick={() => navigate(`/admin/professors?campus=${currentCampus.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#15885a] text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Voir Professeurs de {currentCampus.shortName} ({campusProfessors.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards for this campus */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">Étudiants Inscrits</span>
              <GraduationCap className="w-4 h-4 text-[#15885a]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {campusStudents.length}
              </span>
              <span className="text-xs text-slate-400">sur {students.length}</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                style={{ width: `${studentsShare}%` }}
                className="bg-[#15885a] h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">Professeurs Actifs</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {campusProfessors.length}
              </span>
              <span className="text-xs text-slate-400">sur {professors.length}</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Encadrement PFE & Cours</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">Filières Dispensées</span>
              <Layers className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {currentCampus.filieres.length}
              </span>
              <span className="text-xs text-slate-400">spécialités</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {currentCampus.filieres.map((f) => (
                <span
                  key={f}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">Statut Campus</span>
              <Award className="w-4 h-4 text-[#15885a]" />
            </div>
            <div className="mt-2">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Opérationnel
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Campus Casablanca {currentCampus.id}
            </p>
          </div>
        </div>

        {/* Membres rattachés uniquement à ce campus */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#15885a]" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Utilisateurs inscrits à EMSI {currentCampus.shortName} ({campusStudents.length + campusProfessors.length})
              </h4>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
              Filtre actif : {currentCampus.name}
            </span>
          </div>

          {campusStudents.length === 0 && campusProfessors.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs text-slate-400">
                Aucun étudiant ni professeur n'est actuellement affecté au campus {currentCampus.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {campusStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/admin/students?campus=${currentCampus.id}`)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <UserAvatar user={s} size="sm" showStoryRing={true} />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#15885a] transition-colors">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {s.filiere || 'Filière non renseignée'} • {s.niveau || 'Niveau non renseigné'}
                    </p>
                  </div>
                </div>
              ))}

              {campusProfessors.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/professors?campus=${currentCampus.id}`)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <UserAvatar user={p} size="sm" showStoryRing={false} />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#15885a] transition-colors">
                        Pr. {p.firstName} {p.lastName}
                      </p>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Prof
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {p.matiere || p.filiere || 'Enseignant EMSI'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus Description & Detail */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-semibold block mb-1">
            À propos de {currentCampus.name} :
          </strong>
          {currentCampus.description}
        </div>
      </div>
    </div>
  );
};
