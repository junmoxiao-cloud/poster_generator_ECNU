"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { downloadBase64Image } from "@/lib/export-poster";

interface PosterData {
  id: string;
  title: string;
  time: string;
  location: string;
  organizer: string;
  description?: string;
  join_url?: string;
  poster_base64?: string;
  copies?: {
    moments: string;
    xiaohongshu: string;
    summary: string;
  };
  is_ecnu: boolean;
  created_at: string;
}

export default function SharePage() {
  const params = useParams();
  const [poster, setPoster] = useState<PosterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    fetch(`/api/posters/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("海报不存在");
        return res.json();
      })
      .then((data) => {
        setPoster(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const weekDay = weekDays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}月${day}日 ${weekDay} ${hours}:${minutes}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} 已复制到剪贴板`);
    } catch {
      alert("复制失败，请手动复制");
    }
  };

  const handleDownload = () => {
    if (poster?.poster_base64) {
      downloadBase64Image(poster.poster_base64, `poster-${poster.id}.png`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (error || !poster) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
          <p className="text-gray-500 mb-6">{error || "海报已被删除或不存在"}</p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              校园海报生成器
            </h1>
          </Link>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {poster.poster_base64 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                <img
                  src={poster.poster_base64}
                  alt={poster.title}
                  className="w-full"
                />
                <div className="p-4 border-t border-gray-100">
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    variant="outline"
                  >
                    📥 下载海报
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {poster.title}
              </h2>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <span>{formatTime(poster.time)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span>{poster.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">👥</span>
                  <span>{poster.organizer}</span>
                </div>
                {poster.join_url && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔗</span>
                    <a
                      href={poster.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      报名链接
                    </a>
                  </div>
                )}
              </div>

              {poster.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">{poster.description}</p>
                </div>
              )}
            </div>

            {poster.copies && (
              <>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    📱 朋友圈文案
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {poster.copies.moments}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(poster.copies!.moments, "朋友圈文案")
                    }
                  >
                    复制文案
                  </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    📕 小红书文案
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {poster.copies.xiaohongshu}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(poster.copies!.xiaohongshu, "小红书文案")
                    }
                  >
                    复制文案
                  </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="text-sm text-gray-500 mb-2">一句话总结</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">
                      {poster.copies.summary}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(poster.copies!.summary, "一句话总结")
                      }
                    >
                      复制
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button className="w-full" variant="secondary">
                  🎨 创建新海报
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>Powered by TRAE SOLO · 校园海报生成器</p>
        </footer>
      </div>
    </main>
  );
}
