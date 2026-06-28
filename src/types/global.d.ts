declare namespace Global {
  type unknownObj<V = unknown> = Record<string, V>
  type unknownFunction<R = unknown> = (...args: unknown[]) => R

  // 没有参数,但是有返回值
  type NotArgReturnFunc<R = unknown> = () => R
  // 一个参数,但是没返回值
  type OneArgVoidFunction<T = string> = (arg: T) => void
  // 一个promise函数但是没有返回值
  type PromiseVoidFunction = () => Promise<void>
}
