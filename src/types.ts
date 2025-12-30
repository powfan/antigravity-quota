/**
 * Antigravity Quota Types
 */

/** 进程信息 */
export interface ProcessInfo {
  pid: string;
  cmdline: string;
}

/** 模型配额信息 */
export interface QuotaInfo {
  remainingFraction: number;
  resetTime?: string;
}

/** 模型配置 */
export interface ModelConfig {
  label: string;
  quotaInfo: QuotaInfo | null;
}

/** 用户状态响应 */
export interface UserStatusResponse {
  userStatus: {
    userTier: {
      name: string;
    };
    cascadeModelConfigData: {
      clientModelConfigs: ModelConfig[];
    };
  };
}

/** 支持的模型名称列表 (按顺序显示) */
export const MODEL_ORDER = [
  "Claude Opus 4.5 (Thinking)",
  "Claude Sonnet 4.5 (Thinking)",
  "Claude Sonnet 4.5",
  "Gemini 3 Pro (High)",
  "Gemini 3 Pro (Low)",
  "Gemini 3 Flash",
  "GPT-OSS 120B (Medium)",
] as const;
