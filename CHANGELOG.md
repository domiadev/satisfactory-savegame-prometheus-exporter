# Changelog

## [2.2.2](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v2.2.1...v2.2.2) (2024-11-17)


### Bug Fixes

* dont treat ServerManager_V2.sav as a savegame ([0da389d](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/0da389d30175c55b3953018c067db90998d58a7f))

## [2.2.1](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v2.2.0...v2.2.1) (2024-10-28)


### Bug Fixes

* include resource consumption from generators ([c57d30e](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/c57d30e446c9a73a016e94935d76ce0fa1ddcfb4))

## [2.2.0](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v2.1.1...v2.2.0) (2024-10-27)


### Features

* `satisfactory_savegame_buildings_lightweight_total` metric ([0c015d2](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/0c015d22fc2983a38c9e68c7e4f45ba73b6cb75c))

## [2.1.1](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v2.1.0...v2.1.1) (2024-10-25)


### Bug Fixes

* correct itemsPerCycle for Desc_OilPump_C miner ([b789fbd](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/b789fbd9d468361ee687157491c24a8759b40d83))
* include production from water extractors ([2777059](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/27770598388e2afc7bef4d3205780287ce4ebd94))
* log caught errors to console when running in express ([60b5959](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/60b5959e7a558486a1ceeafa1eaee196131304ed))
* resourceNodes are instances, not classes ([58ccc25](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/58ccc25d66a2d35c2811b33f2ec4743e86cb57c9))

## [2.1.0](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/compare/v2.0.0...v2.1.0) (2024-10-25)


### Features

* track extraction from resourcenodes ([a0c3e14](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/a0c3e14cc40bc5c886b90740f50c38471cfb2585))


### Bug Fixes

* whoops. forgot to include the resource node list ([566ef92](https://github.com/Sleavely/satisfactory-savegame-prometheus-exporter/commit/566ef92113e4da02f1186aa10480c1a0c0bd6597))

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
