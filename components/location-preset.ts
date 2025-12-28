export interface LocationPreset {
  label: string;
  value: string;
  building?: string;
  isSection?: boolean;
}

export const ECNU_PRESETS: LocationPreset[] = [
  { label: "文史楼 203", value: "文史楼 203" },
  { label: "文史楼 301", value: "文史楼 301" },
  { label: "物理楼 105", value: "物理楼 105" },
  { label: "物理楼 202", value: "物理楼 202" },
  { label: "化学楼 401", value: "化学楼 401" },
  { label: "图书馆 多功能厅", value: "图书馆多功能厅" },
  { label: "体育馆 篮球场", value: "体育馆篮球场" },
  { label: "学生活动中心", value: "学生活动中心" },
  { label: "河西食堂 二楼", value: "河西食堂二楼" },
  { label: "商学院楼 报告厅", value: "商学院楼报告厅" },
];

export const ALL_LOCATIONS: LocationPreset[] = [
  { label: "━━━━ ECNU 校内 ━━━━", value: "", isSection: true },
  ...ECNU_PRESETS,
  { label: "━━━━ 其他常用 ━━━━", value: "", isSection: true },
  { label: "线上活动", value: "线上活动" },
  { label: "待定", value: "待定" },
];
