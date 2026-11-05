import React from 'react';
import { Scale, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DisciplinaryView = () => (
  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
        <Scale className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Mesures Disciplinaires</h2>
        <p className="text-xs text-slate-500">Statut disciplinaire et avertissements pédagogiques</p>
      </div>
    </div>

    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      <span>Situation exemplaire : Aucune sanction ni avertissement disciplinaire enregistré pour l'année 2026-2027.</span>
    </div>
  </div>
);

export const SurveyView = () => (
  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
        <Scale className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Questionnaire de Fin de Formation</h2>
        <p className="text-xs text-slate-500">Évaluation de la qualité d'enseignement et retour d'expérience</p>
      </div>
    </div>

    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
      Le questionnaire sera mis à votre disposition à la fin du semestre d'études par le service assurance qualité EMSI.
    </div>
  </div>
);
