# antigravity-quota

查询并可视化展示 Antigravity 模型额度。

## 使用

```bash
npx antigravity-quota
```

或本地开发:

```bash
bun run dev
```

## 示例输出

```
  Antigravity Quota · Google AI Ultra for Business

  Model                      Quota                   %  Reset
  ────────────────────────── ──────────────────── ────  ──────
  Claude Opus 4.5 (Thinking) ━━━━━━━━━━━━━━━━━━──  91%  3h28m
  Claude Sonnet 4.5          ━━━━━━━━━━━━━━━━━━──  91%  3h28m
  Gemini 3 Pro (High)        ━━━━━━━━━━━━━━━━━━━━ 100%  4h30m
```

## 前提条件

- Antigravity (Cursor) 必须正在运行
- macOS 或 Linux

## License

MIT
