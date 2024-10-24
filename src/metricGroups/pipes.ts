import { MetricGroup } from './_MetricGroup'
import { type Lookups } from '../types/lookups.type'
import {
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_pipes')
  .addGauge(
    'networks_total',
    'Amount of pipe networks',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity, lookups: Lookups): void => {
  if (object.typePath === '/Script/FactoryGame.FGPipeNetwork') {
    metrics.getGauge('networks_total').inc()

    // TODO: length metric

    // TODO: can we easily measure flow rates or volumes of different fluids?
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as pipesMetrics,
  parser as pipesParser,
}
