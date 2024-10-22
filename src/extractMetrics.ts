import {
  Parser,
} from '@etothepii/satisfactory-file-parser'
import { Registry } from 'prom-client'
import { architectureMetrics, architectureParser } from './metricGroups/architecture'
import { conveyorsMetrics, conveyorsParser } from './metricGroups/conveyors'
import { powerMetrics, powerParser } from './metricGroups/power'
import { awesomeMetrics, awesomeParser } from './metricGroups/awesome'
import { pipesMetrics, pipesParser } from './metricGroups/pipes'
import { buildingsMetrics, buildingsParser } from './metricGroups/buildings'
import { transportsMetrics, transportsParser } from './metricGroups/transports'

export const extractMetrics = async (arrayBuffer: ArrayBuffer): Promise<Registry> => {
  const register = Registry.merge([
    architectureMetrics.register,
    awesomeMetrics.register,
    buildingsMetrics.register,
    conveyorsMetrics.register,
    pipesMetrics.register,
    powerMetrics.register,
    transportsMetrics.register,
  ])

  register.resetMetrics()
  const save = Parser.ParseSave('MySave', new Uint8Array(arrayBuffer))
  register.setDefaultLabels({ sessionName: save.header.sessionName })

  for (const level of save.levels) {
    for (const object of level.objects) {
      architectureParser(object)
      awesomeParser(object)
      buildingsParser(object)
      conveyorsParser(object)
      pipesParser(object)
      powerParser(object)
      transportsParser(object)

      // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/OilRefinery')) {}
      // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/WaterPump')) {}
      // if (object.typePath.startsWith('/Game/FactoryGame/Buildable/Factory/OilPump')) {} // miner equivalent
    }
  }

  return register
}
