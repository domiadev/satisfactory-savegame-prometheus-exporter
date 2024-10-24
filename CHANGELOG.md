# Changelog

## [2.0.0](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v1.0.0...v2.0.0) (2024-10-24)


### ⚠ BREAKING CHANGES

* Many metrics have been removed and are now generically tracked in `satisfactory_savegame_buildings_total`

### Features

* Many metrics have been removed and are now generically tracked in `satisfactory_savegame_buildings_total` ([bdb5efe](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/bdb5efeaeb9bd90ee03abe91b8d314346c7eaad1))
* Power production is `satisfactory_savegame_power_production_megawatts` ([bdb5efe](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/bdb5efeaeb9bd90ee03abe91b8d314346c7eaad1))
* Resource throughput in `satisfactory_savegame_resources_consumption_per_second` and `satisfactory_savegame_resources_production_per_second` ([bdb5efe](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/bdb5efeaeb9bd90ee03abe91b8d314346c7eaad1))
* Stored MWh in `satisfactory_savegame_power_storage_megawatthours` ([bdb5efe](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/bdb5efeaeb9bd90ee03abe91b8d314346c7eaad1))


### Bug Fixes

* When loading from a directory, only filenames ending in `.sav` will be considered. ([bdb5efe](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/bdb5efeaeb9bd90ee03abe91b8d314346c7eaad1))

## 1.0.0 (2024-10-23)


### ⚠ BREAKING CHANGES

* prepare for 1.0

### Features

* label belt segments by Mk ([dc2840e](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/dc2840e75c16b4ee580ae037ebacf239e23b41c5))
* prepare for 1.0 ([c6a8590](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/c6a85908795620a99c1abbd69d5623f589e0034b))


### Bug Fixes

* expose lookup-maps to the parsers ([96667cb](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/96667cb99afd3eb5ce6b8069f12e37c1f6ed7282))
* only print resolved file in dir when LOG_LEVEL is debug ([cc26725](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/cc26725876761777342a9db401399b2b54ec07ee))
