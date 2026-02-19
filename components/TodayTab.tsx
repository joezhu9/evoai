
import React, { useState } from 'react';
import { Task, TaskType, TaskStatus, Difficulty } from '../types';
import { TaskCard } from './TaskCard';

interface TodayTabProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onIncrement: (id: string, delta: number) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  energy: string;
  onSetEnergy: (e: any) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ tasks, onToggle, onIncrement, onAddTask, onUpdateTask, energy, onSetEnergy }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      source: 'user_created',
      type: TaskType.SINGLE,
      status: TaskStatus.ACTIVE,
      difficulty: Difficulty.MEDIUM,
      category: '日常',
      expValue: 50,
      dueDate: new Date().toISOString().split('T')[0],
    };

    onAddTask(task);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onUpdateTask(editingTask);
      setEditingTask(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">9月12日 · 星期五</p>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">进化进行中</h1>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center min-w-[4rem]">
          <span className="text-xl font-black text-indigo-600 leading-none">{progress}%</span>
          <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">完成率</p>
        </div>
      </header>

      {/* 精力看板 */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <span className="text-lg font-black text-slate-800">{tasks.length}</span>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-1">总任务</span>
        </div>
        <button 
          onClick={() => onSetEnergy(energy === 'High' ? 'Medium' : energy === 'Medium' ? 'Low' : 'High')}
          className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100 flex flex-col items-center transition-transform active:scale-95"
        >
            <span className={`text-lg font-black ${energy === 'High' ? 'text-emerald-600' : energy === 'Medium' ? 'text-indigo-600' : 'text-orange-600'}`}>
                {energy === 'High' ? '极佳' : energy === 'Medium' ? '良好' : '疲惫'}
            </span>
            <span className="text-[9px] uppercase font-bold text-indigo-300 tracking-widest mt-1">当前精力</span>
        </button>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <span className="text-lg font-black text-slate-800">12天</span>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-1">连续进化</span>
        </div>
      </section>

      {/* 任务区域 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">待办行动项</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="py-20 text-center bg-white/40 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <p className="text-slate-400 text-xs font-medium px-10 leading-relaxed">当前没有活跃任务。前往决策中枢与教练开启新的对话。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={onToggle} 
                onIncrement={onIncrement} 
                onEdit={(t) => setEditingTask({...t})}
              />
            ))}
          </div>
        )}
      </section>

      {/* 快速添加 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-24 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black">记录新想法</h3>
               <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
             </div>
             <form onSubmit={handleQuickAdd}>
                <input 
                  autoFocus
                  type="text"
                  placeholder="你想做什么？"
                  className="w-full text-lg border-b-2 border-slate-100 py-3 mb-10 focus:outline-none focus:border-indigo-600 transition-all font-medium"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  存入行动池
                </button>
             </form>
          </div>
        </div>
      )}

      {/* 编辑 Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black">编辑行动项</h3>
               <button onClick={() => setEditingTask(null)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
             </div>
             <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">标题</label>
                  <input 
                    type="text"
                    className="w-full text-sm border-2 border-slate-50 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">描述</label>
                  <textarea 
                    className="w-full text-sm border-2 border-slate-50 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium h-20 resize-none"
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">分类</label>
                    <input 
                      type="text"
                      className="w-full text-xs border-2 border-slate-50 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
                      value={editingTask.category}
                      onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">难度</label>
                    <select 
                      className="w-full text-xs border-2 border-slate-50 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold appearance-none"
                      value={editingTask.difficulty}
                      onChange={(e) => setEditingTask({...editingTask, difficulty: e.target.value as Difficulty})}
                    >
                      <option value={Difficulty.LOW}>低</option>
                      <option value={Difficulty.MEDIUM}>中</option>
                      <option value={Difficulty.HIGH}>高</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">截止日期</label>
                  <input 
                    type="date"
                    className="w-full text-xs border-2 border-slate-50 bg-slate-50 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-indigo-600 transition-all mt-4"
                >
                  保存修改
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
