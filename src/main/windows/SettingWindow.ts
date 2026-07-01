import { IPC } from '@share/constants/ipc'
import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'
import { WIND_ID, WIND_ROUTE } from '@share/constants/index'

export class SettingWindow extends BaseWindow {
  readonly id = WIND_ID.SETTING

  readonly route = WIND_ROUTE.SETTING

  protected getOptions() {
    return defaultOptions
  }

  initEvent(): void {
    super.initEvent()

    this.window?.on('close', (e) => {
      e.preventDefault()
      this.window?.webContents.send(IPC.WINDOW_BEFORE_CLOSE)
    })
  }
}

export const settingWindow = new SettingWindow()
