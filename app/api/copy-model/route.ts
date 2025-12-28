import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 API Key" },
        { status: 500 }
      );
    }
    
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个校园活动宣发专家，负责为社团活动生成多平台推广文案。
请根据活动信息，生成以下三种文案（直接返回JSON，不要有任何其他内容）：
1. moments: 朋友圈文案 - 简洁有力，1-2个emoji，50字以内
2. xiaohongshu: 小红书文案 - 活泼有趣，分段清晰，带话题标签，150字以内  
3. summary: 一句话总结 - 提炼核心信息，60字以内

返回格式：
{
  "moments": "文案内容",
  "xiaohongshu": "文案内容",
  "summary": "文案内容"
}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error("模型 API 调用失败");
    }
    
    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    let copies;
    try {
      copies = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        copies = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("无法解析模型返回内容");
      }
    }
    
    return NextResponse.json({ copies });
  } catch (error) {
    console.error("模型调用错误:", error);
    return NextResponse.json(
      { error: "模型调用失败" },
      { status: 500 }
    );
  }
}
