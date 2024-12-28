export type Hotkey = { name: string; keys: string[]; display: string }

export const hotkeys = {
  save: { name: 'Сохранить', keys: ['s', 'ы'], display: 'S' },
  focus: { name: 'Фокус', keys: ['f', 'а'], display: 'F' },
  reverso: { name: 'Смотреть на Reverso Context', keys: ['r', 'к'], display: 'R' },
  search: { name: 'Поиск', keys: ['Enter'], display: '➥' },
  clear: { name: 'Очистить', keys: ['Backspace'], display: 'Backspace' },
  'main-page': { name: 'Главная', keys: ['h', 'р'], display: 'H' },
  'saved-page': { name: 'Сохраненные', keys: ['e', 'у'], display: 'E' },
  'recent-page': { name: 'Недавние', keys: ['q', 'й'], display: 'Q' },
  copy: { name: 'Скопировать', keys: ['c', 'с'], display: 'C' },
  'to-search': { name: 'Скопировать в поиск', keys: ['w', 'ц'], display: 'W' },
  bkrs: { name: 'Смотреть на 大БКРС', keys: ['b', 'и'], display: 'B' },
  tools: { name: 'Инструменты', keys: ['t', 'е'], display: 'T' },
} as const satisfies Record<string, Hotkey>
