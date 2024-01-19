import { fonts } from '@/assets/fonts'
import { shortcuts } from '@/shortcuts'
import { classes, objectEntries } from '@/utils'

export default function Shortcuts() {
  return (
    <main>
      <ul className='grid grid-cols-[3fr,2fr,1fr] w-full gap-y-4 items-center'>
        {objectEntries(shortcuts).map(([id, { name, display }]) => (
          <li key={id} className='contents'>
            <p>{name}</p>
            <ul className='flex items-center gap-3 text-zinc-400 text-sm'>
              {display.map((key, i) => (
                <>
                  <li key={key}>
                    <kbd className={classes(fonts.mono, 'px-2 shadow-[0_1px_0_2px_theme(colors.zinc.700)] rounded-md ')}>{key}</kbd>
                  </li>
                  {i !== display.length - 1 && <span>/</span>}
                </>
              ))}
            </ul>
            <output className={classes(fonts.mono, 'text-zinc-400 text-xs justify-self-end bg-zinc-800 w-fit px-2 rounded-full py-0.5')}>{id}</output>
          </li>
        ))}
      </ul>
    </main>
  )
}
