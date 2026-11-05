import React from 'react';
import { Megaphone, Calendar, FileText, Bell, Sparkles } from 'lucide-react';

export const AnnouncementsView = () => {
  const announcements = [
    {
      title: 'Planning Global-Contrôles & Examens S1',
      date: '5 nov. 2026',
      author: 'Direction des Études EMSI',
      content: 'Veuillez trouver ci-joint le calendrier prévisionnel des évaluations continues et examens partiels du premier semestre pour toutes les promotions du cycle ingénieur.',
      isNew: true
    },
    {
      title: 'Ouverture officielle de la campagne de choix des sujets PFE & PFA 2026-2027',
      date: '3 nov. 2026',
      author: 'Commission PFE - Filière IIR',
      content: 'Les élèves ingénieurs de 4ème et 5ème année sont invités à consulter la liste des sujets proposés par le corps professoral et à soumettre leurs vœux (individuellement ou en équipe) avant la date limite.',
      isNew: true
    },
    {
      title: 'Hackathon Innovation & Cloud-Native Inter-Campus',
      date: '28 oct. 2026',
      author: 'Bureau des Projets & Innovation',
      content: 'Inscriptions ouvertes pour le grand hackathon annuel EMSI. De nombreux prix à la clé et un accompagnement pour transformer votre projet PFE en startup.',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emsi-700" />
          <span>Mes Annonces & Notes Pédagogiques</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Communications officielles de l'administration, des départements et des coordinateurs pédagogiques.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                {item.isNew && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Nouveau
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
                <span>•</span>
                <span className="font-semibold text-slate-600">{item.author}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
