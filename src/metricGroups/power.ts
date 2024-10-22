import { MetricGroup } from './_MetricGroup'
import {
  type FloatProperty,
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_power')
  .addGauge(
    'circuits',
    'Unique power circuits',
  )
  .addGauge(
    'powerlines_amount',
    'Amount of power lines connecting things',
  )
  .addGauge(
    'powerlines_length',
    'Total length of power lines in meters',
  )
  .addGauge(
    'generators_biomass',
    'Biomass generators, excluding the HUB',
  )
  .addGauge(
    'generators_coal',
    'Coal plants',
  )
  .addGauge(
    'generators_fuel',
    'Fuel plants',
  )
  .addGauge(
    'generators_geo',
    'Geothermal generators',
  )
  .addGauge(
    'storage',
    'Power storage buildings',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  if (object.typePath === '/Script/FactoryGame.FGPowerCircuit') {
    metrics.getGauge('circuits').inc()

    // TODO: consumption & production metrics in MW?
  }
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PowerLine')) {
    // Count segments
    metrics.getGauge('powerlines_amount').inc()

    // Measure length
    const mCachedLength = (object?.properties?.mCachedLength as FloatProperty)?.value
    if (typeof mCachedLength === 'number') {
      metrics.getGauge('powerlines_length').inc(mCachedLength / 100)
    }
    return
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass_Automated')) {
    metrics.getGauge('generators_biomass').inc()
    return
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/GeneratorCoal')) {
    metrics.getGauge('generators_coal').inc()
    return
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/GeneratorFuel')) {
    // TODO: should we label by fuel type?
    metrics.getGauge('generators_fuel').inc()
    return
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/GeneratorGeoThermal')) {
    metrics.getGauge('generators_geo').inc()
    return
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PowerStorage')) {
    metrics.getGauge('storage').inc()
    return
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as powerMetrics,
  parser as powerParser,
}
