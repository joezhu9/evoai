
import React, { useState } from 'react';
import { Plan } from '../types';

interface PlanPreviewCardProps {
  plan: Plan;
  onActivate: (plan: Plan) => void;
}

export const PlanPreviewCard: React.FC<PlanPreviewCardProps> = ({ plan, onActivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const handleActivate = () => {
    setIsActivated(true);
    setIsOpen(false);
    onActivate(plan);
  };

  if (isActivated) {
    return (
      <div className="bg-emerald-50 rounded-2xl p-4 text-xs text-emerald-600 border border-emerald-100 flex items-center gap-2">
         <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>方案已激活，请前往「今日执行」查看任务</span>
      </div>
    );
  }

  return (
    <div className="my-4 animate-in fade-in slide-in-from-bottom-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
             </div>
             <div className="text-left text-white">
               <h3 className="font-bold text-sm">点击预览「{plan.title}」</h3>
               <p className="text-[10px] text-slate-400">方案已生成，确认后开始执行</p>
             </div>
          </div>
          <svg className="w-5 h-5 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
           <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/20 hover:text-white/60 z-20"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <div className="absolute top-0 right-0 p-8 opacity-10">
             <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
             </svg>
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest opacity-80">方案预览</h2>
              <p className="text-[10px] opacity-60">确认后将生成行动项</p>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className="text-xs text-slate-300 mb-4 line-clamp-2">{plan.description}</p>
            
            <div className="bg-white/10 rounded-2xl p-3 mb-6 border border-white/10">
              <p className="text-[10px] font-bold text-emerald-200 uppercase mb-1">目标假设</p>
              <p className="text-xs italic leading-relaxed text-emerald-50">“{plan.goalHypothesis}”</p>
            </div>

            <div className="space-y-3 mb-8">
              {plan.phases.slice(0, 3).map((phase, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black bg-white/10 text-white`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 border-b border-white/10 pb-2">
                    <p className="text-xs font-semibold">{phase.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {phase.tasks.map((t, i) => (
                             <span key={i} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-300">{t.title}</span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleActivate}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <span>开始执行</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
