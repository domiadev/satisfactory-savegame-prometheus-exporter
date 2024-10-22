import { MetricGroup } from './_MetricGroup'
import {
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_pipes')
  .addGauge(
    'networks',
    'Amount of pipe networks',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  if (object.typePath === '/Script/FactoryGame.FGPipeNetwork') {
    metrics.getGauge('networks').inc()

    // TODO: record the Mk of the pipes in the network

    // TODO: length metric

    // TODO: can we easily measure flow rates or volumes of different fluids?
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as pipesMetrics,
  parser as pipesParser,
}
