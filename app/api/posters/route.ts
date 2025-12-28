import { NextRequest, NextResponse } from "next/server";
import { createPoster, getPoster, updatePosterBase64, updatePosterCopies } from "@/lib/db";
import { generateCopies, templateGenerate } from "@/lib/generate-copies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, time, location, organizer, description, join_url, is_ecnu } = body;
    
    if (!title || !time || !location || !organizer) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }
    
    const id = createPoster({
      title,
      time,
      location,
      organizer,
      description,
      join_url,
      is_ecnu: is_ecnu || false,
    });
    
    let copies;
    try {
      copies = await generateCopies({
        title,
        time,
        location,
        organizer,
        description,
        join_url,
        is_ecnu,
      });
      
      updatePosterCopies(id, JSON.stringify(copies));
    } catch (error) {
      console.error("文案生成失败，使用模板兜底:", error);
      copies = templateGenerate({
        title,
        time,
        location,
        organizer,
        description,
        join_url,
        is_ecnu,
      });
      
      updatePosterCopies(id, JSON.stringify(copies));
    }
    
    return NextResponse.json({
      id,
      copies,
    });
  } catch (error) {
    console.error("创建失败:", error);
    return NextResponse.json(
      { error: "创建失败" },
      { status: 500 }
    );
  }
}
