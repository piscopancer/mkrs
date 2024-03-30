export const hotkeys = {
  save: { name: 'Сохранить', keys: ['s', 'ы'], display: 's' },
  focus: { name: 'Фокус', keys: ['f', 'а'], display: 'f' },
  search: { name: 'Поиск', keys: ['Enter'], display: '➥' },
  'main-page': { name: 'Главная', keys: ['h', 'р'], display: 'h' },
  'saved-page': { name: 'Сохраненные', keys: ['e', 'у'], display: 'e' },
  'recent-page': { name: 'Недавние', keys: ['q', 'й'], display: 'q' },
  copy: { name: 'Скопировать', keys: ['c', 'с'], display: 'c' },
  'to-search': { name: 'Скопировать в поиск', keys: ['w', 'ц'], display: 'w' },
  bkrs: { name: 'Открыть на 大БКРС', keys: ['b', 'и'], display: 'b' },
  handwriting: { name: 'Рукописный ввод', keys: ['v', 'м'], display: 'v' },
} as const satisfies Record<string, { name: string; keys: string[]; display: string }>
