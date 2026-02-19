
import React, { useState, useEffect } from 'react';
import { TodayTab } from './components/TodayTab';
import { CoachTab } from './components/CoachTab';
import { Task, Plan, TaskStatus, TaskType, PlanStatus, UserState, ChatMessage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'coach'>('today');
  const [userState, setUserState] = useState<UserState>(UserState.IDLE);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activePlans, setActivePlans] = useState<Plan[]>([]);
  const [userEnergy, setUserEnergy] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // 初始化与持久化
  useEffect(() => {
    const savedTasks = localStorage.getItem('evolve_tasks');
    const savedPlans = localStorage.getItem('evolve_plans');
    const savedState = localStorage.getItem('evolve_user_state');
    const savedMessages = localStorage.getItem('evolve_messages');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPlans) setActivePlans(JSON.parse(savedPlans));
    if (savedState) setUserState(savedState as UserState);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    
    // 逻辑落点：如果有正在执行的方案，默认去今日，否则去教练
    if (!savedState || savedState === UserState.IDLE) {
      setActiveTab('coach');
    } else {
      setActiveTab('today');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('evolve_tasks', JSON.stringify(tasks));
    localStorage.setItem('evolve_plans', JSON.stringify(activePlans));
    localStorage.setItem('evolve_user_state', userState);
    localStorage.setItem('evolve_messages', JSON.stringify(messages));
  }, [tasks, activePlans, userState, messages]);

  // 初始化欢迎语（如果消息为空）
  useEffect(() => {
    if (messages.length === 0) {
       const getInitialMessage = () => {
        switch (userState) {
          case UserState.IDLE: return "你好，我是 **Evolve**。我们不急着定计划。先告诉我，最近让你感到最困扰的是什么？";
          case UserState.EXECUTING: return "看到你在稳步执行。今天的关键任务完成得如何？";
          case UserState.REFLECTING: return "阶段结束了。回过头看，当初的假设还成立吗？";
          default: return "你好，我是 **Evolve**。准备好开始今天的深度对话了吗？";
        }
      };
      setMessages([{ role: 'model', text: getInitialMessage() }]);
    }
  }, [userState, messages.length]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus = t.status === TaskStatus.COMPLETED ? TaskStatus.ACTIVE : TaskStatus.COMPLETED;
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const incrementTask = (taskId: string, delta: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.type === TaskType.COUNTING) {
        const current = t.currentCount || 0;
        const target = t.targetCount || 1;
        const next = Math.max(0, current + delta);
        return { 
            ...t, 
            currentCount: next,
            status: next >= target ? TaskStatus.COMPLETED : TaskStatus.ACTIVE
        };
      }
      return t;
    }));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const activatePlan = (plan: Plan) => {
    // 1. 更新 Plan 状态
    const activatedPlan: Plan = { ...plan, status: PlanStatus.ACTIVE };
    setActivePlans(prev => [...prev, activatedPlan]);
    setUserState(UserState.EXECUTING);
    
    // 2. 将 Plan 的第一阶段投影为 Task
    const firstPhaseTasks: Task[] = plan.phases[0].tasks.map((pt, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      planId: plan.id,
      title: pt.title || '行动项',
      description: pt.description,
      source: 'ai_generated' as const,
      type: (pt.type as any) === '单次' ? TaskType.SINGLE : (pt.type as any) === '计数' ? TaskType.COUNTING : TaskType.SEQUENTIAL,
      status: TaskStatus.ACTIVE,
      difficulty: pt.difficulty as any,
      category: pt.category || '目标',
      expValue: 100,
      dueDate: new Date().toISOString().split('T')[0],
      currentCount: pt.type === TaskType.COUNTING ? 0 : undefined,
      targetCount: pt.targetCount,
      unit: pt.unit,
      isLocked: (pt.type as any) === '递进' && idx > 0,
    }));

    setTasks(prev => [...prev, ...firstPhaseTasks]);
    setActiveTab('today');
  };

  // 状态监测：如果所有 Plan 任务完成，触发复盘
  useEffect(() => {
    const activePlan = activePlans.find(p => p.status === PlanStatus.ACTIVE);
    if (activePlan) {
      const planTasks = tasks.filter(t => t.planId === activePlan.id);
      if (planTasks.length > 0 && planTasks.every(t => t.status === TaskStatus.COMPLETED)) {
        setUserState(UserState.REFLECTING);
      }
    }
  }, [tasks, activePlans]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      {/* 装饰层 */}
      <div className="absolute top-[-5%] left-[-10%] w-[100%] h-[30%] bg-indigo-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[80%] h-[40%] bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none" />

      {/* 状态指示器 */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60]">
        <div className="px-4 py-1.5 glass rounded-full flex items-center gap-2 border border-white/50 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${userState === UserState.EXECUTING ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">状态: {userState}</span>
        </div>
      </div>

      <main className="flex-1 pb-24 overflow-y-auto px-6 pt-12 relative z-10">
        {activeTab === 'today' ? (
          <TodayTab 
            tasks={tasks} 
            onToggle={toggleTask} 
            onIncrement={incrementTask} 
            onAddTask={addTask}
            onUpdateTask={updateTask}
            energy={userEnergy}
            onSetEnergy={setUserEnergy}
          />
        ) : (
          <CoachTab 
            userState={userState} 
            tasks={tasks} 
            onActivatePlan={activatePlan}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </main>

      {/* 导航栏 */}
      <nav className="fixed bottom-6 left-6 right-6 h-18 glass flex items-center justify-around px-4 z-50 max-w-md mx-auto rounded-[32px] shadow-2xl border border-white/40">
        <button 
          onClick={() => setActiveTab('today')}
          className={`flex-1 flex flex-col items-center transition-all py-2 rounded-2xl ${activeTab === 'today' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className={`w-6 h-6 transition-transform ${activeTab === 'today' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'today' ? 2.5 : 2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] font-black mt-1 uppercase tracking-widest">今日执行</span>
        </button>

        <button 
          onClick={() => setActiveTab('coach')}
          className={`flex-1 flex flex-col items-center transition-all py-2 rounded-2xl ${activeTab === 'coach' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className={`w-6 h-6 transition-transform ${activeTab === 'coach' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'coach' ? 2.5 : 2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[10px] font-black mt-1 uppercase tracking-widest">决策中枢</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
