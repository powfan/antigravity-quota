#!/usr/bin/env node
/**
 * Antigravity Quota CLI
 * 查询并可视化展示 Antigravity 模型额度
 *
 * 使用: npx antigravity-quota
 */

import {
  findLanguageServerProcess,
  extractCsrfToken,
  extractExtensionPort,
  getListeningPorts,
} from "./process";
import { testPort, getUserStatus } from "./api";
import { displayQuotas, showError } from "./ui";

async function main(): Promise<void> {
  // 1. 查找进程
  const processInfo = findLanguageServerProcess();
  if (!processInfo) {
    showError("未找到 language_server 进程,请确保 Antigravity 正在运行");
    process.exit(1);
  }

  // 2. 提取 CSRF Token
  const csrfToken = extractCsrfToken(processInfo.cmdline);
  if (!csrfToken) {
    showError("无法提取 CSRF Token");
    process.exit(1);
  }

  // 3. 获取可用端口
  const extensionPort = extractExtensionPort(processInfo.cmdline);
  let workingPort: string | null = null;

  if (extensionPort && (await testPort(extensionPort, csrfToken))) {
    workingPort = extensionPort;
  } else {
    const ports = getListeningPorts(processInfo.pid);
    for (const port of ports) {
      if (await testPort(port, csrfToken)) {
        workingPort = port;
        break;
      }
    }
  }

  if (!workingPort) {
    showError("没有可用的 API 端口");
    process.exit(1);
  }

  // 4. 获取用户状态
  const userStatus = await getUserStatus(workingPort, csrfToken);
  if (!userStatus) {
    showError("获取额度失败");
    process.exit(1);
  }

  // 5. 检查响应有效性
  if (!userStatus.userStatus) {
    showError("API 返回无效响应");
    console.log(JSON.stringify(userStatus, null, 2));
    process.exit(1);
  }

  // 6. 显示配额面板
  displayQuotas(userStatus);
}

main().catch((err) => {
  showError(err.message);
  process.exit(1);
});
