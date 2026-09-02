# Goal（已确认）：版本生成脚本

## Goal

实现版本生成脚本：执行打包命令时，先基于 Git 派生版本号并写入 `package.json` 的 `version`，再继续打包。electron-builder 产物文件名（`${version}`）与 electron-updater 升级判断均使用生成后的版本。

## 已确认决策

- **版本规则**：Git 派生（皇上确认）。
- **适用范围**：全部打包命令 `build:win / build:mac / build:linux / build:unpack`（皇上确认）。
- **版本格式**：`<major>.<minor>.<patch>-<commitCount>.<shortHash>`（如 `1.0.0-23.abc1234`）。
  - 依据：electron-updater 使用 `semver.parse` 严格校验（node_modules/electron-updater/out/AppUpdater.js:213，失败抛 `ERR_UPDATER_INVALID_VERSION`），4 段格式 `1.0.0.123` 非法；prerelease 形式合法且 commit 数递增可被 `semver.gt` 正常比较。
- **幂等**：同一 commit 下重复打包版本不变；新 commit 后自然递增。
- **git 回退（皇上反馈 2026-09-02）**：git commit hash 为空时（非 git 仓库 / 无提交），回退使用时间戳版本 `<base>-<yyyyMMddHHmmss>` 并输出提示，不再报错中断。

## 实现方案

1. 新建 `scripts/bump-version.mts`（TypeScript，FIX 迭代：由 .mjs 改为 TS 编写）：
   - Node v22 原生 type stripping 直接执行 `.mts`（项目锁定 Node 22.22.3），无需编译步骤或新增依赖；
   - `git rev-list --count HEAD` 取 commit 数，`git rev-parse --short HEAD` 取短 hash；
   - 读取 `package.json.version`，取 `-` 前的基础段（兼容已带 prerelease 的情况），拼出新版本写回；
   - git 信息不可用（hash 为空）时，回退生成时间戳版本 `<base>-<yyyyMMddHHmmss>` 并 warn 提示；
   - `tsconfig.node.json` include 增加 `scripts/**/*.mts`，纳入 `pnpm typecheck`。
2. `package.json`：新增 `"bump-version": "node scripts/bump-version.mts"`；4 个打包命令前拼接 `npm run bump-version &&`。
3. 不动 `build`（纯 typecheck + electron-vite build，非打包）与 `dev/start`。

## 验收标准

- AC1：4 个打包命令均在打包前先执行版本生成，`package.json.version` 被更新为 Git 派生版本。
- AC2：生成版本为合法 semver（`semver.parse` 可解析），含回退时间戳版本。
- AC3：无新提交时重复执行结果稳定；有新提交时版本递增。
- AC4：`pnpm lint`、`pnpm typecheck` 通过；`pnpm build` 不受影响。
- AC5：git commit hash 为空时（非 git 仓库 / 空仓库无提交）回退为时间戳版本并输出提示，脚本正常完成（退出 0）。

## 验证策略

- 直接运行 `node scripts/bump-version.mjs` 两次：验证写入结果与幂等性（AC1/AC3）。
- `node -e` 用 semver 解析生成的版本：验证 AC2。
- `pnpm lint`（覆盖根目录 .mjs）与 `pnpm typecheck`：验证 AC4。
- 尝试 `pnpm build:unpack` 验证真实打包链路（electron-builder 首次运行可能受网络限制，失败则记录为环境限制）。
