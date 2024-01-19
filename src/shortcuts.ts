export const shortcuts = {
  save: { name: 'Сохранить', keys: ['s', 'ы'] as const, display: ['s'] as const },
  focus: { name: 'Фокус', keys: ['f', 'а'] as const, display: ['f'] as const },
  search: { name: 'Поиск', keys: ['Enter'] as const, display: ['➥'] as const },
  'main-page': { name: 'Главная', keys: ['h', 'р'] as const, display: ['h'] as const },
  'saved-page': { name: 'Сохраненные', keys: ['e', 'у'] as const, display: ['e'] as const },
  'recent-page': { name: 'Недавние', keys: ['q', 'й'] as const, display: ['q'] as const },
} satisfies Record<string, { name: string; keys: string[]; display: string[] }>
