import { PSketchesEnum } from '../../src/sketch/index';

export interface ISketch {
  name: string,
  data: string,
  setup: string,
  assets: string
}

export type SketchOption = keyof typeof PSketchesEnum

export type PSketches = {
  [sketch in PSketchesEnum]: ISketch 
}

export type SketchConfig = {
  name: PSketchesEnum,
  parameters: string[]
}