import { MetricGroup } from './_MetricGroup'
import {
  isConveyorChainActorSpecialProperties,
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_conveyors')
  .addGauge(
    'length',
    'Total length of conveyor belts in meters',
  )

let hasPrinted = false
/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  if (object.typePath.startsWith('/Script/FactoryGame.FGConveyorChainActor')) {
    const props = object.specialProperties
    if (!isConveyorChainActorSpecialProperties(props)) return
    // Measure length
    const chainLength = props.totalLength
    if (typeof chainLength === 'number') {
      metrics.getGauge('length').inc(chainLength / 100)
    }

    // TODO: record the Mk of the conveyors in the chain
    if (!hasPrinted && props.beltsInChain.length === 3) {
      console.log(props)
      hasPrinted = true
    }

    return
  }
}

/* eslint-enable no-useless-return */

export {
  metrics as conveyorsMetrics,
  parser as conveyorsParser,
}
