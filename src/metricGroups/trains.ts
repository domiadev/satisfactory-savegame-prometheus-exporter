import { MetricGroup } from './_MetricGroup'
import { type Lookups } from '../types/lookups.type'
import {
  type ArrayProperty,
  type StructProperty,
  type SaveComponent,
  type SaveEntity,
} from '@etothepii/satisfactory-file-parser'
import { getDistance } from '../utils/spatialMath'

const metrics = new MetricGroup('satisfactory_savegame_trains')
  .addGauge(
    'total',
    'Amount of trains',
  )
  .addGauge(
    'tracks_meters',
    'Total length of railroad tracks in meters',
  )

export const parser = (object: SaveComponent | SaveEntity, lookups: Lookups): void => {
  if (object.typePath === '/Game/FactoryGame/Buildable/Vehicle/Train/-Shared/BP_Train.BP_Train_C') {
    metrics.getGauge('total').inc()
  }

  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/Train/Track')) {
    const { totalLength } = (object.properties?.mSplineData as ArrayProperty<StructProperty>)?.values
      ?.reduce<{ totalLength: number, previousPoint: StructProperty | null }>(({ totalLength, previousPoint }, splinePoint) => {
      return {
        totalLength: totalLength + (
          previousPoint
            ? getDistance(previousPoint.value.properties.Location.value, splinePoint.value.properties.Location.value) / 100
            : 0
        ),
        previousPoint: splinePoint,
      }
    }, { totalLength: 0, previousPoint: null })

    metrics.getGauge('tracks_meters').inc(totalLength)
  }
}

export {
  metrics as trainsMetrics,
  parser as trainsParser,
}
