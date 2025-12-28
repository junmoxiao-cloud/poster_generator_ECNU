import { NextRequest, NextResponse } from "next/server";
import { getPoster } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poster = getPoster(id);
    
    if (!poster) {
      return NextResponse.json(
        { error: "海报不存在" },
        { status: 404 }
      );
    }
    
    let copies = null;
    if (poster.copies) {
      try {
        copies = JSON.parse(poster.copies);
      } catch {
        console.error("解析 copies 失败");
      }
    }
    
    return NextResponse.json({
      id: poster.id,
      title: poster.title,
      time: poster.time,
      location: poster.location,
      organizer: poster.organizer,
      description: poster.description,
      join_url: poster.join_url,
      poster_base64: poster.poster_base64,
      copies,
      is_ecnu: poster.is_ecnu,
      created_at: poster.created_at,
    });
  } catch (error) {
    console.error("获取失败:", error);
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    );
  }
}
