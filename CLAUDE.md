# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
pnpm dev              # 开发模式，热更新
pnpm build            # typecheck + electron-vite 构建
pnpm start            # 预览构建产物
pnpm lint             # ESLint 检查
pnpm format           # Prettier 格式化
pnpm typecheck        # TypeScript 类型检查（node + web 双端）
pnpm build:win        # 构建 + 打包 Windows NSIS 安装包
pnpm build:mac        # 构建 + 打包 macOS DMG
pnpm build:linux      # 构建 + 打包 Linux (AppImage/snap/deb)
pnpm build:unpack     # 构建 + 解包（不打包安装程序，用于调试）
```

## 核心架构

### 三层进程模型

```
src/
  main/       → Node.js 主进程 (入口: src/main/index.ts)
  preload/    → contextBridge 预加载桥 (src/preload/index.ts)
  renderer/   → React 19 渲染进程 (入口: src/renderer/src/main.tsx)
  share/      → 跨进程共享常量 (别名 @share，三端可访问)
  types/      → 全局类型声明 (Global / WebGlobal 命名空间)
```

### 启动链路

`src/main/index.ts` → `app.whenReady()` → `bootstrap()`

bootstrap 分三步执行：
1. `setupLifecycle()` — 注册 `window-all-closed`、`before-quit`、`quit`、`activate` 等 Electron 生命周期
2. `registerIpc()` — 注册所有 `ipcMain.handle` 处理器（dialog/file/store/window）
3. `serviceManager.init()` — 正序初始化服务（TrayService → WindowService），退出时倒序销毁

### 服务架构 (`src/main/services/`)

所有服务实现 `IService` 接口（`name` + `init` + `destroy`），通过 `ServiceManager` 单例管理：

- **TrayService** — 系统托盘，右键菜单绑定 `mainWindow.show()` 和 `app.quit()`
- **WindowService** — 窗口注册表（`id → BaseWindow`），通过 `webContents.id` 反向查找窗口供 IPC 使用

### 窗口模型 (`src/main/windows/`)

- **BaseWindow**（抽象类）— 封装 `BrowserWindow` 创建、加载（dev/prod URL 自动选择）、显示/隐藏/关闭/销毁、DevTools 命令注册
- **MainWindow** — 具体窗口，`id = 'main'`，preload 脚本 + CSP 隔离配置
- **utils.ts** — 默认窗口选项

### IPC 通信

通道常量定义在 `src/share/constants/ipc.ts`（`as const`），处理器注册在 `src/main/ipc/` 各文件中。preload 通过 `contextBridge.exposeInMainWorld` 暴露 `window.api` 和 `window.electron` 给渲染进程。

### In-Memory Store

`src/main/store/mainStore.ts` — 基于 `Map<string, unknown>` 的键值存储，set 操作会向所有窗口广播 `store:changed` 事件。不持久化，仅内存。

## 路径别名

| 别名 | 解析 | 可用范围 |
|------|------|----------|
| `@main/*` | `src/main/*` | main |
| `@share/*` | `src/share/*` | main + preload + renderer |
| `@renderer/*` | `src/renderer/src/*` | renderer |
| `@types/*` | `src/types/*` | renderer |
| `@/*` | `src/*` | renderer |

## 关键约定

- 包管理器 **pnpm**，lockfile 为 `pnpm-lock.yaml`
- 生产构建走 `electron-vite`，三个构建目标（main/preload/renderer）独立并行
- `contextIsolation: true` + `nodeIntegration: false`，渲染进程与主进程严格隔离
- TypeScript 分两套 tsconfig：`tsconfig.node.json`（main + preload + share）和 `tsconfig.web.json`（renderer）
- 主进程依赖外部化（`externalizeDeps: true`），node_modules 不打包进 bundle
- 窗口创建通过 `WindowService.open(id)` 而非直接 new，确保注册到注册表中
