declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_URL: string
  }
}

declare namespace React {
  export interface HTMLAttributes {
    'data-mdx'?: true
    'data-search'?: true
  }
}
