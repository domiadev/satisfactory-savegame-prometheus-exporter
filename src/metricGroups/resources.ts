import { pathToMiner, pathToRecipe, pathToResourceNode, staticData } from '../staticData/staticData'
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
  if (object.properties?.mCurrentRecipe) {
    if (!isObjectProperty(object.properties.mCurrentRecipe)) return

    // Don't include paused production
    const isStandby = (object.properties?.mIsProductionPaused as BoolProperty)?.value
    if (isStandby) return

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

  // TODO: include resource extraction as production
  if (object.properties?.mExtractableResource) {
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
  // TODO: no sure if frackers or oilpumps have mExtractableResource
  // TODO: Waterpumps arent in staticData.miners
  // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/WaterPump')) {}
}
/* eslint-enable no-useless-return */

export {
  metrics as resourcesMetrics,
  parser as resourcesParser,
}
