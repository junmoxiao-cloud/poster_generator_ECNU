"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PosterFormData } from "./PosterForm";
import { toPng, toJpeg } from "html-to-image";

interface PosterPreviewProps {
  data: PosterFormData;
  onPosterReady?: (element: HTMLElement) => void;
  onExport?: (base64: string) => void;
}

export function PosterPreview({ data, onPosterReady, onExport }: PosterPreviewProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");

  useEffect(() => {
    if (data.joinUrl) {
      generateQrCode(data.joinUrl);
    } else {
      setQrCodeUrl("");
    }
  }, [data.joinUrl]);

  useEffect(() => {
    if (posterRef.current && onPosterReady) {
      onPosterReady(posterRef.current);
    }
  }, [data, onPosterReady]);

  const formatTime = useCallback((timeStr: string) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const weekDay = weekDays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}月${day}日 ${weekDay} ${hours}:${minutes}`;
  }, []);

  const handleExport = useCallback(async () => {
    if (!posterRef.current || isExporting) return;
    
    setIsExporting(true);
    setExportProgress("正在生成海报...");
    
    try {
      const base64 = await exportPoster(posterRef.current);
      if (onExport) {
        onExport(base64);
      }
      setExportProgress("");
    } catch (error) {
      console.error("导出失败:", error);
      setExportProgress("导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, onExport]);

  return (
    <div className="relative">
      <div
        ref={posterRef}
        className="relative w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-2xl"
        style={{ 
          minHeight: "450px",
          height: "auto"
        }}
        data-html2canvas-ignore="true"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="absolute inset-0 flex flex-col p-6">
          <div className="flex items-start justify-between flex-none">
            {data.isEcnU && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                华东师范大学
              </div>
            )}
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center ml-auto">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-xl">🎉</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start pt-4 pb-2 overflow-hidden">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight drop-shadow-lg flex-none">
              {data.title || "活动名称"}
            </h1>
            
            <div className="grid grid-cols-2 gap-3 mb-3 flex-none">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg p-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-none">
                  <span className="text-base">📅</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white/70">时间</div>
                  <div className="text-white text-sm font-medium truncate">{formatTime(data.time) || "待定"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg p-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-none">
                  <span className="text-base">📍</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white/70">地点</div>
                  <div className="text-white text-sm font-medium truncate">{data.location || "待定"}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg p-3 mb-3 flex-none">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-none">
                <span className="text-base">👥</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-white/70">主办方</div>
                <div className="text-white text-sm font-medium truncate">{data.organizer || "待填写"}</div>
              </div>
            </div>

            {data.description && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1 min-h-0 overflow-hidden">
                <div className="text-white/70 text-xs mb-1 flex-none">活动简介</div>
                <div className="text-white text-sm leading-relaxed break-words overflow-hidden line-clamp-4">
                  {data.description}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between flex-none pt-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">即将举办</span>
            </div>
            
            {qrCodeUrl && (
              <div className="bg-white rounded-lg p-1.5 shadow-lg">
                <img src={qrCodeUrl} alt="报名二维码" className="w-16 h-16" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-400 mt-2">
        实时预览 · 实际导出效果可能略有差异
      </div>
      
      {isExporting && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">{exportProgress || "正在生成海报..."}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function generateQrCode(url: string): Promise<void> {
  try {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrCodeUrl);
  } catch {
    console.error("二维码生成失败");
    setQrCodeUrl("");
  }
}

export async function exportPoster(node: HTMLElement): Promise<string> {
  const options = {
    pixelRatio: 2,
    backgroundColor: null,
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
    },
  };
  
  try {
    return await toPng(node, options);
  } catch (error) {
    console.warn("toPng 失败，尝试 toJpeg:", error);
  }
  
  try {
    return await toJpeg(node, { ...options, quality: 0.95 });
  } catch (error) {
    console.warn("toJpeg 失败，尝试基础 toPng:", error);
  }
  
  try {
    return await toPng(node, { pixelRatio: 1 });
  } catch (error) {
    console.error("所有导出方式均失败:", error);
    throw new Error("海报导出失败，请尝试截屏保存");
  }
}
