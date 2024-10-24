import { pathToRecipe, staticData } from '../staticData/staticData'
import { type Lookups } from '../types/lookups.type'
import { MetricGroup } from './_MetricGroup'
import {
  type BoolProperty,
  type FloatProperty,
  isObjectProperty,
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
  // if (object.properties?.mExtractableResource && object.typePath.includes('Miner')) {}
  // miner equivalent, should have mExtractableResource
  // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/OilPump')) {}
  // no sure if it has mExtractableResource
  // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/WaterPump')) {}
  // not sure what frackers are called
}
/* eslint-enable no-useless-return */

export {
  metrics as resourcesMetrics,
  parser as resourcesParser,
}
