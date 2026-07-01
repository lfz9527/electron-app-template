import { BaseWindow } from '../windows/BaseService'
import { WebContents } from 'electron'
import { WIND_ID } from '@share/constants/index'
import { mainWindow } from '@main/windows/MainWindow'
import { loginWindow } from '@main/windows/LoginWindow'
import { settingWindow } from '@main/windows/SettingWindow'
import { authorWindow } from '@main/windows/AuthorWindow'
import type { IService } from './types'

export class WindowService implements IService {
  readonly name: string = 'windowService'
  private readonly windows = new Map<string, BaseWindow>()
  private readonly webContentsMap = new Map<number, BaseWindow>()

  async init() {
    this.open(WIND_ID.ADMIN)
  }
  async destroy() {
    for (const window of this.windows.values()) {
      if (!window.isDestroyed()) {
        window?.destroy()
      }
    }
  }

  destroyById(id: string) {
    this.windows.get(id)?.destroy()
  }

  register(window: BaseWindow) {
    this.windows.set(window.id, window)
  }

  getByWebContents(webContents: WebContents) {
    return this.webContentsMap.get(webContents.id)
  }

  get(id: string) {
    return this.windows.get(id)
  }

  async open(id: string) {
    const window = this.get(id)
    if (!window) return
    const browserWindow = await window.create()
    if (!browserWindow) return
    const webContentsId = browserWindow.webContents.id
    if (!this.webContentsMap.has(webContentsId)) {
      this.webContentsMap.set(webContentsId, window)
      browserWindow.once('closed', () => {
        this.webContentsMap.delete(webContentsId)
      })
    }

    await window.show()
  }

  close(id: string) {
    this.windows.get(id)?.close()
  }

  closeAll() {
    for (const window of this.windows.values()) {
      window.close()
    }
  }
}

export const windowService = new WindowService()

windowService.register(mainWindow)
windowService.register(loginWindow)
windowService.register(settingWindow)
windowService.register(authorWindow)
