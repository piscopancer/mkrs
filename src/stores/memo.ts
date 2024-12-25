// import { memoGameSchema } from '@/memo-game'
// import { proxy } from 'valtio'
// import { devtools } from 'valtio/utils'
// import {store} from '@davstack/store'
// import { z } from 'zod'

// export const memoStoreSchema = z.object({
//   currentGame: memoGameSchema.nullable(),
//   gamesPlayed: z.array(memoGameSchema),
//   gameSettings: memoGameSchema.pick({ words: true, seed: true, difficulty: true }),
// })
// const defaultMemoStore: z.infer<typeof memoStoreSchema> = {
//   currentGame: null,
//   gameSettings: {
//     difficulty: 'easy',
//     seed: 0,
//     words: ['小', '大'],
//   },
//   gamesPlayed: [],
// }
// export const memoStore = store(defaultMemoStore, {

// })

// devtools(memoStore)
