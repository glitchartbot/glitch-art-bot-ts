import { join } from 'path';

import { sketches, sketchesConfig } from './definitions';
import { ISketch, SketchOption } from '../types/sketch';

export enum PSketchesEnum {
  pixelSort = 'pixelSort'
}

const path = process.env.P3_PATH;
const sketchBase = process.env.P3_SKETCH_BASE;

export const getDefaultConfig = (sketch: SketchOption) => {
  const parameters = sketchesConfig.find(s => s.name === sketch)?.parameters;

  return parameters?.reduce((acc, curr) => {
    acc[curr] = 1;
    return acc;
  }, {} as { [key: string]: number });
}

export const getAvailableSketches = () => 
  Object.keys(sketches).map(sketch => sketch.toLowerCase())

export const getSketch = (sketch: SketchOption): ISketch => ({...sketches[sketch]})

export const getProcessingCmd = (sketch: SketchOption) => 
  `${path} --sketch=${join(sketchBase as string, sketches[sketch].name)} --run`


export const getAssetsPath = (sketch: SketchOption) => 
  join(sketchBase as string, sketches[sketch].assets);


export const getDataPath = (sketch: SketchOption) => 
  join(sketchBase as string, sketches[sketch].data);


export const getSetupFilePath = (sketch: SketchOption) => 
  join(sketchBase as string, sketches[sketch].setup)
