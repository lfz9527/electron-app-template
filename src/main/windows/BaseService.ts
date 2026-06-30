import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { registerDevToolsCommands } from '@main/commands/command'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

type BaseBrowserWindow = BrowserWindow | null

export abstract class BaseWindow {
  protected window: BaseBrowserWindow = null

  abstract readonly id: string

  protected abstract getOptions(): BrowserWindowConstructorOptions

  protected async load() {
    // 开发模式加载 dev server，生产模式加载打包后的文件
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window!.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.window!.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  async create(): Promise<BaseBrowserWindow> {
    if (this.isCreated() && !this.isDestroyed()) {
      return this.window
    }

    this.window = new BrowserWindow(this.getOptions())

    await this.load()

    this.initEvent()

    return this.window
  }

  initEvent(): void {
    if (this.window) {
      // 注册 DevTools 命令（开发环境自动打开 + F12 切换）
      registerDevToolsCommands(this.window)
    }

    this.window?.on('closed', () => {
      this.window = null
    })
  }

  async show(): Promise<void> {
    if (!this.isCreated()) {
      await this.create()
    }

    this.window?.show()
    this.focus()
  }

  hide(): void {
    this.window?.hide()
  }

  close(): void {
    this.window?.close()
  }

  destroy(): void {
    this.window?.destroy()
  }
  isDestroyed(): boolean {
    return !!this?.window?.isDestroyed()
  }
  getBrowserWindow(): BaseBrowserWindow {
    return this.window
  }

  isCreated(): boolean {
    return !!this.window
  }
  focus(): void {
    this.window?.focus()
  }
}
