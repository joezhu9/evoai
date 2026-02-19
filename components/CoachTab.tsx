
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../geminiService';
import { ChatMessage, Plan, UserState, CoachCard, Task } from '../types';
import { PlanPreviewCard } from './PlanCard';
import { TruthCard } from './TruthCard';
import { ChoiceCard } from './ChoiceCard';
import { marked } from 'marked';

interface CoachTabProps {
  userState: UserState;
  tasks: Task[];
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onActivatePlan: (plan: Plan) => void;
}

export const CoachTab: React.FC<CoachTabProps> = ({ userState, tasks, messages, setMessages, onActivatePlan }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 初始化语音
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
      };
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Speech recognition error:", e);
      }
    }
  };

  const processResponse = async (history: ChatMessage[], userInput: string) => {
    setIsLoading(true);
    try {
      const response = await sendMessage(history, userInput, userState, tasks);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text, 
        card: response.card 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "（思考中断）抱歉，能再说一次吗？" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await processResponse([...messages], input);
  };

  // 处理卡片提交（视为用户发送了一条特定格式的消息）
  const handleCardSubmit = async (summaryText: string) => {
    const userMessage: ChatMessage = { role: 'user', text: summaryText };
    setMessages(prev => [...prev, userMessage]);
    await processResponse([...messages, userMessage], summaryText);
  };

  const handlePlanActivate = (plan: Plan) => {
    const userMessage: ChatMessage = { role: 'user', text: "我准备好开始执行这个方案了。" };
    setMessages(prev => [...prev, userMessage]);
    onActivatePlan(plan);
  };

  const renderCard = (card: CoachCard) => {
    switch (card.type) {
      case 'truth_card':
        return <TruthCard data={card.data as any} onSubmit={handleCardSubmit} />;
      case 'choice_options_card':
        return <ChoiceCard data={card.data as any} onSubmit={handleCardSubmit} />;
      case 'plan_preview_card':
        return <PlanPreviewCard plan={(card.data as any).plan} onActivate={handlePlanActivate} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* 状态看板 */}
      <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <span className="font-black text-xs">TCA</span>
        </div>
        <div className="flex-1">
          <h1 className="font-black text-slate-800 text-lg">决策中枢</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {userState === UserState.IDLE ? '探索阶段' : userState}
          </p>
        </div>
      </div>

      {/* 对话区域 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="max-w-[90%]">
              <div 
                className={`p-5 rounded-[28px] text-[13px] leading-relaxed shadow-sm prose prose-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
              />
            </div>
            {/* 卡片渲染在消息下方 */}
            {msg.card && (
              <div className="w-full max-w-[95%] mt-2">
                {renderCard(msg.card)}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-[24px] rounded-tl-none shadow-sm border border-slate-100 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="mt-4 glass p-2.5 rounded-[32px] flex items-center gap-2 border border-white/60 shadow-lg relative">
        <button 
          type="button"
          onClick={toggleListening}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        <input 
          type="text"
          placeholder={isListening ? "正在倾听..." : "输入..."}
          className="flex-1 bg-transparent px-2 py-2 focus:outline-none text-[13px] font-medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center disabled:opacity-20 transition-all active:scale-90 shadow-lg shadow-indigo-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};
