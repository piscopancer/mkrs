export type TResult = 'words' | 'word' | 'suggest-from-pinyin' | 'pinyin-not-found' | 'suggest-from-ru' | 'error'

export function determineSearchResult(d: Element): TResult {
  if (d.querySelector('.tbl_bywords')) return 'words'
  if (d.querySelector('#ch')) return 'word'
  if (d.querySelector('#py_table')) return 'suggest-from-pinyin'
  if (d.querySelector('#py_search_py') && d.querySelector('#no-such-word')) return 'pinyin-not-found'
  if (d.querySelector('#ru_ru') && d.querySelector('#no-such-word')) return 'suggest-from-ru'
  return 'error'
}
