import {
  type Building,
  type DescGenerator,
  type Generators,
  type Item,
  type Recipe,
  type StaticData,
} from '../types/staticData.types'
import rawJsonData from './data.json'

export const staticData = rawJsonData as StaticData

/**
 * @example Input path: '/Game/FactoryGame/Recipes/Smelter/Recipe_IngotCopper.Recipe_IngotCopper_C'
 */
const pathToClassName = (path: string): string => {
  const className = (path.split('.').at(1) ?? '').replace(/^Build_/, 'Desc_')
  return className
}

export const pathToBuilding = (path: string): Building => {
  return staticData.buildings[pathToClassName(path) as keyof Generators]
}

export const pathToGenerator = (path: string): DescGenerator => {
  return staticData.generators[pathToClassName(path) as keyof Generators]
}

export const pathToItem = (path: string): Item => {
  return staticData.items[pathToClassName(path)]
}

export const pathToRecipe = (path: string): Recipe => {
  return staticData.recipes[pathToClassName(path)]
}
