/**
 * 进程检测模块
 * 查找 Antigravity language_server 进程并提取凭证
 */

import { execSync } from "child_process";
import type { ProcessInfo } from "./types";

const platform = process.platform;

/**
 * 查找 language_server 进程
 */
export function findLanguageServerProcess(): ProcessInfo | null {
  try {
    let processLine: string;

    if (platform === "darwin" || platform === "linux") {
      const output = execSync("ps aux", { encoding: "utf-8" });
      const lines = output.split("\n");
      const match = lines.find(
        (line) => line.includes("language_server") && !line.includes("grep")
      );
      if (!match) return null;

      const parts = match.trim().split(/\s+/);
      const pid = parts[1];
      if (!pid) return null;
      const cmdline = getCommandLine(pid);

      return { pid, cmdline };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 获取进程完整命令行
 */
function getCommandLine(pid: string): string {
  try {
    if (platform === "darwin") {
      return execSync(`ps -p ${pid} -o args=`, { encoding: "utf-8" }).trim();
    } else if (platform === "linux") {
      return execSync(`cat /proc/${pid}/cmdline`, { encoding: "utf-8" })
        .replace(/\0/g, " ")
        .trim();
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * 从命令行提取 CSRF Token
 */
export function extractCsrfToken(cmdline: string): string | null {
  // 尝试 --csrf_token 格式
  const match1 = cmdline.match(/--csrf_token\s+([a-f0-9-]+)/);
  if (match1?.[1]) return match1[1];

  // 尝试 csrf_token= 格式
  const match2 = cmdline.match(/csrf_token=([^\s]+)/);
  if (match2?.[1]) return match2[1];

  return null;
}

/**
 * 从命令行提取 extension_server_port
 */
export function extractExtensionPort(cmdline: string): string | null {
  const match = cmdline.match(/--extension_server_port\s+(\d+)/);
  return match?.[1] ?? null;
}

/**
 * 获取进程监听的端口列表
 */
export function getListeningPorts(pid: string): string[] {
  try {
    if (platform === "darwin") {
      const output = execSync(`lsof -a -p ${pid} -i -P -n 2>/dev/null`, {
        encoding: "utf-8",
      });
      const ports: string[] = [];
      for (const line of output.split("\n")) {
        if (line.includes("LISTEN")) {
          const match = line.match(/:(\d+)\s/);
          if (match?.[1] && !ports.includes(match[1])) {
            ports.push(match[1]);
          }
        }
      }
      return ports.sort((a, b) => parseInt(a) - parseInt(b));
    } else if (platform === "linux") {
      const output = execSync(`ss -tlnp 2>/dev/null | grep "pid=${pid},"`, {
        encoding: "utf-8",
      });
      const ports: string[] = [];
      for (const line of output.split("\n")) {
        const match = line.match(/:(\d+)\s/);
        if (match?.[1] && !ports.includes(match[1])) {
          ports.push(match[1]);
        }
      }
      return ports.sort((a, b) => parseInt(a) - parseInt(b));
    }
    return [];
  } catch {
    return [];
  }
}
