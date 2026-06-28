import { Tray, Menu, app, nativeImage } from 'electron'
import { join } from 'path'
import { BaseService } from './types'
import Logger from 'electron-log/main'

class TrayService implements BaseService {
  private tray: Tray | null = null

  private getIconPath(): string {
    return join(__dirname, '../../resources/icon.png')
  }

  async init(): Promise<void> {
    const icon = nativeImage.createFromPath(this.getIconPath())
    this.tray = new Tray(icon.resize({ width: 16, height: 16 }))

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: (): void => {
          // TODO: 配合 WindowManager 显示主窗口
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: (): void => {
          app.quit()
        }
      }
    ])

    this.tray.setToolTip('Electron App')
    this.tray.setContextMenu(contextMenu)

    Logger.info('[TrayService] initialized')
  }

  async destroy(): Promise<void> {
    this.tray?.destroy()
    this.tray = null
    Logger.info('[TrayService] destroyed')
  }
}

export const trayService = new TrayService()
