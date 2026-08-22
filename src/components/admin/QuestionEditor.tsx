import React, { useState } from 'react';
import type { Question, QuestionTopic, QuestionType, DifficultyTier } from '../../types/game';
import { Plus, Trash2, Edit3, Save, Download, Upload, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface QuestionEditorProps {
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ questions, onSaveQuestions }) => {
  const [questionList, setQuestionList] = useState<Question[]>(questions);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateNew = () => {
    soundEngine.playClick();
    setEditingQuestion({
      id: `custom-${Date.now()}`,
      topic: 'Arrays',
      type: 'mcq',
      difficulty: 'medium',
      question: '',
      codeSnippet: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      hint: '',
      points: 200,
    });
  };

  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.question || !editingQuestion.correctAnswer) return;

    soundEngine.playSuccess();
    const updated = [...questionList];
    const idx = updated.findIndex((q) => q.id === editingQuestion.id);

    if (idx >= 0) {
      updated[idx] = editingQuestion as Question;
    } else {
      updated.push(editingQuestion as Question);
    }

    setQuestionList(updated);
    onSaveQuestions(updated);
    setEditingQuestion(null);
    setSuccessMsg('QUESTION BANK SYNCHRONIZED SUCCESSFULLY.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id: string) => {
    soundEngine.playClick();
    const updated = questionList.filter((q) => q.id !== id);
    setQuestionList(updated);
    onSaveQuestions(updated);
  };

  const exportJSON = () => {
    soundEngine.playClick();
    const jsonStr = JSON.stringify(questionList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Web_of_Doom_QuestionBank_${Date.now()}.json`;
    a.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed)) {
          setQuestionList(parsed);
          onSaveQuestions(parsed);
          soundEngine.playSuccess();
          setSuccessMsg('CUSTOM QUESTION BANK LOADED.');
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full font-mono text-xs">
      
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-slate-[#dfe2f0] font-bold text-base font-mono">
          QUESTION BANK EDITOR ({questionList.length} QUESTION ITEMS)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-[#181b25] border border-[#00eefc]/40 text-[#00eefc] hover:border-[#00eefc] flex items-center gap-1.5 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT JSON</span>
          </button>

          <label className="px-3 py-2 bg-[#181b25] border border-[#00ff66]/40 text-[#00ff66] hover:border-[#00ff66] flex items-center gap-1.5 cursor-pointer font-mono">
            <Upload className="w-3.5 h-3.5" />
            <span>IMPORT JSON</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-[#00ff66] text-[#003911] font-bold flex items-center gap-1.5 btn-flicker uppercase font-mono shadow-[0_0_15px_rgba(0,255,102,0.4)]"
          >
            <Plus className="w-4 h-4" />
            <span>ADD QUESTION</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] flex items-center gap-2 font-bold animate-pulse font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor Form */}
      {editingQuestion && (
        <form onSubmit={handleSaveQuestionForm} className="glass-card p-6 border border-[#00eefc]/40 mb-6 space-y-4 font-mono">
          <h4 className="font-bold text-sm text-[#00eefc] uppercase border-b border-slate-800 pb-2">
            EDIT QUESTION ITEM [{editingQuestion.id}]
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">TOPIC</label>
              <select
                value={editingQuestion.topic || 'Arrays'}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value as QuestionTopic })}
                className="w-full bg-[#181b25] border border-slate-700 text-white p-2"
              >
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Stacks/Queues">Stacks/Queues</option>
                <option value="Recursion">Recursion</option>
                <option value="Time Complexity">Time Complexity</option>
                <option value="Basic Trees">Basic Trees</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">QUESTION TYPE</label>
              <select
                value={editingQuestion.type || 'mcq'}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value as QuestionType })}
                className="w-full bg-[#181b25] border border-slate-700 text-white p-2"
              >
                <option value="mcq">MCQ</option>
                <option value="output">Output Prediction</option>
                <option value="debugging">Code Debugging</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">DIFFICULTY & POINTS</label>
              <select
                value={editingQuestion.difficulty || 'medium'}
                onChange={(e) => {
                  const diff = e.target.value as DifficultyTier;
                  const pts = diff === 'easy' ? 100 : diff === 'medium' ? 200 : 300;
                  setEditingQuestion({ ...editingQuestion, difficulty: diff, points: pts });
                }}
                className="w-full bg-[#181b25] border border-slate-700 text-white p-2"
              >
                <option value="easy">Easy (100 PTS)</option>
                <option value="medium">Medium (200 PTS)</option>
                <option value="hard">Hard (300 PTS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">QUESTION TITLE / PROMPT</label>
            <textarea
              required
              value={editingQuestion.question || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
              rows={2}
              className="w-full bg-[#181b25] border border-slate-700 text-white p-2 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">CODE SNIPPET (OPTIONAL)</label>
            <textarea
              value={editingQuestion.codeSnippet || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, codeSnippet: e.target.value })}
              rows={3}
              className="w-full bg-[#0a0e17] border border-[#00eefc]/30 text-[#00eefc] font-mono p-2"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-slate-400 mb-1">OPTIONS (ONE PER LINE OR EXACT STRING MATCH)</label>
            {(editingQuestion.options || []).map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) => {
                  const opts = [...(editingQuestion.options || [])];
                  opts[i] = e.target.value;
                  setEditingQuestion({ ...editingQuestion, options: opts });
                }}
                className="w-full bg-[#181b25] border border-slate-700 text-white p-2 mb-2"
              />
            ))}
          </div>

          <div>
            <label className="block text-[#00ff66] font-bold mb-1">EXACT CORRECT ANSWER</label>
            <input
              type="text"
              required
              placeholder="Copy exact text of correct option"
              value={editingQuestion.correctAnswer || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
              className="w-full bg-[#181b25] border border-[#00ff66]/50 text-[#00ff66] p-2"
            />
          </div>

          <div>
            <label className="block text-[#ffda70] mb-1">HINT (COSTS -50 PTS TO REVEAL)</label>
            <input
              type="text"
              value={editingQuestion.hint || ''}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, hint: e.target.value })}
              className="w-full bg-[#181b25] border border-[#ffda70]/40 text-[#ffda70] p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingQuestion(null)}
              className="px-4 py-2 border border-slate-700 text-slate-400"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00ff66] text-[#003911] font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>SAVE QUESTION</span>
            </button>
          </div>
        </form>
      )}

      {/* Questions Table */}
      <div className="border border-slate-800 overflow-hidden bg-[#0a0e17]/90 font-mono">
        <table className="w-full text-left">
          <thead className="bg-[#1c1f29] text-[#00eefc] border-b border-slate-800 uppercase font-semibold">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">TOPIC</th>
              <th className="p-3">TYPE</th>
              <th className="p-3">QUESTION</th>
              <th className="p-3 text-center">PTS</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {questionList.map((q) => (
              <tr key={q.id} className="hover:bg-[#181b25]/50">
                <td className="p-3 font-bold text-slate-400">{q.id}</td>
                <td className="p-3 text-[#00ff66] font-semibold">{q.topic}</td>
                <td className="p-3 text-[#00eefc] uppercase">{q.type}</td>
                <td className="p-3 text-slate-200 truncate max-w-xs">{q.question}</td>
                <td className="p-3 text-center font-bold text-[#ffda70]">{q.points}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setEditingQuestion(q);
                    }}
                    className="p-1.5 bg-[#181b25] text-[#00eefc] border border-slate-700 hover:border-[#00eefc]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 bg-red-950/50 text-red-400 border border-red-900 hover:border-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
