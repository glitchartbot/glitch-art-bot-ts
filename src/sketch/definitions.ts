import { PSketchesEnum } from "./index"
import { SketchConfig } from "../types/sketch"

export const sketches = [
  {
    name: 'pixelsort',
    assets: 'pixelsort\\assets'
  }
]

export const sketchesConfig: SketchConfig[] = [
  {
    name: 'pixelsort' as PSketchesEnum.pixelsort,
    parameters: ['mode']
  }
] 