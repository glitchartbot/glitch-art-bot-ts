import { PSketchesEnum } from "./index"
import { PSketches, SketchConfig } from "../types/sketch"

export const sketches: PSketches = {
  pixelSort: {
    name: 'pixelsort',
    data: 'pixelsort\\data',
    setup: 'pixelsort\\data\\setup.txt',
    assets: 'pixelsort\\assets'
  }
}

export const sketchesConfig: SketchConfig[] = [
  {
    name: 'pixelSort' as PSketchesEnum.pixelSort,
    parameters: ['mode']
  }
] 