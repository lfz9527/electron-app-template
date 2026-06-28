export interface BaseService {
  init: () => Promise<void>
  destroy: () => Promise<void>
}
