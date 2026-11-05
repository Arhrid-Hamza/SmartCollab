import React, { useState } from 'react';
import { RotateCcw, ArrowRight, MousePointerClick, Calendar, Clock, AlertCircle } from 'lucide-react';

export const AbsencesView = () => {
  const [selectedSemester, setSelectedSemester] = useState('Semestre 1');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const absences = [
    { id: 1, date: '05/11/2026', course: 'Gouvernance des systemes d\'information', type: 'Normale', time: '16:15 – 17:45', status: 'Non justifiée', room: 'SC20(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 2, date: '05/11/2026', course: 'ERP', type: 'Normale', time: '14:00 – 16:00', status: 'Non justifiée', room: 'SC20(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 3, date: '28/10/2026', course: 'Business English', type: 'Normale', time: '10:15 – 11:45', status: 'Non justifiée', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 4, date: '28/10/2026', course: 'Communication Professionnelle 5', type: 'Normale', time: '08:30 – 10:00', status: 'Non justifiée', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 5, date: '23/10/2026', course: 'COMPETENCES D\'EMPLOYABILITE', type: 'Normale', time: '10:45 – 12:15', status: 'Non justifiée', room: 'SC12(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 6, date: '21/10/2026', course: 'Business English', type: 'Normale', time: '10:15 – 11:45', status: 'Non justifiée', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 7, date: '21/10/2026', course: 'Communication Professionnelle 5', type: 'Normale', time: '08:30 – 10:00', status: 'Non justifiée', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 8, date: '16/10/2026', course: 'Devops', type: 'Normale', time: '08:30 – 10:30', status: 'Non justifiée', room: 'SC34(0)', campus: 'Les Orangers', prof: 'Prof. Karim Benali' },
    { id: 9, date: '16/10/2026', course: 'COMPETENCES D\'EMPLOYABILITE', type: 'Normale', time: '10:45 – 12:15', status: 'Non justifiée', room: 'SC12(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
    { id: 10, date: '07/10/2026', course: 'Business English', type: 'Normale', time: '10:15 – 11:45', status: 'Non justifiée', room: 'SC14(0)', campus: 'Les Orangers', prof: 'Professeur Titulaire' },
  ];

  const filteredAbsences = absences.filter(item => {
    if (selectedCourseFilter !== 'ALL' && item.course !== selectedCourseFilter) return false;
    if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Mes absences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Absences aux cours S1 : consultez votre présence et le statut de vos absences.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Semestre</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emsi-600"
          >
            <option value="Semestre 1">Semestre 1</option>
            <option value="Semestre 2">Semestre 2</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Cours</label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emsi-600"
          >
            <option value="ALL">Tous les cours</option>
            <option value="Devops">Devops</option>
            <option value="ERP">ERP</option>
            <option value="Gouvernance des systemes d'information">Gouvernance des SI</option>
            <option value="Business English">Business English</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Statut</label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emsi-600"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="Non justifiée">Non justifiée</option>
            <option value="Justifiée">Justifiée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Absences
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight block">
            14
          </span>
          <span className="text-[11px] text-slate-500 font-medium">ce semestre</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Justifiées
          </span>
          <span className="text-3xl font-black text-emerald-600 tracking-tight block">
            0
          </span>
          <span className="text-[11px] text-slate-500 font-medium">absences</span>
        </div>

        <div className="bg-rose-50/70 rounded-2xl border border-rose-100 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 block">
            Non justifiées
          </span>
          <span className="text-3xl font-black text-rose-600 tracking-tight block">
            14
          </span>
          <span className="text-[11px] text-rose-600 font-medium">absences</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emsi-700" />
            <h2 className="text-sm font-bold text-slate-800">
              Historique des absences
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Cours</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Horaire</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAbsences.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedAbsence(row)}
                    className={`cursor-pointer transition-colors ${
                      selectedAbsence?.id === row.id
                        ? 'bg-emerald-50/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {row.course}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {row.type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {row.time}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 whitespace-nowrap">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center justify-end gap-1">
                        Voir <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Détail de l'absence
          </h3>

          {selectedAbsence ? (
            <div className="space-y-3 text-xs animate-fade-in">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Matière :</span>
                <p className="font-bold text-slate-900 text-sm">{selectedAbsence.course}</p>
                <p className="text-slate-500 font-medium">{selectedAbsence.campus} • Salle {selectedAbsence.room}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Date de la séance</span>
                  <span className="font-bold text-slate-800">{selectedAbsence.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Horaire</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAbsence.time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Type de séance</span>
                  <span className="font-semibold text-slate-800">{selectedAbsence.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Enseignant</span>
                  <span className="font-semibold text-slate-800">{selectedAbsence.prof}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Statut actuel</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                    {selectedAbsence.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                Pour justifier cette absence, veuillez déposer un certificat médical ou justificatif auprès du secrétariat pédagogique sous 48 heures.
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MousePointerClick className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sélectionnez une absence pour voir son détail.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
