import { NextRequest, NextResponse } from "next/server";
import { getPoster, updatePosterBase64 } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, poster_base64 } = body;
    
    if (!id || !poster_base64) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }
    
    const poster = getPoster(id);
    if (!poster) {
      return NextResponse.json(
        { error: "海报不存在" },
        { status: 404 }
      );
    }
    
    updatePosterBase64(id, poster_base64);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("保存失败:", error);
    return NextResponse.json(
      { error: "保存失败" },
      { status: 500 }
    );
  }
}
