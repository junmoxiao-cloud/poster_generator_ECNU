export interface CopyResult {
  moments: string;
  xiaohongshu: string;
  summary: string;
}

export type CopyJson = CopyResult;

export interface PosterData {
  title: string;
  time: string;
  location: string;
  organizer: string;
  description?: string;
  join_url?: string;
  is_ecnu?: boolean;
}

const MODEL_SYSTEM_PROMPT = `你是一个校园活动宣发专家，负责为社团活动生成多平台推广文案。
请根据活动信息，生成以下三种文案：
1. 朋友圈文案：简洁有力，1-2个emoji，50字以内，适合快速分享
2. 小红书文案：活泼有趣，分段清晰，带话题标签，150字以内
3. 一句话总结：提炼核心信息，60字以内

注意：
- 文案要突出活动亮点
- 使用符合大学生习惯的表达方式
- 保持社团活动的青春活力感

请直接返回JSON格式，不要有任何其他内容。`;

export async function generateCopies(data: PosterData): Promise<CopyJson> {
  const modelResult = await callModel(data);
  if (isValidSchema(modelResult)) {
    return modelResult;
  }
  
  console.warn("模型返回格式无效，使用模板兜底");
  return templateGenerate(data);
}

async function callModel(data: PosterData): Promise<unknown> {
  const prompt = buildPrompt(data);
  
  try {
    const response = await fetch("/api/copy-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error("模型调用失败");
    }
    
    const result = await response.json();
    return result.copies;
  } catch (error) {
    console.error("模型调用错误:", error);
    throw error;
  }
}

function buildPrompt(data: PosterData): string {
  const location = data.is_ecnu 
    ? `华东师范大学 ${data.location}` 
    : data.location;
  
  const time = formatDateTime(data.time);
  
  return `
活动名称：${data.title}
时间：${time}
地点：${location}
主办方：${data.organizer}
${data.description ? `活动简介：${data.description}` : ""}
${data.join_url ? `报名链接：${data.join_url}` : ""}

请为这个活动生成朋友圈、小红书、一句话三种文案。
`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekDay = weekDays[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${weekDay} ${hours}:${minutes}`;
}

function isValidSchema(obj: unknown): obj is CopyJson {
  if (!obj || typeof obj !== "object") return false;
  
  const o = obj as Record<string, unknown>;
  return (
    typeof o.moments === "string" &&
    typeof o.xiaohongshu === "string" &&
    typeof o.summary === "string" &&
    o.moments.length > 0 &&
    o.xiaohongshu.length > 0 &&
    o.summary.length > 0
  );
}

export function templateGenerate(data: PosterData): CopyJson {
  const location = data.is_ecnu 
    ? `华东师范大学 ${data.location}` 
    : data.location;
  
  const time = formatDateTime(data.time);
  const dateStr = formatDate(data.time);
  
  const moments = generateMoments(data, time, location);
  const xiaohongshu = generateXiaohongshu(data, time, location, dateStr);
  const summary = generateSummary(data, time, location);
  
  return { moments, xiaohongshu, summary };
}

function generateMoments(data: PosterData, time: string, location: string): string {
  const emoji = data.description?.includes("分享") 
    ? "🎤" 
    : data.description?.includes("比赛")
    ? "🏆"
    : data.description?.includes("工作坊")
    ? "💡"
    : "🎉";
  
  let text = `${emoji} ${data.title}\n📅 ${time}\n📍 ${location}`;
  
  if (data.organizer) {
    text += `\n👥 ${data.organizer}`;
  }
  
  if (data.join_url) {
    text += `\n🔗 报名戳→`;
  }
  
  return text;
}

function generateXiaohongshu(data: PosterData, time: string, location: string, dateStr: string): string {
  const emoji = data.description?.includes("分享") 
    ? "🎤" 
    : data.description?.includes("比赛")
    ? "🏆"
    : data.description?.includes("工作坊")
    ? "💡"
    : "✨";
  
  let text = `${emoji} ${data.title}\n\n`;
  text += `📅 ${time}\n`;
  text += `📍 ${location}\n`;
  
  if (data.organizer) {
    text += `👤 主办：${data.organizer}\n`;
  }
  
  if (data.description) {
    text += `\n${data.description}\n`;
  }
  
  if (data.join_url) {
    text += `\n💻 报名链接已放在评论区~\n`;
  }
  
  text += `\n#校园活动 #社团 #大学生活`;
  
  return text;
}

function generateSummary(data: PosterData, time: string, location: string): string {
  let text = `${data.title}，${time} ${location}`;
  
  if (data.organizer) {
    text += `，${data.organizer}`;
  }
  
  return text + "。";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}
