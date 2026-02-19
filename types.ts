
export enum TaskType {
  SINGLE = '单次',
  RECURRING = '循环',
  COUNTING = '计数',
  SEQUENTIAL = '递进'
}

export enum TaskStatus {
  ACTIVE = '进行中',
  COMPLETED = '已完成',
  OVERDUE = '逾期',
  SKIPPED = '已跳过',
  ARCHIVED = '已归档'
}

export enum Difficulty {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高'
}

// 用户成长状态机 (宏观状态)
export enum UserState {
  IDLE = '闲置',
  EXPLORING = '探索中', // 对应 CoachMode 的前三个阶段
  EXECUTING = '执行中',
  REFLECTING = '复盘中',
  STUCK = '卡顿/瓶颈',
  REBUILDING = '策略重构'
}

// 教练对话模式 (微观状态)
export enum CoachMode {
  EXPLORE = 'explore',           // 探索澄清
  CHOICE_WORKSHOP = 'choice',    // 做选择
  PLAN_WORKSHOP = 'plan',        // 方案细化
  EXECUTE_SUPPORT = 'execute'    // 执行支持
}

export interface Task {
  id: string;
  planId?: string;
  title: string;
  description?: string;
  source: 'user_created' | 'ai_generated';
  type: TaskType;
  status: TaskStatus;
  difficulty: Difficulty;
  category: string;
  expValue: number;
  dueDate: string;
  currentCount?: number;
  targetCount?: number;
  unit?: string;
  isLocked?: boolean;
}

export enum PlanStatus {
  DRAFTED = '草稿',
  ACTIVE = '执行中',
  STAGE_COMPLETED = '阶段完成',
  REFLECTING = '复盘中',
  COMPLETED = '已达成',
  ABANDONED = '已放弃'
}

export interface PlanPhase {
  name: string;
  tasks: Partial<Task>[];
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  status: PlanStatus;
  phases: PlanPhase[];
  currentPhaseIndex: number;
  goalHypothesis: string;
}

// --- 卡片数据定义 ---

export type CardType = 'truth_card' | 'choice_options_card' | 'plan_preview_card';

export interface TruthCardData {
  energy: string[];
  time_budget: string[];
  blockers: string[];
}

export interface ChoiceOption {
  id: string;
  title: string;
  belief: string;
  tradeoff: string;
  timebox_days: number;
  daily_core_minutes: number;
}

export interface ChoiceCardData {
  options: ChoiceOption[];
}

export interface PlanPreviewCardData {
  plan: Plan; // 这里的 Plan 状态通常是 DRAFTED
}

export interface CoachCard {
  type: CardType;
  data: TruthCardData | ChoiceCardData | PlanPreviewCardData;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  card?: CoachCard; // 消息携带的卡片
  timestamp?: number;
}
