import { join } from 'path';

import { ISketch, SketchOption, PPath, PSketchBase, PSketches } from './types/sketch'

export enum PVersions {
  p2 = 'p2',
  p3 = 'p3'
}

export enum PSketchesEnum {
  pixelSort = 'pixelSort'
}

const PPath: PPath = {
  p2: 'C:\\Processing\\processing-2.2.1\\processing-java.exe',
  p3: 'C:\\Processing\\processing-3.5.4\\processing-java.exe'
}

const PSketchBase: PSketchBase = {
  p2: 'C:\\Processing\\sketches-p2',
  p3: 'C:\\Processing\\sketches-p3'
}

const PSketches: PSketches = {
  pixelSort: {
    name: 'pixelsort',
    data: 'pixelsort\\data',
    setup: 'pixelsort\\data\\setup.txt',
    assets: 'pixelsort\\assets',
    version: PVersions.p2,
  }
}

export const getVersion = (sketch: SketchOption): keyof typeof PVersions => PSketches[sketch].version

export const getSketch = (sketch: SketchOption): ISketch => ({...PSketches[sketch]})

export const getProcessingCmd = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return `${PPath[version]} --sketch=${join(PSketchBase[version], PSketches[sketch].name)} --run`
}

export const getAssetsPath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(PSketchBase[version], PSketches[sketch].assets);
}

export const getDataPath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(PSketchBase[version], PSketches[sketch].data);
}

export const getSetupFilePath = (sketch: SketchOption) => {
  const version = getVersion(sketch);

  return join(PSketchBase[version], PSketches[sketch].setup)
}