"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ALL_LOCATIONS, LocationPreset } from "./location-preset";

export interface PosterFormData {
  title: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  joinUrl: string;
  isEcnU: boolean;
}

interface PosterFormProps {
  data: PosterFormData;
  onChange: (data: PosterFormData) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function PosterForm({ data, onChange, onSubmit, isSubmitting }: PosterFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof PosterFormData, string>>>({});
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleInputChange = (field: keyof PosterFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleLocationSelect = (preset: LocationPreset) => {
    if (preset.isSection || !preset.value) return;
    onChange({ ...data, location: preset.value });
    setShowLocationDropdown(false);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PosterFormData, string>> = {};
    
    if (!data.title.trim()) {
      newErrors.title = "请输入活动名称";
    } else if (data.title.length > 20) {
      newErrors.title = "活动名称不能超过20字";
    }
    
    if (!data.time) {
      newErrors.time = "请选择活动时间";
    }
    
    if (!data.location.trim()) {
      newErrors.location = "请输入活动地点";
    }
    
    if (!data.organizer.trim()) {
      newErrors.organizer = "请输入主办方";
    }
    
    if (data.joinUrl && !isValidUrl(data.joinUrl)) {
      newErrors.joinUrl = "请输入正确的链接格式";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">填写活动信息</h2>
      
      <div className="space-y-5">
        <div>
          <Input
            id="title"
            label="活动名称"
            placeholder="如：社团开放日"
            value={data.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            maxLength={20}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {data.title.length}/20
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="time"
            label="活动时间"
            type="datetime-local"
            value={data.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            error={errors.time}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              是否使用 ECNU 角标
            </label>
            <button
              type="button"
              onClick={() => handleInputChange("isEcnU", !data.isEcnU)}
              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                data.isEcnU
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent"
                  : "bg-white border-gray-300 text-gray-700 hover:border-club-primary"
              }`}
            >
              {data.isEcnU ? "✓ 启用 ECNU" : "○ 不启用"}
            </button>
          </div>
        </div>

        <div className="relative">
          <Input
            id="location"
            label="活动地点"
            placeholder="输入或选择地点"
            value={data.location}
            onChange={(e) => {
              handleInputChange("location", e.target.value);
              setShowLocationDropdown(true);
            }}
            onFocus={() => setShowLocationDropdown(true)}
            error={errors.location}
          />
          
          {showLocationDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {ALL_LOCATIONS.map((preset, index) =>
                preset.isSection ? (
                  <div
                    key={index}
                    className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50 sticky top-0"
                  >
                    {preset.label}
                  </div>
                ) : (
                  <button
                    key={preset.value}
                    type="button"
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => handleLocationSelect(preset)}
                  >
                    {preset.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <Input
          id="organizer"
          label="主办方"
          placeholder="如：科技创新协会"
          value={data.organizer}
          onChange={(e) => handleInputChange("organizer", e.target.value)}
          error={errors.organizer}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            活动简介
          </label>
          <textarea
            id="description"
            placeholder="简单描述活动内容（可选）"
            value={data.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-club-primary focus:border-transparent transition-all duration-200 resize-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {data.description.length}/100
          </div>
        </div>

        <Input
          id="joinUrl"
          label="报名链接（可选）"
          placeholder="https://example.com/signup"
          value={data.joinUrl}
          onChange={(e) => handleInputChange("joinUrl", e.target.value)}
          error={errors.joinUrl}
        />

        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "生成中..." : "生成海报"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
