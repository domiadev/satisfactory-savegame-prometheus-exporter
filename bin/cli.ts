#!/usr/bin/env node
import { extractMetrics } from '../src/extractMetrics'
import { loadLocation } from '../src/utils/loadLocation'

const {
  /**
   * A URL or local path to a specific file, or a savegame directory
   */
  SAVEGAME_LOCATION = '',
} = process.env

;(async () => {
  const targetLocation = process.argv[2] || SAVEGAME_LOCATION
  if (!targetLocation) {
    throw new Error('No savegame location provided. Either supply path/url as argument or set SAVEGAME_LOCATION env variable')
  }

  const metricsRegister = await loadLocation(targetLocation).then(extractMetrics)
  console.log(await metricsRegister.metrics())
})().catch(e => {
  console.error(e)
  process.exit(1)
})
