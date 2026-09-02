# AGENTS.md

## 项目概述

基于 Electron + React + TypeScript 的桌面应用模板，采用 electron-vite 构建。包含多窗口管理（主窗口/登录/设置/作者）、系统托盘、文件与对话框、AES-256-GCM 加解密（密钥由 safeStorage 保护）、内存 Store 与系统路径等功能模块。

## 目录结构

```
src/
  main/          主进程（Node/Electron）
    index.ts     入口：全局错误处理 → whenReady → bootstrap
    bootstrap.ts 装配：setupLifecycle + registerIpc + serviceManager.init
    core/        全局错误处理与日志初始化（electron-log）
    lifecycle/   窗口全部关闭退出、macOS activate 重建、quit 时销毁服务
    ipc/         各 IPC handler 注册（dialog/file/store/window/paths/crypto），统一由 registerIpc() 装配
    services/    生命周期服务（TrayService、WindowService），ServiceManager 顺序 init / 逆序 destroy
    store/       内存版 MainStore（get/set/reset）
    windows/     各窗口类（继承 BaseWindow）+ 单例导出
    utils/       路径封装、AES 加解密
  preload/       预加载脚本，contextBridge 暴露 electronAPI 与 window.api
  renderer/      React 渲染进程（src/main.tsx → App.tsx）
  share/         主/渲染进程共享代码：IPC 常量、WIND_ID、WIND_ROUTE
  types/         全局类型声明（Global.*、Window 上的 api 类型）
```

## 常用命令

```bash
pnpm install        # 安装依赖（pnpm@11.5.2，由 packageManager 锁定）
pnpm dev            # 启动开发模式（electron-vite dev）
pnpm start          # electron-vite preview
pnpm build          # typecheck + electron-vite build
pnpm build:win      # build + electron-builder --win
pnpm typecheck      # 两个 tsconfig 分别 tsc --noEmit
pnpm lint           # eslint --cache .
pnpm format         # prettier --write .
```

## 架构边界

- **进程职责**：主进程只管窗口/文件/加密/路径/托盘/Store；渲染进程 UI；preload 仅透传。渲染进程不直接接触 Node API。
- **新增 IPC 三步**：在 `src/share/constants/ipc.ts` 加常量 → 在 `src/main/ipc/` 建 `registerXxxIpc()`（写好命名导出，在 `ipc/index.ts` 的 `registerIpc()` 中挂上）→ 在 `src/preload/` 加对应 API 模块并入 `preload/index.ts` 的 `api` 对象，并同步 `src/preload/index.d.ts` 的 `window.api` 类型。
- **窗口**：实现一个窗口时继承 `src/main/windows/BaseService.ts` 的 `BaseWindow`，设置 `id`/`route`/`getOptions()`，并用 `export const xxxWindow = new XxxWindow()` 提供单例；所有窗口注册集中在 `src/main/services/WindowService.ts` 底部。
- **服务**：实现 `IService`（name/init/destroy）后在 `src/main/services/index.ts` `register()`；init 顺序、destroy 逆序由 ServiceManager 统一调度。
- **别名**：主进程/preload 用 `@main/*`、`@share/*`；渲染进程多用 `@renderer/*`、`@share/*`、`@types/*`。路径别名在 `electron.vite.config.ts` 与两个 tsconfig `paths` 中同步维护。

## 编码约定

- Prettier：`singleQuote`、无分号、`printWidth: 100`、`trailingComma: none`（见 `.prettierrc.yaml`）。
- 提交信息与代码注释使用中文；专有名词保留英文。
- 工具函数（`src/main/utils` 等通用封装）的注释使用 JSDoc 形式（`/** ... */`），中文描述用途，必要时用 `@param`/`@returns` 标注参数与返回值。
- 窗口 WebPreferences：`nodeIntegration: false`、`contextIsolation: true`、`sandbox: false`（见 `src/main/windows/utils.ts`）。
- 加密密钥文件 `encrypted-key.bin` 存于 userData 目录，用 `safeStorage` 加密持久化（Linux 需关注系统 keyring 可用性）。

## 注意点

- pnpm 版本由 `packageManager: pnpm@11.5.2` 锁定（Corepack）；构建脚本许可在 `pnpm-workspace.yaml` 的 `allowBuilds`（pnpm 11）与 `onlyBuiltDependencies`（pnpm 10 兼容）中重复配置，勿只改其一。
- `.npmrc` 配置了 npmmirror 镜像（electron 二进制与 electron-builder 产物），更换镜像源会直接影响安装。
- `.gitignore` 忽略了 `out`、`dist`、`docs` 等产物目录。
- 无测试框架，无单测；改动以 `pnpm typecheck` 与 `pnpm lint` 为最低验证门槛。