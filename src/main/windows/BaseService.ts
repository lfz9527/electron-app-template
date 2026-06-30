import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { registerDevToolsCommands } from '@main/commands/command'

type BaseBrowserWindow = BrowserWindow | null

export abstract class BaseWindow {
  protected window: BaseBrowserWindow = null

  abstract readonly id: string

  protected abstract getOptions(): BrowserWindowConstructorOptions

  protected abstract load(): Promise<void>

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
