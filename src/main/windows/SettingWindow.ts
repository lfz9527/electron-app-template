import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'

export class SettingWindow extends BaseWindow {
  readonly id = 'setting'

  readonly route = '/setting'

  protected getOptions() {
    return defaultOptions
  }
}

export const settingWindow = new SettingWindow()
