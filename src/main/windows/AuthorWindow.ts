import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'
import { WIND_ID, WIND_ROUTE } from '@share/constants/index'

export class AuthorWindow extends BaseWindow {
  readonly id = WIND_ID.AUTHOR

  readonly route = WIND_ROUTE.AUTHOR

  protected getOptions() {
    return defaultOptions
  }
}

export const authorWindow = new AuthorWindow()
