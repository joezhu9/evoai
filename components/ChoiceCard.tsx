
import React, { useState } from 'react';
import { ChoiceCardData } from '../types';

interface ChoiceCardProps {
  data: ChoiceCardData;
  onSubmit: (result: string) => void;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ data, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    const selected = data.options.find(o => o.id === selectedId);
    if (!selected) return;
    const summary = `经过考虑，我选择方案【${selected.title}】。我相信“${selected.belief}”，并且愿意接受“${selected.tradeoff}”的代价。`;
    setIsSubmitted(true);
    setIsOpen(false);
    onSubmit(summary);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-400 border border-slate-100 flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>策略已选择</span>
      </div>
    );
  }

  return (
    <div className="my-6 animate-in fade-in slide-in-from-bottom-4">
      {!isOpen ? (
        <div className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-3xl shadow-sm border border-indigo-100 hover:shadow-md transition-all group">
           <div className="flex items-start gap-4 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
             </div>
             <div>
               <h3 className="font-bold text-slate-800">策略选项已生成</h3>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">教练基于你的情况，为你定制了 {data.options.length} 种不同强度的执行策略。请查看并做出选择。</p>
             </div>
           </div>
           
           <button 
            onClick={() => setIsOpen(true)}
            className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
           >
             <span>查看选项</span>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 relative animate-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 p-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800">选择工坊 (Choice Workshop)</h3>
          </div>

          <div className="space-y-4">
            {data.options.map(opt => (
              <div 
                key={opt.id}
                onClick={() => setSelectedId(opt.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedId === opt.id 
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md transform scale-[1.02]' 
                    : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-slate-800 text-sm">{opt.title}</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedId === opt.id ? 'border-indigo-500' : 'border-slate-200'
                  }`}>
                    {selectedId === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                  </div>
                </div>
                <p className="text-xs text-indigo-600 font-bold mb-3">"{opt.belief}"</p>
                <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-1">代价</span>
                    {opt.tradeoff}
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-1">投入</span>
                    ~{opt.daily_core_minutes}分钟/天 · {opt.timebox_days}天
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={!selectedId}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black mt-2 disabled:opacity-50 hover:bg-indigo-500 active:scale-95 transition-all shadow-xl shadow-indigo-200"
            >
              我选择尝试这个
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
