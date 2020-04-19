import { join } from 'path';

import { sketches, sketchesConfig } from './definitions';
import { ISketch, SketchOption } from '../types/sketch';

export enum PSketchesEnum {
  pixelsort = 'pixelsort'
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

export const getAvailableSketchNames = (): string[] =>
  sketches.map(sketch => sketch.name)

export const getSketch = (sketchName: SketchOption): ISketch => 
  sketches.find(sketch => sketch.name === sketchName) as ISketch;

export const getProcessingCmd = (sketchName: SketchOption) => {
  const sketch = getSketch(sketchName);
  return `${path} --sketch=${join(sketchBase as string, sketch.name)} --run`
}


export const getAssetsPath = (sketchName: SketchOption) => {
  const sketch = getSketch(sketchName);
  return join(sketchBase as string, sketch.assets);
}