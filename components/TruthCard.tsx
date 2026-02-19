
import React, { useState } from 'react';
import { TruthCardData } from '../types';

interface TruthCardProps {
  data: TruthCardData;
  onSubmit: (result: string) => void;
}

export const TruthCard: React.FC<TruthCardProps> = ({ data, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [energy, setEnergy] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [blockers, setBlockers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleBlocker = (b: string) => {
    setBlockers(prev => prev.includes(b) ? prev.filter(i => i !== b) : [...prev, b]);
  };

  const handleSubmit = () => {
    if (!energy || !time) return;
    const summary = `我确认我的真实情况：精力【${energy}】，每天预算【${time}】，主要阻碍是【${blockers.join(', ')}】。`;
    setIsSubmitted(true);
    setIsOpen(false);
    onSubmit(summary);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-400 border border-slate-100 flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>真实快照已确认</span>
      </div>
    );
  }

  return (
    <div className="my-6 animate-in fade-in slide-in-from-bottom-4">
      {!isOpen ? (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:border-orange-200 transition-all group">
           <div className="flex items-start gap-4 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             </div>
             <div>
               <h3 className="font-bold text-slate-800">需要确认「真实快照」</h3>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">教练已准备好你的现状评估。请确认精力、时间预算与核心阻碍，以便生成可行方案。</p>
             </div>
           </div>
           
           <button 
            onClick={() => setIsOpen(true)}
            className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
           >
             <span>展开配置</span>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 relative animate-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 p-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800">真实快照 (Truth Snapshot)</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">当前精力</label>
              <div className="flex flex-col gap-2">
                {data.energy.map(e => (
                  <button
                    key={e}
                    onClick={() => setEnergy(e)}
                    className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                      energy === e ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    {e}
                    {energy === e && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">时间预算</label>
              <div className="flex gap-2 flex-wrap">
                {data.time_budget.map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      time === t ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">当前阻碍 (多选)</label>
              <div className="flex gap-2 flex-wrap">
                {data.blockers.map(b => (
                  <button
                    key={b}
                    onClick={() => toggleBlocker(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      blockers.includes(b) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!energy || !time}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-200"
            >
              确认并生成选项
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
