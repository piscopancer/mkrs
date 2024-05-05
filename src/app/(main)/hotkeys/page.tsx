import { hotkeys } from '@/hotkeys'
import { objectEntries } from '@/utils'

export default function HotkeysPage() {
  const shortcutsGroups: Record<string, (keyof typeof hotkeys)[]> = {
    Поиск: ['focus', 'search', 'tools'],
    'Взаимодействие со словом': ['save', 'copy', 'to-search', 'bkrs'],
    Навигация: ['main-page', 'recent-page', 'saved-page'],
  }

  return (
    <main className='mb-24'>
      <article>
        <h1 className='mb-8 font-display text-lg font-medium text-zinc-200'>Горячие клавиши</h1>
        <ul className=''>
          {objectEntries(shortcutsGroups).map(([groupName, ids]) => (
            <li key={groupName}>
              <h2 className='mb-2 font-display font-medium'>{groupName}</h2>
              <ul className='mb-8 grid w-full grid-cols-[3fr,2fr,1fr] items-center gap-y-2'>
                {ids
                  .map((id) => [id, hotkeys[id]] as const)
                  .map(([id, shortcut]) => (
                    <li key={shortcut.name} className='contents'>
                      <p className='text-zinc-400'>{shortcut.name}</p>
                      <kbd className='shadow-key w-fit rounded-md px-2 font-mono text-sm text-zinc-400'>{shortcut.display}</kbd>
                      <code className='w-fit justify-self-end rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400'>{id}</code>
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
