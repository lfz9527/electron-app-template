import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'

export class AuthorWindow extends BaseWindow {
  readonly id = 'author'

  readonly route = '/author'

  protected getOptions() {
    return defaultOptions
  }
}

export const authorWindow = new AuthorWindow()
