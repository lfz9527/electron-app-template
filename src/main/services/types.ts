export interface IService {
  readonly name: string
  init: Global.PromiseVoidFunction
  destroy: Global.PromiseVoidFunction
}
