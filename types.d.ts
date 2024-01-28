import 'next/headers'

declare namespace React {
  export interface HTMLAttributes {
    'data-mdx'?: true
    'data-search'?: true
  }
}
declare module 'next/headers' {
  declare interface ReadonlyRequestCookies {
    somefunc(...args: 'huh' | 'sus'): 1
  }
}
