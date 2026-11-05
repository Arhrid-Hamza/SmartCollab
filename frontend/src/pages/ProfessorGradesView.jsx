import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Save,
  Search,
  Filter,
  GraduationCap,
  CalendarCheck
} from 'lucide-react';

export const ProfessorGradesView = () => {
  const [selectedClass, setSelectedClass] = useState('5DSIO G2');
  const [selectedModule, setSelectedModule] = useState('DevOps');

  const [students, setStudents] = useState([
    { id: 1, name: 'ARHRID Hamza', matricule: 'C-2025-000564', email: 'hamza.arhrid@emsi-edu.ma', attendance: 'PRESENT', cc1: 17, cc2: 18, project: 18.5 },
    { id: 2, name: 'BENNANI Yassine', matricule: 'C-2025-000565', email: 'yassine.bennani@emsi-edu.ma', attendance: 'PRESENT', cc1: 16, cc2: 16.5, project: 17 },
    { id: 3, name: 'CHRAIBI Mehdi', matricule: 'C-2025-000570', email: 'mehdi.chraibi@emsi-edu.ma', attendance: 'ABSENT', cc1: 14, cc2: 15, project: 15 },
    { id: 4, name: 'DAHBI Salma', matricule: 'C-2025-000578', email: 'salma.dahbi@emsi-edu.ma', attendance: 'PRESENT', cc1: 18, cc2: 19, project: 19 },
    { id: 5, name: 'EL FASSI Sara', matricule: 'C-2025-000582', email: 'sara.elfassi@emsi-edu.ma', attendance: 'PRESENT', cc1: 16.5, cc2: 17, project: 17.5 },
  ]);

  const [savedMessage, setSavedMessage] = useState('');

  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, attendance: s.attendance === 'PRESENT' ? 'ABSENT' : 'PRESENT' };
      }
      return s;
    }));
  };

  const handleGradeChange = (id, field, value) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: parseFloat(value) || 0 };
      }
      return s;
    }));
  };

  const handleSave = () => {
    setSavedMessage('Notes et présences enregistrées avec succès.');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Espace Enseignant</span>
            <span>›</span>
            <span className="text-slate-600 font-semibold">Saisie des Absences & Notes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Évaluations & Pointage des Présences
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sélectionnez la classe et le module pour saisir le contrôle continu et valider les présences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emsi-700 hover:bg-emsi-800 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Classe / Groupe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white font-medium"
            >
              <option value="5DSIO G2">5DSIO G2 (32 étudiants)</option>
              <option value="5DSIO G1">5DSIO G1 (30 étudiants)</option>
              <option value="4IIR G1">4IIR G1 (35 étudiants)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emsi-600 bg-white font-medium"
            >
              <option value="DevOps">DevOps & Cloud-Native</option>
              <option value="Architectures">Architectures Distribuées</option>
              <option value="ERP">ERP & Systèmes d'Information</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Séance du jour</label>
            <div className="px-3 py-2 text-xs rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-700 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emsi-700" />
              <span>Vendredi 6 Nov 2026 • 08:30 - 10:30 (SC34)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Étudiant</th>
                <th className="px-3 py-3 text-left font-bold text-slate-700">Matricule</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">Présence</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">CC1 (/20)</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">CC2 (/20)</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">Projet (/20)</th>
                <th className="px-3 py-3 text-center font-bold text-slate-700">Moyenne</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {students.map((student) => {
                const avg = ((student.cc1 + student.cc2 + student.project) / 3).toFixed(1);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <span className="text-[10px] text-slate-500">{student.email}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600 font-semibold">{student.matricule}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleAttendance(student.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          student.attendance === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {student.attendance === 'PRESENT' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Présent</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.cc1}
                        onChange={(e) => handleGradeChange(student.id, 'cc1', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg focus:ring-1 focus:ring-emsi-600 outline-none"
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.cc2}
                        onChange={(e) => handleGradeChange(student.id, 'cc2', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg focus:ring-1 focus:ring-emsi-600 outline-none"
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.project}
                        onChange={(e) => handleGradeChange(student.id, 'project', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg focus:ring-1 focus:ring-emsi-600 outline-none"
                      />
                    </td>
                    <td className="px-3 py-3 text-center font-black text-slate-900">
                      <span className={`px-2 py-0.5 rounded-md ${parseFloat(avg) >= 12 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                        {avg}/20
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
