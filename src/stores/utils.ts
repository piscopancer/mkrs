import { StoreApi } from '@davstack/store'
import { SafeParseReturnType, ZodSchema } from 'zod'

export type PersistentStoreProps = ReturnType<typeof createPersistentStoreProps>

export function createPersistentStoreProps<O extends object>(args: {
  name: string
  store: StoreApi<O>
  schema: ZodSchema
  /** Modify data from Local Storage */
  modify?: (data: O) => O
  /** Perform action after the store was loaded */
  after?: (parseRes: SafeParseReturnType<O, O>) => void
}) {
  return args
}
