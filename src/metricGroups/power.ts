import { MetricGroup } from './_MetricGroup'
import { type Lookups } from '../types/lookups.type'
import {
  type BoolProperty,
  type FloatProperty,
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'
import { pathToBuilding, pathToGenerator } from '../staticData/staticData'

const metrics = new MetricGroup('satisfactory_savegame_power')
  .addGauge(
    'circuits_total',
    'Unique power circuits',
  )
  .addGauge(
    'powerlines_meters',
    'Total length of power lines in meters',
  )
  .addGauge(
    'generators_total',
    'Power generating buildings, excluding the HUB',
    ['building'],
  )
  .addGauge(
    'production_megawatts',
    'World-wide power production in MW',
    ['building'],
  )
  .addGauge(
    'storage_megawatthours',
    'Total amount of MWh remaining in all batteries',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity, lookups: Lookups): void => {
  if (object.properties?.mBaseProduction) {
    // powerInfo belonging to a geyser, i.e. Desc_GeneratorGeoThermal_C
    const building = pathToBuilding(lookups.byInstance.get(object.parentEntityName)?.typePath ?? '')
    if (!building) {
      // This happens sometimes but haven't figured out why.
      // It seems transient because the next autosave will usually not encounter it.
      console.error('A non-building with mBaseProduction was encountered', object)
      return
    }
    metrics.getGauge('generators_total').inc({ building: building.name })
    metrics.getGauge('production_megawatts').inc({ building: building.name }, (object.properties?.mBaseProduction as FloatProperty)?.value)
  }
  if (object.properties?.mCurrentFuelClass && !(object.properties?.mIsProductionPaused as BoolProperty)?.value) {
    // Looks like a generator not in standby

    const generator = pathToGenerator(object.typePath)
    const building = pathToBuilding(object.typePath)

    if (!building) {
      // Its a vehicle. Or one of the players are drinking fuel.
      return
    }
    metrics.getGauge('generators_total').inc({ building: building.name })

    // Check if the connected powerInfo object has dynamic production
    const powerInfo = lookups.byInstance.get(`${object.instanceName}.powerInfo`)
    if (!powerInfo) {
      throw new Error(`A generator without powerInfo was encountered: ${object.instanceName}`)
    }

    if ((powerInfo.properties?.mDynamicProductionCapacity as FloatProperty)?.value) {
      metrics.getGauge('production_megawatts').inc({ building: building.name }, (powerInfo.properties?.mDynamicProductionCapacity as FloatProperty).value)
    } else {
      metrics.getGauge('production_megawatts').inc({ building: building.name }, generator.powerProduction)
    }
  }

  if (object.typePath === '/Script/FactoryGame.FGPowerCircuit') {
    metrics.getGauge('circuits_total').inc()
    return
  }
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PowerLine')) {
    // Measure length
    const mCachedLength = (object?.properties?.mCachedLength as FloatProperty)?.value
    if (typeof mCachedLength === 'number') {
      metrics.getGauge('powerlines_meters').inc(mCachedLength / 100)
    }
    return
  }

  // Power storage batteries
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PowerStorage')) {
    if ((object.properties?.mPowerStore as FloatProperty)?.value) {
      metrics.getGauge('storage_megawatthours').inc((object.properties?.mPowerStore as FloatProperty)?.value)
    }
    return
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as powerMetrics,
  parser as powerParser,
}
