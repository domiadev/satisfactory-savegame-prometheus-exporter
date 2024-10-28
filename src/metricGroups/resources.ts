import { pathToGenerator, pathToItem, pathToMiner, pathToRecipe, pathToResourceNode, staticData } from '../staticData/staticData'
import { type Lookups } from '../types/lookups.type'
import { MetricGroup } from './_MetricGroup'
import {
  type BoolProperty,
  type FloatProperty,
  isObjectProperty,
  type ObjectProperty,
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'

const metrics = new MetricGroup('satisfactory_savegame_resources')
  .addGauge(
    'consumption_per_second',
    'Usage of items per second across all configured recipes and extractors',
    ['item'],
  )
  .addGauge(
    'production_per_second',
    'Creation of items per second',
    ['item'],
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity, lookups: Lookups): void => {
  // Don't include manually paused buildings
  const isStandby = (object?.properties?.mIsProductionPaused as BoolProperty)?.value
  if (isStandby) return

  if (object.properties?.mCurrentRecipe) {
    if (!isObjectProperty(object.properties.mCurrentRecipe)) return

    // Clock speed affects the recipe rates
    const clockSpeed =
      (object.properties?.mCurrentPotential as FloatProperty)?.value ??
      (object.properties?.mPendingPotential as FloatProperty)?.value ??
      1

    const recipe = pathToRecipe(object.properties.mCurrentRecipe.value.pathName)

    for (const ingredient of recipe.ingredients) {
      const item = staticData.items[ingredient.item]
      metrics.getGauge('consumption_per_second').inc({ item: item.name }, (ingredient.amount / recipe.time) * clockSpeed)
    }
    for (const product of recipe.products) {
      const item = staticData.items[product.item]
      metrics.getGauge('production_per_second').inc({ item: item.name }, (product.amount / recipe.time) * clockSpeed)
    }
    return
  }

  // #region Resource extraction
  if (object.properties?.mExtractableResource) {
    // Waterpumps refer to undocumented bodies of water as their resource nodes, so we treat them differently.
    if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/WaterPump')) {
      const item = staticData.items.Desc_Water_C
      const miner = pathToMiner(object.typePath)
      if (!miner) throw new Error('Miner not found: ' + object.typePath)
      const extractionPerSecond = miner.itemsPerCycle / miner.extractCycleTime
      const clockSpeed =
        (object.properties?.mCurrentPotential as FloatProperty)?.value ??
        (object.properties?.mPendingPotential as FloatProperty)?.value ??
        1
      metrics.getGauge('production_per_second').inc({ item: item.name }, extractionPerSecond * clockSpeed)
      return
    }

    // Geothermal generates only power, but their implementation make it seem like they produce "Desc_Geyser_C" which is.. interesting.
    if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/GeneratorGeoThermal/Build_GeneratorGeoThermal')) return

    // TODO: fracking is also different, but in its own ✨special✨ way
    // The smasher is the parent that can be turned on and off, but the extractors are the ones sitting on the nodes (with potentially varying purity?)
    if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/FrackingSmasher')) return
    if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/FrackingExtractor')) return

    const resource = pathToResourceNode((object.properties.mExtractableResource as ObjectProperty).value.pathName)
    if (!resource) throw new Error('Resource not found: ' + (object.properties.mExtractableResource as ObjectProperty).value.pathName)

    const item = staticData.items[resource.item]
    if (!item) throw new Error('Item not found: ' + resource.item)

    const miner = pathToMiner(object.typePath)
    if (!miner) throw new Error('Miner not found: ' + object.typePath)

    const extractionPerSecond = miner.itemsPerCycle / miner.extractCycleTime
    const clockSpeed =
      (object.properties?.mCurrentPotential as FloatProperty)?.value ??
      (object.properties?.mPendingPotential as FloatProperty)?.value ??
      1
    metrics.getGauge('production_per_second').inc({ item: item.name }, extractionPerSecond * resource.purity * clockSpeed)
  }
  // #endregion

  // #region Generator consumption
  // TODO: water consumption in e.g. generators isnt included yet. Should look at waterToPowerRatio on the generators staticData
  // TODO: none of the generators consumption seems to be included yet. e.g. Coal
  if (object.properties?.mCurrentFuelClass) {
    const generator = pathToGenerator(object.typePath)
    if (!generator) return // Its a vehicle. Or a jetpack. Or one of the players are drinking fuel.

    const fuel = pathToItem((object.properties.mCurrentFuelClass as ObjectProperty).value.pathName)
    if (!fuel) throw new Error('Fuel not found: ' + (object.properties.mCurrentFuelClass as ObjectProperty).value.pathName)

    const clockSpeed =
      (object.properties?.mCurrentPotential as FloatProperty)?.value ??
      (object.properties?.mPendingPotential as FloatProperty)?.value ??
      1

    const fuelPerSecond = 1 / (fuel.energyValue / (generator.powerProduction * clockSpeed))
    metrics.getGauge('consumption_per_second').inc({ item: fuel.name }, fuelPerSecond)

    const water = staticData.items.Desc_Water_C
    if (generator.className === 'Desc_GeneratorCoal_C') {
      metrics.getGauge('consumption_per_second').inc({ item: water.name }, (45 / 60) * clockSpeed)
    }
    if (generator.className === 'Desc_GeneratorNuclear_C') {
      metrics.getGauge('consumption_per_second').inc({ item: water.name }, (240 / 60) * clockSpeed)
    }
  }
  // #endregion
}
/* eslint-enable no-useless-return */

export {
  metrics as resourcesMetrics,
  parser as resourcesParser,
}
