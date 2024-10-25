/**
 * data.json types extrapolated with https://app.quicktype.io/
 */
export interface StaticData {
  items: Record<string, Item>
  recipes: Record<string, Recipe>
  schematics: Record<string, Schematic>
  generators: Generators
  resources: Record<string, Resource>
  miners: Miners
  buildings: Record<string, Building>
}

export interface Building {
  slug: string
  name: string
  description: string
  className: string
  categories: unknown[]
  buildMenuPriority: number
  metadata: Metadata
  size: Size
}

export interface Metadata {
  powerConsumption: number
  powerConsumptionExponent: number
  manufacturingSpeed: number
}

export interface Size {
  width: number
  height: number
  length: number
}

export interface Generators {
  Desc_GeneratorCoal_C: DescGenerator
  Desc_GeneratorNuclear_C: DescGenerator
  Desc_GeneratorFuel_C: DescGenerator
  Desc_GeneratorBiomass_Automated_C: DescGenerator
}

export interface DescGenerator {
  className: string
  fuel: string[]
  powerProduction: number
  powerProductionExponent: number
  waterToPowerRatio: number
}

export interface Item {
  slug: string
  name: string
  description: string
  sinkPoints: number
  className: string
  stackSize: number
  energyValue: number
  radioactiveDecay: number
  liquid: boolean
  fluidColor: Color
}

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

export interface Miners {
  Desc_OilPump_C: Miner
  Desc_MinerMk2_C: Miner
  Desc_FrackingExtractor_C: Miner
  Desc_MinerMk3_C: Miner
  Desc_MinerMk1_C: Miner
}

export interface Miner {
  className: string
  allowedResources: string[]
  allowLiquids: boolean
  allowSolids: boolean
  itemsPerCycle: number
  extractCycleTime: number
}

export interface Recipe {
  slug: string
  name: string
  className: string
  alternate: boolean
  time: number
  inHand: boolean
  forBuilding: boolean
  inWorkshop: boolean
  inMachine: boolean
  manualTimeMultiplier: number
  ingredients: Ingredient[]
  products: Ingredient[]
  producedIn: ProducedIn[]
  isVariablePower: boolean
  minPower: number
  maxPower: number
}

export interface Ingredient {
  item: string
  amount: number
}

export type ProducedIn = 'Desc_ConstructorMk1_C' | 'Desc_SmelterMk1_C' | 'Desc_Blender_C' | 'Desc_Packager_C' | 'Desc_Converter_C' | 'Desc_HadronCollider_C' | 'Desc_QuantumEncoder_C' | 'Desc_OilRefinery_C' | 'Desc_ManufacturerMk1_C' | 'Desc_AssemblerMk1_C' | 'Desc_FoundryMk1_C'

export interface Resource {
  item: string
  pingColor: Color
  speed: number
}

export interface Schematic {
  className: string
  type: Type
  name: string
  slug: string
  cost: Ingredient[]
  unlock: Unlock
  requiredSchematics: string[]
  tier: number
  time: number
  mam: boolean
  alternate: boolean
}

export type Type = 'EST_MAM' | 'EST_HardDrive' | 'EST_ResourceSink' | 'EST_Milestone' | 'EST_Alternate' | 'EST_Customization' | 'EST_Tutorial'

export interface Unlock {
  recipes: string[]
  scannerResources: string[]
  inventorySlots: number
  giveItems: Ingredient[]
}
