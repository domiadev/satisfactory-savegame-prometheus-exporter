import { MetricGroup } from './_MetricGroup'
import {
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_buildings')
  .addGauge(
    'miners',
    'Amount of built miners (all types)',
    ['mk'],
  )

  .addGauge(
    'smelters',
    'Amount of built smelters',
  )
  .addGauge(
    'foundries',
    'Amount of built foundries',
  )

  .addGauge(
    'constructors',
    'Amount of built constructors',
  )
  .addGauge(
    'assemblers',
    'Amount of built assemblers',
  )
  .addGauge(
    'manufacturers',
    'Amount of built manufacturers',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  // Miners
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Miner')) {
    // Miner MK1 is all caps but Mk2 and Mk3 are mixed case
    const mk = object.typePath.match(/mk(\d)/i)?.at(1)
    metrics.getGauge('miners').inc({ mk })
    return
  }

  // Smelters
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Smelter')) {
    metrics.getGauge('smelters').inc()
    return
  }
  // Foundries
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Foundry')) {
    metrics.getGauge('foundries').inc()
    return
  }

  // Constructors
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Constructor')) {
    metrics.getGauge('constructors').inc()
    return
  }
  // Assemblers
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Assembler')) {
    metrics.getGauge('assemblers').inc()
    return
  }
  // Manufacturers
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Manufacturer')) {
    metrics.getGauge('manufacturers').inc()
    return
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as buildingsMetrics,
  parser as buildingsParser,
}
