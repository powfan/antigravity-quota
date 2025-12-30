/**
 * 终端 UI 渲染模块
 * 简洁优雅的配额显示
 */

import chalk from "chalk";
import type { UserStatusResponse, ModelConfig } from "./types";
import { MODEL_ORDER } from "./types";

const BAR_WIDTH = 20;

/**
 * 绘制简洁进度条
 */
function bar(pct: number): string {
  const filled = Math.round((pct * BAR_WIDTH) / 100);
  const empty = BAR_WIDTH - filled;
  const color = pct < 30 ? chalk.red : pct < 60 ? chalk.yellow : chalk.green;
  return color("━".repeat(filled)) + chalk.gray("─".repeat(empty));
}

/**
 * 格式化剩余时间 (简洁版)
 */
function timeLeft(resetTime?: string): string {
  if (!resetTime) return "";
  try {
    const diff = new Date(resetTime).getTime() - Date.now();
    if (diff <= 0) return chalk.gray("reset");
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return chalk.gray(h > 0 ? `${h}h${m}m` : `${m}m`);
  } catch {
    return "";
  }
}

/**
 * 渲染配额面板
 */
export function displayQuotas(data: UserStatusResponse): void {
  const plan = data.userStatus?.userTier?.name ?? "Unknown";
  const models = data.userStatus?.cascadeModelConfigData?.clientModelConfigs ?? [];

  console.log();
  console.log(chalk.bold("  Antigravity Quota") + chalk.gray(` · ${plan}`));
  console.log();
  console.log(chalk.gray(`  ${'Model'.padEnd(26)} ${'Quota'.padEnd(20)} ${'%'.padStart(4)}  Reset`));
  console.log(chalk.gray(`  ${'─'.repeat(26)} ${'─'.repeat(20)} ${'─'.repeat(4)}  ${'─'.repeat(6)}`));

  for (const name of MODEL_ORDER) {
    const m = models.find((x: ModelConfig) => x.label === name);
    if (!m?.quotaInfo) continue;

    const pct = (m.quotaInfo.remainingFraction ?? 1) * 100;
    const pctColor = pct < 30 ? chalk.red : pct < 60 ? chalk.yellow : chalk.green;
    const label = name.length > 26 ? name.slice(0, 23) + "..." : name;

    console.log(
      `  ${label.padEnd(26)} ${bar(pct)} ${pctColor(pct.toFixed(0).padStart(3))}%  ${timeLeft(m.quotaInfo.resetTime)}`
    );
  }

  console.log();
}

/**
 * 显示错误
 */
export function showError(msg: string): void {
  console.error(chalk.red(`✗ ${msg}`));
}
