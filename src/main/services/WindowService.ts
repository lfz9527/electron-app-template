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

  // --- 带确认的关闭请求，返回 Promise<boolean> ---
  private closeRequests = new Map<number, (closed: boolean) => void>()

  async init() {
    // 打开主窗口
    await this.open(WIND_ID.ADMIN)

    // main 窗口关闭时级联关闭所有子窗口，全部确认后才最后关闭自身
    const adminBw = mainWindow.getBrowserWindow()
    adminBw?.on('close', async (e) => {
      e.preventDefault()
      const ok = await this.requestCloseExcept(WIND_ID.ADMIN)
      if (ok) {
        adminBw.destroy()
      }
    })
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

  /** 获取所有已注册窗口的 ID 列表 */
  getAllIds(): string[] {
    return [...this.windows.keys()]
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

  /**
   * 请求关闭窗口，支持单个或批量
   * 窗口有 close 守卫（如确认弹窗）时会等待用户操作
   * @returns true = 全部已关闭（或已销毁），false = 用户取消
   */
  async requestClose(ids: string | string[]): Promise<boolean> {
    const idList = Array.isArray(ids) ? ids : [ids]
    const results = await Promise.all(idList.map((id) => this._requestCloseOne(id)))
    return results.every(Boolean)
  }

  /**
   * 关闭单个窗口并等待结果
   * 调用 bw.close() 触发 close 事件，由窗口自身的守卫拦截
   * 最终通过 closed 事件（确认）或 cancelClose（取消）来 resolve
   */
  private async _requestCloseOne(id: string): Promise<boolean> {
    const win = this.get(id)
    const bw = win?.getBrowserWindow()
    if (!bw || bw.isDestroyed()) return true

    const webContentsId = bw.webContents.id

    return new Promise((resolve) => {
      bw.once('closed', () => {
        this.closeRequests.delete(webContentsId)
        resolve(true)
      })

      this.closeRequests.set(webContentsId, resolve)

      bw.close()
    })
  }

  /** 请求关闭除 exceptId 外的所有已注册窗口，全部确认才返回 true */
  async requestCloseExcept(exceptId: string): Promise<boolean> {
    const otherIds = [...this.windows.keys()].filter((id) => id !== exceptId)
    return this.requestClose(otherIds)
  }

  /**
   * 先关闭互斥窗口再打开目标窗口
   * 互斥窗口有 close 守卫时等待用户确认，取消则不打开
   * @returns true = 成功打开，false = 用户取消互斥窗口的关闭
   */
  async openWithExclusive(id: string, exclusiveIds: string[]): Promise<boolean> {
    const ok = await this.requestClose(exclusiveIds)
    if (!ok) return false
    await this.open(id)
    return true
  }

  /** 渲染进程取消关闭时由 IPC 调用，resolve(false) 通知 requestClose 的等待方 */
  cancelClose(webContentsId: number): void {
    const resolve = this.closeRequests.get(webContentsId)
    if (resolve) {
      this.closeRequests.delete(webContentsId)
      resolve(false)
    }
  }
}

export const windowService = new WindowService()

windowService.register(mainWindow)
windowService.register(loginWindow)
windowService.register(settingWindow)
windowService.register(authorWindow)
