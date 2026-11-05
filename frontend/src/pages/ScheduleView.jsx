import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  DoorOpen,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const ScheduleView = () => {
  const [viewMode, setViewMode] = useState('Jour');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Mon emploi du temps
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Consultez vos cours, horaires et salles.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-800">
            Jeudi 5 Novembre 2026
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            Aujourd'hui
          </span>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['Semaine', 'Jour', 'Mois', 'Liste'].map((mode) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">08:00</span>
              <div className="flex-1 h-12 border-t border-slate-100"></div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">09:00</span>
              <div className="flex-1 h-12 border-t border-slate-100"></div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">10:00</span>
              <div className="flex-1 border-t border-slate-100 pt-3">
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 font-mono">10:30 – 12:15</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Encadrement
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Projet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Les Orangers - Salle Fictive(0)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">12:00</span>
              <div className="flex-1 h-12 border-t border-slate-100"></div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">13:00</span>
              <div className="flex-1 h-12 border-t border-slate-100"></div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">14:00</span>
              <div className="flex-1 border-t border-slate-100 pt-3">
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 font-mono">14:00 – 16:00</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Normale
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    ERP
                  </h3>
                  <p className="text-xs text-slate-500">
                    Les Orangers - Salle SC20(0)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <span className="w-12 text-xs font-semibold text-slate-400 font-mono">16:00</span>
              <div className="flex-1 border-t border-slate-100 pt-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-mono">16:15 – 17:45</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700">
                      Normale
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Gouvernance des systemes d'information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Les Orangers - Salle SC20(0)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Jeudi 5 Novembre
            </h2>
            <p className="text-[11px] text-slate-500">3 cours aujourd'hui</p>
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
              Aujourd'hui
            </span>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>10:30 Projet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>14:00 ERP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>16:15 Gouvernance des systemes d'information</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-emsi-700 hover:text-emsi-800 flex items-center gap-1 cursor-pointer">
                Voir la journée complète <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
