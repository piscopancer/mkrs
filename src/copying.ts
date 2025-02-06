export type CopyMode =
  | {
      type: 'ch'
      ch: string
    }
  | {
      type: 'full'
      ch: string
      py: string
      ru: string
    }

type CopyModesProps = { [T in CopyMode['type']]: Omit<CopyMode & { type: T }, 'type'> }

export const copyModes = ['ch', 'full'] as const

export const copyMode = {
  ch: {
    text: 'Иероглиф',
  },
  full: {
    text: 'Полностью',
  },
} satisfies Record<CopyMode['type'], { text: string }>

export async function copy(mode: CopyMode['type'], modes: CopyModesProps) {
  let text = ''

  switch (mode) {
    case 'ch':
      text = modes['ch'].ch
      break
    case 'full':
      const { ch, py, ru } = modes['full']
      text = `${ch} \`${py}\` ${ru}`
      break
  }

  return navigator.clipboard.writeText(text)
}
