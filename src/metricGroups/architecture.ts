import { isBuildableSubsystemSpecialProperties, type SaveComponent, type SaveEntity } from '@etothepii/satisfactory-file-parser'
import { MetricGroup } from './_MetricGroup'

const metrics = new MetricGroup('satisfactory_savegame_architecture')
  .addGauge(
    'catwalkways',
    'Amount of built catwalks and walkways',
  )
  .addGauge(
    'foundations',
    'Amount of built foundations',
  )
  .addGauge(
    'pillars',
    'Amount of built pillars',
  )
  .addGauge(
    'ramps',
    'Amount of built ramps',
  )
  .addGauge(
    'roofs',
    'Amount of built roofs',
  )
  .addGauge(
    'walls',
    'Amount of built walls',
  )
  .addGauge(
    'ladders',
    'Amount of built ladders',
  )

/* eslint-disable no-useless-return */
export const parser = (object: SaveComponent | SaveEntity): void => {
  if (object.typePath === '/Script/FactoryGame.FGLightweightBuildableSubsystem') {
    if (!isBuildableSubsystemSpecialProperties(object?.specialProperties)) return

    for (const buildable of object?.specialProperties?.buildables ?? []) {
      if (
        buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Catwalk') ||
        buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Walkway')
      ) {
        metrics.getGauge('catwalkways').inc(buildable.instances.length)
        return
      }

      if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Foundation')) {
        metrics.getGauge('foundations').inc(buildable.instances.length)
        continue
      }
      if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Pillars')) {
        metrics.getGauge('pillars').inc(buildable.instances.length)
        continue
      }
      if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Ramp')) {
        metrics.getGauge('pillars').inc(buildable.instances.length)
        continue
      }
      if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Roof')) {
        metrics.getGauge('roofs').inc(buildable.instances.length)
        continue
      }
      if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Wall')) {
        metrics.getGauge('walls').inc(buildable.instances.length)
        continue
      }
    }
  }
  // _some_ walls exist outside the lightweight system. I think its the conveyor walls and doors?
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Wall')) {
    metrics.getGauge('walls').inc()
    return
  }

  // Ladders can be climbed so I guess they are not lightweight?
  if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Ladder')) {
    metrics.getGauge('ladders').inc()
    return
  }
}
/* eslint-enable no-useless-return */

export {
  metrics as architectureMetrics,
  parser as architectureParser,
}
