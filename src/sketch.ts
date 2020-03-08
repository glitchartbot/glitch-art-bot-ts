import { join } from 'path';

import { ISketch, SketchOption, PPath, PSketchBase, PSketches } from './types/sketch'

export enum PVersions {
  p2 = 'p2',
  p3 = 'p3'
}

export enum PSketchesEnum {
  pixelSort = 'pixelSort'
}

const path: PPath = {
  p2: process.env.P2_PATH,
  p3: process.env.P3_PATH
}

const sketchBase: PSketchBase = {
  p2: process.env.P2_SKETCH_BASE,
  p3: process.env.P3_SKETCH_BASE
}

const sketches: PSketches = {
  pixelSort: {
    name: 'pixelsort',
    data: 'pixelsort\\data',
    setup: 'pixelsort\\data\\setup.txt',
    assets: 'pixelsort\\assets',
    version: PVersions.p3,
  }
}

export const getVersion = (sketch: SketchOption): keyof typeof PVersions => sketches[sketch].version

export const getSketch = (sketch: SketchOption): ISketch => ({...sketches[sketch]})

export const getProcessingCmd = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return `${path[version]} --sketch=${join(sketchBase[version] as string, sketches[sketch].name)} --run`
}

export const getAssetsPath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(sketchBase[version] as string, sketches[sketch].assets);
}

export const getDataPath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(sketchBase[version] as string, sketches[sketch].data);
}

export const getSetupFilePath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(sketchBase[version] as string, sketches[sketch].setup)
}