# satisfactory-savegame-prometheus-exporter

A Prometheus Exporter that generates metrics from local or remote Satisfactory save game files.

[ ![npm version](https://img.shields.io/npm/v/satisfactory-savegame-prometheus-exporter.svg?style=flat) ](https://npmjs.org/package/satisfactory-savegame-prometheus-exporter "View this project on npm") [ ![Docker Image Version](https://img.shields.io/docker/v/sleavely/satisfactory-savegame-prometheus-exporter?label=Docker)
](https://hub.docker.com/r/sleavely/satisfactory-savegame-prometheus-exporter) [ ![Issues](https://img.shields.io/github/issues/Sleavely/satisfactory-savegame-prometheus-exporter.svg?label=Github+issues) ](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/issues)

![Sample Grafana dashboard using the metrics recorded by satisfactory-savegame-prometheus-exporter](https://i.imgur.com/HyFdL6g.png)

## Usage

The `SAVEGAME_LOCATION` environment variable can be a URL or a local path to a file or a folder. If a folder is supplied, it will recursively find the latest file.

While you can run the `bin` scripts with `npm exec cli <savegamelocation>` or `npm exec express <savegamelocation>`, the recommended approach is to use Docker as shown below.

```sh
docker run \
  --rm \
  -p 9772:9772 \
  -e SAVEGAME_LOCATION=https://example.com/satisfactory-savegame.sav \
  sleavely/satisfactory-savegame-prometheus-exporter:latest
```

With Docker Compose:

```yaml
  savegame_metrics_exporter:
    image: sleavely/satisfactory-savegame-prometheus-exporter:latest
    restart: unless-stopped
    volumes:
      - ./config/saved/server:/savegames:ro
    environment:
      - HOST=0.0.0.0
      - PORT=9772
      - SAVEGAME_LOCATION=/savegames
    networks:
      - grafana
    hostname: satisfactory-savegame-metrics
```

On Windows you can mount your savegame directory by referring to `%LocalAppData%`, like this:

```sh
docker run \
  --rm \
  -p 9772:9772 \
  -v %LocalAppData%\FactoryGame\Saved\SaveGames\:/savegames:ro \
  -e SAVEGAME_LOCATION=/savegames \
  sleavely/satisfactory-savegame-prometheus-exporter:latest
```

Then, in your Prometheus configuration `scrape_configs`:

```yaml
  - job_name: "satisfactory-savegame-exporter"
    # How often metrics will be collected.
    # Recommended value is half of your autosave interval.
    scrape_interval: 5m
    static_configs:
      # Only one of these targets is really necessary, but it depends on
      # how you've configured networking for the exporter container and Prometheus.
      - targets:
        - 'localhost:9772'
        - 'host.docker.internal:9772'
        - 'satisfactory-savegame-metrics:9772'
```

For local development we rely on [`tsx`](https://tsx.is/) to skip the build step. Simply call `npm run dev` with your savegame location as an argument:

```sh
npm run dev /mnt/c/Users/potato/AppData/Local/FactoryGame/Saved/SaveGames/
```

## Grafana Dashboard

[grafana.json](./grafana.json) contains a dashboard configuration for metrics using this exporter in tandem with [`Shinigami92/satisfactory-server-prometheus-exporter`](https://github.com/Shinigami92/satisfactory-server-prometheus-exporter)

## Related

- [wolveix/satisfactory-server](https://github.com/wolveix/satisfactory-server) - A Docker image for running a Satisfactory Dedicated Server.
- [Shinigami92/satisfactory-server-prometheus-exporter](https://github.com/Shinigami92/satisfactory-server-prometheus-exporter) - Prometheus Exporter for the metrics exposed from the Satisfactory Dedicated Server
- [etothepii4/satisfactory-file-parser](https://github.com/etothepii4/satisfactory-file-parser) - TypeScript Module to parse Satisfactory save files
- [greeny/SatisfactoryTools](https://github.com/greeny/SatisfactoryTools) - Satisfactory Tools for planning and building the perfect base.
