# satisfactory-savegame-prometheus-exporter

## Usage

While you can run the `bin` scripts with `npm exec cli` or `npm exec express`, we recommend the Docker approach:

```sh
docker build -t satisfactory-savegame-prometheus-exporter .
docker run \
  --rm \
  -p 9772:9772 \
  -e SAVEGAME_LOCATION=https://example.com/satisfactory-savegame.sav \
  satisfactory-savegame-prometheus-exporter
```

With Docker Compose:

```yaml
  savegame_metrics_exporter:
    build: https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter.git
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

## Related

- [wolveix/satisfactory-server](https://github.com/wolveix/satisfactory-server) - A Docker image for running a Satisfactory Dedicated Server.
- [Shinigami92/satisfactory-server-prometheus-exporter](https://github.com/Shinigami92/satisfactory-server-prometheus-exporter) - Prometheus Exporter for the metrics exposed from the Satisfactory Dedicated Server
- [etothepii4/satisfactory-file-parser](https://github.com/etothepii4/satisfactory-file-parser) - TypeScript Module to parse Satisfactory save files
