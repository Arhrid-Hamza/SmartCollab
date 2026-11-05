import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  DoorOpen,
  Users,
  Calendar,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const ScheduleView = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(3);
  const [viewMode, setViewMode] = useState('Jour');

  const weekDays = [
    {
      name: 'Lundi',
      date: '2 Novembre 2026',
      courses: [
        { time: '08:30 – 10:30', title: 'Architectures Distribuées & Microservices', type: 'Normale', room: 'SC34(0)', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'indigo' },
        { time: '10:45 – 12:45', title: 'Deep Learning & Vision par Ordinateur', type: 'Laboratoire', room: 'Lab 3', campus: 'Les Orangers', prof: 'Mme Amina Alami', color: 'purple' },
        { time: '14:00 – 16:00', title: 'Business English 5', type: 'Normale', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Mme Bennani', color: 'blue' },
        { time: '16:15 – 18:15', title: 'Compétences d\'Employabilité & Soft Skills', type: 'Atelier', room: 'SC12(0)', campus: 'Les Orangers', prof: 'M. Tazi', color: 'emerald' },
      ]
    },
    {
      name: 'Mardi',
      date: '3 Novembre 2026',
      courses: [
        { time: '08:30 – 10:30', title: 'Cloud Computing & Orchestration Kubernetes', type: 'Laboratoire', room: 'Lab 2', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'indigo' },
        { time: '10:45 – 12:45', title: 'Sécurité des Architectures Cloud & DevSecOps', type: 'Normale', room: 'SC20(0)', campus: 'Les Orangers', prof: 'M. Mansouri', color: 'rose' },
        { time: '14:00 – 16:00', title: 'Big Data Streaming avec Apache Kafka & Flink', type: 'Laboratoire', room: 'Lab 1', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'indigo' },
        { time: '16:15 – 18:15', title: 'Atelier d\'Encadrement PFE', type: 'Encadrement', room: 'Salle Fictive(0)', campus: 'Les Orangers', prof: 'Commission PFE', color: 'amber' },
      ]
    },
    {
      name: 'Mercredi',
      date: '4 Novembre 2026',
      courses: [
        { time: '08:30 – 10:30', title: 'Gouvernance des Systèmes d\'Information & ITIL', type: 'Normale', room: 'SC20(0)', campus: 'Les Orangers', prof: 'M. Alami', color: 'blue' },
        { time: '10:45 – 12:45', title: 'Management Agile de Projet & Scrum', type: 'Normale', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Mme Tazi', color: 'emerald' },
        { time: '14:00 – 16:00', title: 'ERP & Solutions d\'Entreprise (Odoo / SAP)', type: 'Laboratoire', room: 'SC20(0)', campus: 'Les Orangers', prof: 'M. Benali', color: 'purple' },
        { time: '16:15 – 18:15', title: 'Intelligence Artificielle Générative & LLMs', type: 'Laboratoire', room: 'Lab 3', campus: 'Les Orangers', prof: 'Mme Amina Alami', color: 'purple' },
      ]
    },
    {
      name: 'Jeudi',
      date: '5 Novembre 2026',
      isToday: true,
      courses: [
        { time: '08:30 – 10:30', title: 'Conception d\'APIs Réactives & Spring WebFlux', type: 'Normale', room: 'SC34(0)', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'indigo' },
        { time: '10:30 – 12:15', title: 'Projet', type: 'Encadrement', room: 'Salle Fictive(0)', campus: 'Les Orangers', prof: 'Commission PFE', color: 'indigo' },
        { time: '14:00 – 16:00', title: 'ERP', type: 'Normale', room: 'SC20(0)', campus: 'Les Orangers', prof: 'M. Benali', color: 'indigo' },
        { time: '16:15 – 17:45', title: 'Gouvernance des systemes d\'information', type: 'Normale', room: 'SC20(0)', campus: 'Les Orangers', prof: 'M. Alami', color: 'slate' },
      ]
    },
    {
      name: 'Vendredi',
      date: '6 Novembre 2026',
      courses: [
        { time: '08:30 – 10:30', title: 'Devops', type: 'Normale', room: 'SC34(0)', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'emerald' },
        { time: '10:45 – 12:45', title: 'Atelier Suivi des Livrables & Revue de Code PFE', type: 'Encadrement', room: 'Salle Fictive(0)', campus: 'Les Orangers', prof: 'Prof. Karim Benali', color: 'indigo' },
        { time: '14:30 – 16:30', title: 'Séminaire d\'Innovation & Conférences Industrielles', type: 'Conférence', room: 'Amphi 1', campus: 'Les Orangers', prof: 'Intervenants Externes', color: 'amber' },
      ]
    },
    {
      name: 'Samedi',
      date: '7 Novembre 2026',
      courses: [
        { time: '09:00 – 12:00', title: 'Travaux Dirigés & Sprint Review des Projets Académiques', type: 'Atelier', room: 'Lab 4', campus: 'Les Orangers', prof: 'Coordination PFE', color: 'blue' }
      ]
    }
  ];

  const currentDay = weekDays[selectedDayIndex];

  const handlePrevDay = () => {
    setSelectedDayIndex(prev => (prev > 0 ? prev - 1 : weekDays.length - 1));
  };

  const handleNextDay = () => {
    setSelectedDayIndex(prev => (prev < weekDays.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Mon emploi du temps
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consultez l'ensemble de vos cours, ateliers de projets, laboratoires et salles pour la promotion 5DSIO.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {weekDays.map((d, idx) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedDayIndex === idx
                ? 'bg-emsi-700 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{d.name}</span>
            {d.isToday && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                selectedDayIndex === idx ? 'bg-white text-emsi-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Auj.
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-800">
            {currentDay.name} {currentDay.date}
          </span>

          {currentDay.isToday && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Aujourd'hui
            </span>
          )}
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['Semaine', 'Jour', 'Liste'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === mode
                  ? 'bg-emsi-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'Semaine' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emsi-700" />
            <span>Emploi du temps hebdomadaire complet (5DSIO G2)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekDays.map((day) => (
              <div key={day.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{day.name}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">{day.date}</span>
                </div>
                <div className="space-y-2">
                  {day.courses.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-emsi-700 font-mono">{c.time}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">{c.type}</span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 leading-snug">{c.title}</p>
                      <p className="text-[10px] text-slate-500">{c.room} • {c.prof}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : viewMode === 'Liste' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900 mb-2">Tous les modules du semestre (5ème année IIR)</h2>
          <div className="divide-y divide-slate-100">
            {weekDays.flatMap(d => d.courses.map(c => ({ ...c, dayName: d.name }))).map((c, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{c.dayName} • {c.time}</span>
                  <p className="font-bold text-slate-900 text-sm">{c.title}</p>
                  <p className="text-slate-500">{c.prof} • {c.campus} - Salle {c.room}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 self-start sm:self-center">
                  {c.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="space-y-3 divide-y divide-slate-100">
              {currentDay.courses.map((course, idx) => (
                <div key={idx} className="pt-3 flex items-start gap-4">
                  <span className="w-24 text-xs font-bold text-slate-500 font-mono pt-3">
                    {course.time.split('–')[0]?.trim()}
                  </span>
                  <div className="flex-1 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 font-mono">
                        {course.time}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {course.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {course.title}
                    </h3>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p>{course.campus} - Salle {course.room}</p>
                      <p className="text-slate-500 font-medium">Enseignant : {course.prof}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                {currentDay.name} {currentDay.date}
              </h2>
              <p className="text-[11px] text-slate-500">{currentDay.courses.length} séances au programme</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Prochain cours
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Dans 10 h 2
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Devops
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>ven. 6 nov. - 08:30 – 10:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Les Orangers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>SC34(0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>5DSIO G2</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Voir le détail de la séance
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Programme de la journée
              </span>
              <div className="space-y-2 text-xs text-slate-600">
                {currentDay.courses.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                    <span className="truncate">{c.time.split('–')[0]} {c.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
