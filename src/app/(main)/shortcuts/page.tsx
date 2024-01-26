import { shortcuts } from '@/shortcuts'
import { objectEntries } from '@/utils'

export default function Shortcuts() {
  const shortcutsGroups: Record<string, (keyof typeof shortcuts)[]> = {
    Поиск: ['focus', 'search'],
    'Взаимодействие со словом': ['save', 'copy'],
    Навигация: ['main-page', 'recent-page', 'saved-page'],
  }

  return (
    <main className='mb-24'>
      <article>
        <h1 className='text-lg font-display text-zinc-200 uppercase mb-8'>горячие клавиши</h1>
        <ul className=''>
          {objectEntries(shortcutsGroups).map(([groupName, ids]) => (
            <li key={groupName}>
              <h2 className='mb-4 font-display uppercase'>{groupName}</h2>
              <ul className='grid grid-cols-[3fr,2fr,1fr] w-full gap-y-2 items-center mb-10'>
                {ids
                  .map((id) => [id, shortcuts[id]] as const)
                  .map(([id, shortcut]) => (
                    <li key={shortcut.name} className='contents'>
                      <p className='text-zinc-400'>{shortcut.name}</p>
                      <kbd className='font-mono w-fit px-2 shadow-[0_1px_0_2px_theme(colors.zinc.700)] rounded-md text-zinc-400 text-sm'>{shortcut.display}</kbd>
                      <code className='font-mono text-zinc-400 text-xs justify-self-end bg-zinc-800 w-fit px-2 rounded-full py-0.5'>{id}</code>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </article>
    </main>
  )
}
