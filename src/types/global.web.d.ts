declare namespace WebGlobal {
  type ElAttrs<T = unknown> = {
    className?: string
    style?: React.CSSProperties
    onClick?: React.MouseEventHandler<T>
  }
}
