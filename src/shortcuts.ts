export const shortcuts = {
  save: { name: 'Сохранить', keys: ['s', 'ы'] as const, display: 's' },
  focus: { name: 'Фокус', keys: ['f', 'а'] as const, display: 'f' },
  search: { name: 'Поиск', keys: ['Enter'] as const, display: '➥' },
  'main-page': { name: 'Главная', keys: ['h', 'р'] as const, display: 'h' },
  'saved-page': { name: 'Сохраненные', keys: ['e', 'у'] as const, display: 'e' },
  'recent-page': { name: 'Недавние', keys: ['q', 'й'] as const, display: 'q' },
  // 'to-top': { name: 'Наверх', keys: ['t', 'е'] as const, display: 't' },
  copy: { name: 'Скопировать', keys: ['c', 'с'] as const, display: 'c' },
} satisfies Record<string, { name: string; keys: string[]; display: string }>
