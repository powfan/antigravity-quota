/**
 * API 客户端模块
 * 与 Antigravity language_server API 通信
 */

import type { UserStatusResponse } from "./types";

// Bun 和 Node 18+ 支持 fetch,此处禁用 TLS 验证
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BASE_SERVICE = "exa.language_server_pb.LanguageServerService";

/**
 * 测试端口是否可用于 API 调用
 */
export async function testPort(
  port: string,
  csrfToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://127.0.0.1:${port}/${BASE_SERVICE}/GetUnleashData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
          "X-Codeium-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({ context: { properties: {} } }),
        signal: AbortSignal.timeout(2000),
      }
    );
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * 获取用户状态和配额信息
 */
export async function getUserStatus(
  port: string,
  csrfToken: string
): Promise<UserStatusResponse | null> {
  try {
    const response = await fetch(
      `https://127.0.0.1:${port}/${BASE_SERVICE}/GetUserStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
          "X-Codeium-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({
          metadata: {
            ideName: "antigravity",
            extensionName: "antigravity",
            ideVersion: "1.0.0",
            locale: "en",
          },
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as UserStatusResponse;
  } catch {
    return null;
  }
}
