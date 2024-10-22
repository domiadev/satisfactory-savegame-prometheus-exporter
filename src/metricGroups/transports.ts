import { MetricGroup } from './_MetricGroup'
import {
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_transports')
  .addGauge(
    'hyperloop_entrances',
    'Hyperloop entrances',
  )
  .addGauge(
    'train_stations',
    'Train stations',
  )
  .addGauge(
    'drone_ports',
    'Drone ports',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PipeHyperStart')) {
    metrics.getGauge('hyperloop_entrances').inc()
    return
  }
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation')) {
    metrics.getGauge('train_stations').inc()
    return
  }
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/DroneStation/Build_DroneStation')) {
    metrics.getGauge('drone_ports').inc()
    return
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as transportsMetrics,
  parser as transportsParser,
}
