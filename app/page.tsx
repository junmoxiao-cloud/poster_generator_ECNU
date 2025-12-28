"use client";

import { useState, useCallback } from "react";
import { PosterForm, PosterFormData } from "@/components/PosterForm";
import { PosterPreview } from "@/components/PosterPreview";
import { Button } from "@/components/ui/Button";
import { exportPoster, downloadBase64Image } from "@/lib/export-poster";
import { templateGenerate } from "@/lib/generate-copies";

const initialFormData: PosterFormData = {
  title: "",
  time: "",
  location: "",
  organizer: "",
  description: "",
  joinUrl: "",
  isEcnU: false,
};

export default function Home() {
  const [formData, setFormData] = useState<PosterFormData>(initialFormData);
  const [posterElement, setPosterElement] = useState<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [copies, setCopies] = useState<{
    moments: string;
    xiaohongshu: string;
    summary: string;
  } | null>(null);
  const [posterBase64, setPosterBase64] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFormChange = (data: PosterFormData) => {
    setFormData(data);
  };

  const handlePosterReady = useCallback((element: HTMLElement) => {
    setPosterElement(element);
  }, []);

  const handleExport = useCallback(async () => {
    if (!posterElement || isExporting) return;
    
    setIsExporting(true);
    
    try {
      const base64 = await exportPoster(posterElement);
      setPosterBase64(base64);
      downloadBase64Image(base64, `poster-${Date.now()}.png`);
    } catch (error) {
      console.error("导出失败:", error);
      alert("海报导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  }, [posterElement, isExporting]);

  const handleSubmit = async () => {
    if (!posterElement) {
      alert("请先填写活动信息");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let base64: string | undefined;
      try {
        base64 = await exportPoster(posterElement);
        setPosterBase64(base64);
      } catch (error) {
        console.error("海报导出失败:", error);
      }
      
      const copiesData = templateGenerate({
        title: formData.title,
        time: formData.time,
        location: formData.location,
        organizer: formData.organizer,
        description: formData.description,
        join_url: formData.joinUrl,
        is_ecnu: formData.isEcnU,
      });
      
      setCopies(copiesData);
      
      const shareData = {
        title: formData.title,
        time: formData.time,
        location: formData.location,
        organizer: formData.organizer,
        description: formData.description,
        join_url: formData.joinUrl,
        is_ecnu: formData.isEcnU,
        copies: copiesData,
      };
      
      const encodedData = btoa(encodeURIComponent(JSON.stringify(shareData)));
      const url = `${window.location.origin}/p?data=${encodedData}`;
      setPosterUrl(url);
      
      if (base64) {
        downloadBase64Image(base64, `poster-${Date.now()}.png`);
      }
    } catch (error) {
      console.error("生成失败:", error);
      alert("生成失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} 已复制到剪贴板`);
    } catch {
      alert("复制失败，请手动复制");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
            校园海报生成器
          </h1>
          <p className="text-gray-500 text-lg">
            一键生成社团风海报，适配多平台宣发
          </p>
        </header>

        {posterUrl ? (
          <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                海报生成成功！
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                分享你的活动
              </h2>
              <p className="text-gray-500">
                复制下方文案或分享链接，让更多人看到你的活动
              </p>
            </div>

            {posterBase64 && (
              <div className="mb-8">
                <img src={posterBase64} alt="海报预览" className="w-full rounded-xl shadow-lg" />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">📱 朋友圈文案</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                  {copies?.moments}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(copies?.moments || "", "朋友圈文案")}
                >
                  复制文案
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">📕 小红书文案</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                  {copies?.xiaohongshu}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(copies?.xiaohongshu || "", "小红书文案")}
                >
                  复制文案
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500 mb-2">一句话总结</div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">{copies?.summary}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(copies?.summary || "", "一句话总结")}
                >
                  复制
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => window.open(posterUrl, "_blank")}
                size="lg"
              >
                🔗 打开分享页
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isExporting || !posterBase64}
                size="lg"
              >
                {isExporting ? "导出中..." : "📥 下载海报"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPosterUrl(null);
                  setCopies(null);
                  setPosterBase64(null);
                  setFormData(initialFormData);
                }}
                size="lg"
              >
                创建新海报
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="order-2 lg:order-1">
              <PosterForm
                data={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="sticky top-8">
                <PosterPreview
                  data={formData}
                  onPosterReady={handlePosterReady}
                />
                
                <div className="mt-4 flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleExport}
                    disabled={isExporting || !posterElement}
                    variant="outline"
                  >
                    {isExporting ? "导出中..." : "📥 预览导出"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-sm text-gray-400">
          <p>Powered by TRAE SOLO · 3 小时极速开发</p>
        </footer>
      </div>
    </main>
  );
}
