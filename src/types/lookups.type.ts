import { type SaveComponent, type SaveEntity } from '@etothepii/satisfactory-file-parser'

export interface Lookups {
  byType: Map<string, SaveComponent | SaveEntity>
  byInstance: Map<string, SaveComponent | SaveEntity>
}
