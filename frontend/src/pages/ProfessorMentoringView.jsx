import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Award,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';

export const ProfessorMentoringView = () => {
  const [selectedGroup, setSelectedGroup] = useState(1);

  const mentoredGroups = [
    {
      id: 1,
      name: 'Groupe CloudOps 5DSIO',
      members: ['Hamza Arhrid (5DSIO G2)', 'Yassine Bennani (5DSIO G2)'],
      subject: 'Plateforme Cloud-Native de Supervision DevOps & GitOps (EMSI Collab)',
      type: 'PFE',
      filiere: '5DSIO',
      status: 'En cours',
      progress: 65,
      defenseDate: '24 Juin 2027 à 10:30',
      room: 'Salle SC34 (Campus Orangers)',
      jury: ['Prof. Karim Benali (Président)', 'Dr. Amina Alami (Rapporteur)', 'M. Tazi (Examinateur)'],
      deliverables: [
        { name: 'Cahier des charges & Architecture', status: 'VALIDE', date: '15 Octobre 2026', grade: '18/20' },
        { name: 'Sprint 1 - Core Services & Auth JWT', status: 'VALIDE', date: '12 Novembre 2026', grade: '17.5/20' },
        { name: 'Sprint 2 - CI/CD Pipeline & Kubernetes', status: 'EN_COURS', date: '15 Janvier 2027', grade: 'En attente' },
        { name: 'Rapport Mi-Parcours & Démo V1', status: 'A_VENIR', date: '28 Février 2027', grade: '—' },
        { name: 'Mémoire Final & Code Source', status: 'A_VENIR', date: '30 Mai 2027', grade: '—' },
      ],
      meetings: [
        { date: 'Jeudi 5 Nov 2026 - 10:30', topic: 'Validation du modèle de données et sécurité JWT', room: 'Salle Fictive(0)' },
        { date: 'Jeudi 19 Nov 2026 - 11:00', topic: 'Revue d’avancement Sprint 1', room: 'Bureau Prof. B204' },
      ]
    },
    {
      id: 2,
      name: 'Binôme VisionIA',
      members: ['Sara El Fassi (5DSIO G1)', 'Mehdi Chraibi (5DSIO G1)'],
      subject: 'Système Intelligent de Détection des Anomalies par Vision par Ordinateur',
      type: 'PFE',
      filiere: '5DSIO',
      status: 'En cours',
      progress: 40,
      defenseDate: '25 Juin 2027 à 14:00',
      room: 'Salle SC20 (Campus Orangers)',
      jury: ['Prof. Karim Benali (Encadrant)', 'Prof. Mansouri (Rapporteur)'],
      deliverables: [
        { name: 'Cahier des charges & Dataset', status: 'VALIDE', date: '20 Octobre 2026', grade: '16/20' },
        { name: 'Modèle Baseline YOLOv8 & Benchmark', status: 'EN_COURS', date: '20 Décembre 2026', grade: 'En attente' },
        { name: 'Application Web & API Inférence', status: 'A_VENIR', date: '15 Mars 2027', grade: '—' },
      ],
      meetings: [
        { date: 'Mercredi 4 Nov 2026 - 15:00', topic: 'Nettoyage et annotation du dataset industriel', room: 'Lab 3' },
      ]
    }
  ];

  const currentGroup = mentoredGroups.find(g => g.id === selectedGroup) || mentoredGroups[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Espace Enseignant</span>
            <span>›</span>
            <span className="text-slate-600 font-semibold">Suivi de l'Encadrement & Soutenances</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Encadrement des Projets de Fin d'Études (PFE)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des livrables, réunions d'étape et planification des jurys de soutenance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Planifier une réunion d’encadrement')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Planifier un point d'étape</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Groupes Encadrés ({mentoredGroups.length})
          </h2>

          <div className="space-y-2">
            {mentoredGroups.map((g) => {
              const isSelected = g.id === selectedGroup;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emsi-600 bg-emsi-50/70 shadow-xs'
                      : 'border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {g.type} • {g.filiere}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-700">
                      {g.progress}%
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{g.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{g.subject}</p>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 mt-3 overflow-hidden">
                    <div
                      className="h-full bg-emsi-700 rounded-full transition-all duration-300"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentGroup.name}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-2">
                  {currentGroup.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Étudiants :</strong> {currentGroup.members.join(', ')}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Soutenance prévisionnelle</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{currentGroup.defenseDate}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">{currentGroup.room}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emsi-700" />
                <span>Jalons & Livrables PFE</span>
              </h3>

              <div className="overflow-hidden border border-slate-200/80 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-600">Livrable</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-600">Échéance</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-600">Statut</th>
                      <th className="px-3 py-2.5 text-left font-bold text-slate-600">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentGroup.deliverables.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{d.name}</td>
                        <td className="px-3 py-3 text-slate-500">{d.date}</td>
                        <td className="px-3 py-3">
                          {d.status === 'VALIDE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Validé
                            </span>
                          ) : d.status === 'EN_COURS' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                              <Clock className="w-3 h-3 text-amber-600" />
                              En cours
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">À venir</span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-bold text-slate-700">{d.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emsi-700" />
                <span>Réunions & Points d'avancement</span>
              </h3>

              <div className="space-y-2">
                {currentGroup.meetings.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{m.topic}</span>
                      <span className="text-[11px] text-slate-500">{m.date} • {m.room}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                      Confirmé
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
