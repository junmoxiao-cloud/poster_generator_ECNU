import { toPng, toJpeg } from "html-to-image";

export interface ExportOptions {
  pixelRatio?: number;
  quality?: number;
  backgroundColor?: string;
}

export async function exportPoster(node: HTMLElement, options: ExportOptions = {}): Promise<string> {
  const { pixelRatio = 2, quality = 0.95 } = options;
  
  const baseOptions = {
    pixelRatio,
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
    },
  };
  
  try {
    return await toPng(node, baseOptions);
  } catch (error) {
    console.warn("toPng 失败，尝试 toJpeg:", error);
  }
  
  try {
    return await toJpeg(node, { ...baseOptions, quality });
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

export function downloadBase64Image(base64: string, filename: string): void {
  const link = document.createElement("a");
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function base64ToBlob(base64: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const mimeType = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}
