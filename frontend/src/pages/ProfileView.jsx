import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  GraduationCap,
  Mail,
  Building,
  Users,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Code2
} from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
  const isProf = user?.role === 'PROFESSOR';

  const defaultSkills = [
    { name: 'Java / Spring Boot', level: 5, category: 'Backend' },
    { name: 'React.js & Tailwind CSS', level: 4, category: 'Frontend' },
    { name: 'Docker & Kubernetes', level: 4, category: 'DevOps' },
    { name: 'Apache Kafka', level: 3, category: 'Messaging' },
    { name: 'PostgreSQL', level: 4, category: 'Database' },
    { name: 'Python / Machine Learning', level: 3, category: 'Data & AI' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emsi-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-700/20 flex-shrink-0">
          {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {user?.lastName?.toUpperCase()} {user?.firstName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {user?.email}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-center sm:self-auto">
              {isProf ? 'Professeur Encadrant EMSI' : 'Élève Ingénieur EMSI'}
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
            {user?.bio || "Élève ingénieur en 5ème année IIR (5DSIO G2) à l'EMSI Les Orangers Casablanca. Spécialisé dans les architectures cloud-native et le génie logiciel moderne."}
          </p>
        </div>
      </div>

      {/* Profile Academic Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-emsi-700" />
            <span>Informations Académiques EMSI</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Matricule Étudiant</span>
              <span className="font-bold text-slate-900 font-mono">
                {user?.matricule || user?.studentIdentifier || 'C-2025-000564'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Filière d'ingénierie</span>
              <span className="font-bold text-slate-900">
                {user?.filiere || 'Ingénierie Informatique et Réseaux'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Niveau d'études</span>
              <span className="font-bold text-slate-900">
                {user?.niveau || (isProf ? 'Enseignant' : '5ème année')}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Classe & Groupe</span>
              <span className="font-bold text-slate-900">
                {user?.classeGroup || '5DSIO G2 - G22'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Campus</span>
              <span className="font-bold text-slate-900">
                {user?.campus || 'CASA ORANGERS'}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Année Universitaire</span>
              <span className="font-bold text-slate-900">
                {user?.academicYear || '2026-2027'}
              </span>
            </div>
          </div>
        </div>

        {/* Skills & Technologies Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Code2 className="w-4 h-4 text-emsi-700" />
            <span>Compétences Techniques & Spécialisations</span>
          </h3>

          <div className="space-y-3">
            {defaultSkills.map((sk, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{sk.name}</span>
                  <span className="text-emsi-700 font-bold">{sk.level}/5</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emsi-700 rounded-full transition-all duration-500"
                    style={{ width: `${(sk.level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
