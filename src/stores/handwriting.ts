// import { proxy } from 'valtio'
// import { z } from 'zod'

// export const handwritingStoreSchema = z.object({
//   strokeSize: z.union([z.literal(15), z.literal(20), z.literal(30)]),
//   canvasSize: z.union([z.literal('sm'), z.literal('base'), z.literal('lg')]),
// })

// const defaultHandwritingStore: z.infer<typeof handwritingStoreSchema> = {
//   strokeSize: 15,
//   canvasSize: 'base',
// }

// export const handwritingStore = proxy({ ...defaultHandwritingStore })
