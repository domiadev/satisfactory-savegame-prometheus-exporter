#!/usr/bin/env node
import express from 'express'
import { loadLocation } from '../src/utils/loadLocation'
import { extractMetrics } from '../src/extractMetrics'

const {
  /**
   * A URL or local path to a specific file, or a savegame directory
   */
  SAVEGAME_LOCATION = '',

  PORT = '9772',
  HOST = '0.0.0.0',
} = process.env

const targetLocation = process.argv[2] || SAVEGAME_LOCATION
if (!targetLocation) {
  throw new Error('No savegame location provided. Either supply path/url as argument or set SAVEGAME_LOCATION env variable')
}

const app = express()

app.get('/', (_req, res) => {
  res.send(`<html lang="en">
  <head>
    <title>Satisfactory Savegame Prometheus Exporter</title>
  </head>
  <body>
    <h1>Satisfactory Savegame Prometheus Exporter</h1>
    <p><a href="/metrics">Metrics</a></p>
  </body>
</html>
`)
})

app.get('/metrics', (_req, res) => {
  loadLocation(targetLocation)
    .then(extractMetrics)
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    .then((metricsRegister) => {
      res.set('Content-Type', metricsRegister.contentType)
      return metricsRegister.metrics()
    })
    .then(metricsOutput => {
      res.end(metricsOutput)
    })
    .catch((err: unknown) => {
      console.error(err)
      if (err instanceof Error) {
        res.status(500).end(`# ${err.message}`)
      } else {
        res.status(500).end(`# ${String(err)}`)
      }
    })
})

app.listen(parseInt(PORT, 10), HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
})

// Listen for SIGINT (Ctrl+C) and SIGTERM (docker stop)
process.on('SIGINT', () => {
  process.exit()
})
process.on('SIGTERM', () => {
  process.exit()
})
