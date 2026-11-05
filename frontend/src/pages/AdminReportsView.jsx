import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  BarChart2,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';

export const AdminReportsView = () => {
  const reports = [
    { title: 'Procès-Verbal des Affectations PFE (Session Principale)', date: '01 Novembre 2026', filiere: 'Toutes les filières (IIR, IFA, GC, GE)', format: 'PDF / 1.4 MB' },
    { title: 'Matrice des Jurys & Salles de Soutenance (Juin 2027)', date: '28 Octobre 2026', filiere: 'Cycle Ingénieur 5ème année', format: 'Excel / 480 KB' },
    { title: 'Bilan d’Évaluation des Compétences & Suivi des Livrables', date: '15 Octobre 2026', filiere: 'IIR - Spécialité Cloud & DevOps', format: 'PDF / 820 KB' },
    { title: 'Liste d’Émargement des Étudiants et Absences Globales', date: '05 Novembre 2026', filiere: 'Campus Casablanca Orangers', format: 'Excel / 310 KB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Direction des Études</span>
            <span>›</span>
            <span className="text-slate-600 font-semibold">Bilans & Délibérations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Procès-Verbaux & Rapports Institutionnels
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Documents officiels, fiches d'émargement et synthèses de délibérations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Imprimer la synthèse</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  {r.filiere}
                </span>
                <span className="text-[10px] text-slate-400">{r.format}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">{r.title}</h3>
              <p className="text-[11px] text-slate-500">Généré le {r.date}</p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => alert(`Téléchargement de : ${r.title}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emsi-50 text-emsi-700 hover:bg-emsi-100 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
