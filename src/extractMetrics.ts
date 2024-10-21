import {
  Parser,
  isBuildableSubsystemSpecialProperties,
  isConveyorChainActorSpecialProperties,
  type ArrayProperty,
  type FloatProperty,
  type Int32Property,
} from '@etothepii/satisfactory-file-parser'
import { Gauge, Registry } from 'prom-client'

const metrics = [
  new Gauge({
    name: 'satisfactory_savegame_buildings_catwalks_and_walkways',
    help: 'Amount of built catwalks and walkways',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_foundations',
    help: 'Amount of built foundations',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_ladders',
    help: 'Amount of built ladders',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_pillars',
    help: 'Amount of built pillars',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_ramps',
    help: 'Amount of built ramps',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_roofs',
    help: 'Amount of built roofs',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_walls',
    help: 'Amount of built walls',
  }),
  new Gauge({
    name: 'satisfactory_savegame_buildings_miners',
    help: 'Amount of built miners',
  }),

  new Gauge({
    name: 'satisfactory_savegame_conveyors_length',
    help: 'Total length of conveyor belts in meters',
  }),

  new Gauge({
    name: 'satisfactory_savegame_pipes_networks',
    help: 'Amount of pipe networks',
  }),

  new Gauge({
    name: 'satisfactory_savegame_powercircuits_amount',
    help: 'How many unique power circuits are in the savegame',
  }),
  new Gauge({
    name: 'satisfactory_savegame_powerlines_amount',
    help: 'Amount of power lines connecting things',
  }),
  new Gauge({
    name: 'satisfactory_savegame_powerlines_length',
    help: 'Total length of power lines in meters',
  }),

  new Gauge({
    name: 'satisfactory_savegame_awesome_points',
    help: 'AWESOME sink points earned, all-time',
  }),
  new Gauge({
    name: 'satisfactory_savegame_awesome_printable',
    help: 'AWESOME coupons that are currently printable',
  }),
]

export const extractMetrics = async (arrayBuffer: ArrayBuffer): Promise<Registry> => {
  const register = new Registry()
  for (const metric of metrics) {
    register.registerMetric(metric)
  }
  register.resetMetrics()

  const save = Parser.ParseSave('MySave', new Uint8Array(arrayBuffer))
  register.setDefaultLabels({ sessionName: save.header.sessionName })

  for (const level of save.levels) {
    for (const object of level.objects) {
      // Buildables with static and non-interactive properties?
      if (object.typePath === '/Script/FactoryGame.FGLightweightBuildableSubsystem') {
        if (!isBuildableSubsystemSpecialProperties(object?.specialProperties)) continue
        for (const buildable of object?.specialProperties?.buildables ?? []) {
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Catwalk')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_catwalks_and_walkways') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Walkway')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_catwalks_and_walkways') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Foundation')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_foundations') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Pillars')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_pillars') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Ramp')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_ramps') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Roof')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_roofs') as Gauge).inc(buildable.instances.length)
            continue
          }
          if (buildable.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Wall')) {
            (register.getSingleMetric('satisfactory_savegame_buildings_walls') as Gauge).inc(buildable.instances.length)
            continue
          }
        }
        continue
      }

      // _some_ walls exist outside the lightweight system. I think its the conveyor walls and doors?
      if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Wall')) {
        (register.getSingleMetric('satisfactory_savegame_buildings_walls') as Gauge).inc()
        continue
      }

      // Ladders can be climbed so I guess they are not lightweight?
      if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Building/Ladder')) {
        (register.getSingleMetric('satisfactory_savegame_buildings_ladders') as Gauge).inc()
        continue
      }

      if (object.typePath === '/Script/FactoryGame.FGPowerCircuit') {
        (register.getSingleMetric('satisfactory_savegame_powercircuits_amount') as Gauge).inc()

        // TODO: consumption & production metrics in MW?
      }
      if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/PowerLine')) {
        // Count segments
        (register.getSingleMetric('satisfactory_savegame_powerlines_amount') as Gauge).inc()

        // Measure length
        const mCachedLength = (object?.properties?.mCachedLength as FloatProperty)?.value
        if (typeof mCachedLength === 'number') {
          (register.getSingleMetric('satisfactory_savegame_powerlines_length') as Gauge).inc(mCachedLength / 100)
        }
        continue
      }

      if (object.typePath.startsWith('/Script/FactoryGame.FGConveyorChainActor')) {
        if (!isConveyorChainActorSpecialProperties(object?.specialProperties)) continue
        // Measure length
        const chainLength = object.specialProperties.totalLength
        if (typeof chainLength === 'number') {
          (register.getSingleMetric('satisfactory_savegame_conveyors_length') as Gauge).inc(chainLength / 100)
        }
        continue
      }

      if (object.typePath === '/Script/FactoryGame.FGPipeNetwork') {
        (register.getSingleMetric('satisfactory_savegame_pipes_networks') as Gauge).inc()

        // TODO: length metric
      }

      // AWESOME Metrics
      if (object.typePath === '/Script/FactoryGame.FGResourceSinkSubsystem') {
        // Total all-time, split by synthetic and DNA
        const mTotalPoints = (object?.properties?.mTotalPoints as ArrayProperty<string>)?.values?.map(s => parseInt(s, 10))
        if (mTotalPoints) {
          (register.getSingleMetric('satisfactory_savegame_awesome_points') as Gauge).set(mTotalPoints.reduce((acc, value) => acc + value, 0))
        }

        // Printable coupons
        const mNumResourceSinkCoupons = (object?.properties?.mNumResourceSinkCoupons as Int32Property)?.value
        if (mNumResourceSinkCoupons) {
          (register.getSingleMetric('satisfactory_savegame_awesome_printable') as Gauge).set(mNumResourceSinkCoupons)
        }
      }

      // Miners
      if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/MinerMk')) {
        (register.getSingleMetric('satisfactory_savegame_buildings_miners') as Gauge).inc()
      }
    }
  }

  return register
}
