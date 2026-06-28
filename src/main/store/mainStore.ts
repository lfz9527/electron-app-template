import Logger from 'electron-log/main'

type Defaults = Global.unknownObj

class MainStore {
  private readonly defaults: Defaults
  private store: Map<string, unknown>

  constructor(defaults: Defaults = {}) {
    this.defaults = defaults
    this.store = new Map(Object.entries(defaults))
  }

  reset(): void {
    this.store = new Map(Object.entries(this.defaults))
    Logger.info('[MainStore] data reset')
  }

  get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined
  }

  set(key: string, value: unknown): void {
    this.store.set(key, value)
  }
}

export const mainStore = new MainStore({})
