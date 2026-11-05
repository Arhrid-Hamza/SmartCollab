import React from 'react';
import { Calendar, Clock, MapPin, DoorOpen, Users, CheckCircle2 } from 'lucide-react';

export const ScheduleView = () => {
  const scheduleData = [
    {
      day: 'Vendredi 6 Novembre 2026',
      courses: [
        {
          time: '08:30 - 10:30',
          subject: 'Devops & Cloud Infrastructure',
          room: 'SC34(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          prof: 'Prof. Karim Benali',
          status: 'À venir'
        },
        {
          time: '10:30 - 12:30',
          subject: 'Atelier Projet PFE & Encadrement',
          room: 'Fictive(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          prof: 'Prof. Karim Benali',
          status: 'À venir'
        },
        {
          time: '14:00 - 16:00',
          subject: 'Architectures Microservices & Kubernetes',
          room: 'SC20(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          prof: 'Prof. Karim Benali',
          status: 'À venir'
        }
      ]
    },
    {
      day: 'Jeudi 5 Novembre 2026',
      courses: [
        {
          time: '10:30 - 12:15',
          subject: 'Projet',
          room: 'Fictive(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          status: 'Terminé'
        },
        {
          time: '14:00 - 16:00',
          subject: 'ERP',
          room: 'SC20(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          status: 'Terminé'
        },
        {
          time: '16:15 - 17:45',
          subject: 'Gouvernance des systemes d\'information',
          room: 'SC20(0)',
          campus: 'Casablanca - Les Orangers',
          group: '5DSIO G2',
          status: 'Terminé'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emsi-700" />
          <span>Mon Emploi du Temps • EMSI Casa Orangers</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Planning hebdomadaire des séances de cours, laboratoires et ateliers de projets de fin d'études.
        </p>
      </div>

      <div className="space-y-6">
        {scheduleData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-emsi-700" />
              <span>{item.day}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {item.courses.map((course, cIdx) => (
                <div
                  key={cIdx}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                    course.status === 'Terminé'
                      ? 'bg-slate-50/70 border-slate-200/80'
                      : 'bg-emerald-50/30 border-emerald-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        course.status === 'Terminé'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {course.subject}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1 pt-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.campus}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Salle : {course.room}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Groupe : {course.group}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
