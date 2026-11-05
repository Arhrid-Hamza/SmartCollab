import React from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const AbsencesView = () => {
  const absencesList = [
    { date: '04/11/2026', time: '14:00 - 16:00', module: 'ERP & Odoo', hours: '2h', justified: false, status: 'Non justifiée' },
    { date: '28/10/2026', time: '08:30 - 10:30', module: 'Gouvernance des SI', hours: '2h', justified: true, status: 'Justifiée (Certificat)' },
    { date: '21/10/2026', time: '10:30 - 12:30', module: 'Devops & CI/CD', hours: '2h', justified: true, status: 'Justifiée' },
    { date: '14/10/2026', time: '16:15 - 18:15', module: 'Atelier PFE', hours: '2h', justified: false, status: 'Non justifiée' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-rose-600" />
            <span>Mes Absences • Suivi Pédagogique</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Récapitulatif des heures d'absence cumulées pour le semestre en cours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-2xl font-extrabold text-rose-600 block leading-none">14</span>
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Total Absences (h)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Détail des séances manquées</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Horaire</th>
                <th className="py-3 px-3">Matière / Module</th>
                <th className="py-3 px-3">Volume</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {absencesList.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-800">{row.date}</td>
                  <td className="py-3 px-3 text-slate-600">{row.time}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{row.module}</td>
                  <td className="py-3 px-3 text-slate-700">{row.hours}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.justified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {row.justified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {row.status}
                    </span>
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
