# Evidence：版本生成脚本验证记录

runId: loop-20260902-7f3a
date: 2026-09-02
phase: VERIFY

## AC1 — 脚本写入 package.json.version（Git 派生）

实际输出（两次连续运行）：

```
[bump-version] package.json version -> 1.0.0-37.d0031ed
[bump-version] package.json version -> 1.0.0-37.d0031ed
final version: 1.0.0-37.d0031ed
```

## AC2 — 合法 semver（electron-updater 同款 semver@7.8.5 严格校验）

```
parse: 1.0.0-37.d0031ed
gt(1.0.0-37.d0031ed, 1.0.0-36.abc1234): true
```

## AC3 — 幂等性与递增

- 同一 commit 重复执行两次结果一致（见 AC1 输出）。
- `semver.gt` 对比新旧 commit 数版本返回 true，升级判断可用。

## AC4 — lint / typecheck / 无关命令不受影响

- `pnpm lint`：通过（修复 eslint.config.mjs 后；修复前 scripts/*.mjs 报
  `@typescript-eslint/explicit-function-return-type`，已为 scripts 目录按项目既有意图关闭该规则）。
- `pnpm typecheck`：通过。

## AC5 — 非 git 环境失败路径

```
GIT_DIR=/nonexistent node scripts/bump-version.mjs
fatal: not a git repository: 'C:/Program Files/Git/nonexistent'
[bump-version] 获取 git 信息失败，请确认当前目录是 git 仓库： ...
exit code: 1
version unchanged: 1.0.0-37.d0031ed
```

## AC5 — git commit hash 为空时回退时间戳（FIX 迭代，皇上反馈 2026-09-02）

空仓库（无 commit）场景实际输出：

```
[bump-version] 无法获取 git commit hash，回退使用时间戳版本
[bump-version] package.json version -> 1.0.0-20260902094757
exit code: 0
```

- 回退版本 `1.0.0-20260902094757` 经 semver@7.8.5 严格解析为 VALID。
- 回退后重新运行正常路径，恢复为 git 派生版本 `1.0.0-37.d0031ed`，脚本幂等性保持。
- `pnpm lint` 通过。

## FIX 迭代 2：脚本改用 TypeScript 编写（皇上反馈 2026-09-02）

- 脚本由 `scripts/bump-version.mjs` 迁移为 `scripts/bump-version.mts`（TypeScript）。
- 运行方式不变：Node v22.22.3 原生 type stripping 直接执行 `.mts`，无需编译或新增依赖（已实测 `.mts` 可执行）。
- `tsconfig.node.json` include 增加 `scripts/**/*.mts`，脚本纳入 `pnpm typecheck`。
- `eslint.config.mjs` 移除已失效的 `scripts/**/*.mjs` 覆盖块。

迁移后复验（全部通过）：

```
=== 正常路径 ===
[bump-version] package.json version -> 1.0.0-37.d0031ed
=== 空仓库回退 ===
[bump-version] 无法获取 git commit hash，回退使用时间戳版本
[bump-version] package.json version -> 1.0.0-20260902094930
exit code: 0
=== 恢复 git 版本 ===
[bump-version] package.json version -> 1.0.0-37.d0031ed
semver: VALID
```

- `pnpm exec eslint scripts/bump-version.mts`：通过
- `pnpm lint`：通过
- `pnpm typecheck`（含 scripts/**/*.mts）：通过

## 扩展名决策依据：为什么 .mts 而非 .ts（2026-09-02 实测）

- 项目 `package.json` 无 `"type": "module"`，Node 将 `.ts` 默认按 CommonJS 解析。
- 实测将脚本命名为 `.ts` 运行：能执行（Node 22.7+ 模块语法检测自动升级 ESM），但每次运行输出
  `MODULE_TYPELESS_PACKAGE_JSON` 警告（重解析为 ESM、有性能开销），会污染每次打包日志。
- Node 警告建议的 `"type": "module"` 方案不可行：electron-vite 产物 `out/main/index.js` 为 CommonJS
  （实测 `require("electron")` 开头），声明 type:module 后打包应用将因 `require is not defined` 无法启动。
- 结论：`.mts` 扩展名自带 ESM 语义，零警告零开销，且不影响打包产物，为唯一正确选择。

## 打包链路（已验证）

`pnpm build:unpack` 全链路执行成功（exit 0）：bump-version → typecheck → electron-vite build → electron-builder --dir 打包 win-unpacked。

打包产物版本核验：

```
ProductVersion : 1.0.0.0        （electron-builder 的 Windows 规范化形式）
FileVersion    : 1.0.0-37.d0031ed   （生成的 Git 派生版本）
```

结论：生成的版本已真实流入 electron-builder 产物。
