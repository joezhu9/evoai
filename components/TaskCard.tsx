
import React from 'react';
import { Task, TaskType, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onIncrement?: (id: string, delta: number) => void;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onIncrement, onEdit }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isLocked = task.isLocked;

  return (
    <div className={`p-4 rounded-2xl mb-3 flex items-center gap-4 transition-all duration-300 ${
      isCompleted ? 'bg-emerald-50/50 opacity-60 border-emerald-100' : 'bg-white shadow-sm border border-slate-100 hover:shadow-md'
    } ${isLocked ? 'grayscale opacity-40 cursor-not-allowed bg-slate-50' : ''}`}>
      
      {task.type !== TaskType.COUNTING ? (
        <button
          disabled={isLocked}
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isCompleted 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-slate-200 hover:border-indigo-400'
          }`}
        >
          {isCompleted && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isLocked && (
            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
            </svg>
          )}
        </button>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center bg-indigo-50 rounded-lg">
            <span className="text-indigo-600 text-[10px] font-black">#</span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {task.title}
          </h3>
          {task.type === TaskType.RECURRING && <span className="text-[10px] text-blue-500 bg-blue-50 px-1 rounded">循环</span>}
          {isLocked && <span className="text-[9px] bg-slate-200 px-1 rounded text-slate-500">锁定</span>}
        </div>
        {task.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
        )}

        {task.type === TaskType.COUNTING && !isCompleted && !isLocked && (
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-400 transition-all duration-300" 
                style={{ width: `${Math.min(100, ((task.currentCount || 0) / (task.targetCount || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5">
               <button 
                onClick={() => onIncrement?.(task.id, -1)}
                className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs hover:bg-slate-200"
               >-</button>
               <span className="text-[10px] font-bold text-slate-600 min-w-[2.5rem] text-center">
                 {task.currentCount}/{task.targetCount} {task.unit}
               </span>
               <button 
                onClick={() => onIncrement?.(task.id, 1)}
                className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs hover:bg-indigo-100"
               >+</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
          isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {task.category}
        </div>
        
        {!isLocked && (
          <button 
            onClick={() => onEdit?.(task)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
