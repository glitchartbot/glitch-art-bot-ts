import { PVersions, PSketchesEnum } from '../sketch';

export interface ISketch {
  version: PVersions,
  name: string,
  data: string,
  setup: string,
  assets: string
}

export type SketchOption = keyof typeof PSketchesEnum

export type PSketches = {
  [sketch in PSketchesEnum]: ISketch 
}

export type PPath = {
  [version in PVersions]: string
}

export type PSketchBase = {
  [version in PVersions]: string
}