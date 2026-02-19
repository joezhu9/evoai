
import { GoogleGenAI } from "@google/genai";
import { TCA_SYSTEM_INSTRUCTION, APP_MODEL } from "./constants";
import { ChatMessage, UserState, CoachCard, Task, TaskStatus } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AIResponse {
  text: string;
  card?: CoachCard;
}

export async function sendMessage(history: ChatMessage[], userInput: string, userState: UserState, tasks: Task[]): Promise<AIResponse> {
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }] 
  }));
  
  contents.push({ role: 'user', parts: [{ text: userInput }] });

  // 计算当前轮次 (Roughly: history length / 2 + 1)
  const turnCount = Math.floor(history.length / 2) + 1;

  // 生成任务上下文
  const activeTasks = tasks.filter(t => t.status === TaskStatus.ACTIVE).map(t => `- [ ] ${t.title} (${t.difficulty})`).join('\n');
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).map(t => `- [x] ${t.title}`).join('\n');
  const taskContext = `
当前任务列表 (Task Context):
【待办任务】:
${activeTasks || '（暂无）'}

【已完成任务】:
${completedTasks || '（暂无）'}
`;

  let systemInstruction = TCA_SYSTEM_INSTRUCTION
    .replace('{{USER_STATE}}', userState)
    .replace('{{TURN_COUNT}}', turnCount.toString())
    .replace('{{TASKS_CONTEXT}}', taskContext);

  try {
    const response = await ai.models.generateContent({
      model: APP_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "{}";
    
    try {
      const parsed = JSON.parse(rawText);
      return {
        text: parsed.text || "...",
        card: parsed.card
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, rawText);
      return { text: rawText };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
