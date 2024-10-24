import { pathToBuilding } from '../staticData/staticData'
import { type Lookups } from '../types/lookups.type'
import { MetricGroup } from './_MetricGroup'
import {
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_buildings')
  .addGauge(
    'total',
    'Total amount of buildings',
    ['building'],
  )

export const parser = (object: SaveComponent | SaveEntity, lookups: Lookups): void => {
  const building = pathToBuilding(object.typePath)
  if (building) {
    metrics.getGauge('total').inc({ building: building.name })
  }
}

export {
  metrics as buildingsMetrics,
  parser as buildingsParser,
}
