import { join } from 'path';

import { sketches, sketchesConfig } from './definitions';
import { Sketch, SketchName, SketchConfig } from '../types/sketch';
import { Configuration, File } from '../types/utils';
import { stringifyConfig, translatePath } from '../util/common';

export enum PSketchesEnum {
  pixelsort = 'pixelsort',
  pixeldrift = 'pixeldrift',
}

const path = process.env.P3_PATH;
const sketchBase = process.env.P3_SKETCH_BASE;

export const getSketch = (sketchName: SketchName): Sketch =>
  sketches.find(sketch => sketch.name === sketchName) as Sketch;

export const getAvailableSketchNames = (): string[] => sketches.map(sketch => sketch.name);

export const getSketchConfig = (sketchName: SketchName): SketchConfig =>
  sketchesConfig.find(sketch => sketch.name === sketchName) as SketchConfig;

export const getAssetsPath = (sketchName: SketchName) => {
  const sketch = getSketch(sketchName);
  return join(sketchBase as string, translatePath(sketch.assets));
};

export const getOutputPath = (sketchName: SketchName) => {
  const sketch = getSketch(sketchName);
  return join(sketchBase as string, translatePath(sketch.output));
};

export function getProcessingCmd(sketchName: SketchName): string;
export function getProcessingCmd(sketchName: SketchName, configuration: Configuration): string;
export function getProcessingCmd(
  sketchName: SketchName,
  configuration: Configuration,
  file: File
): string;

export function getProcessingCmd(
  sketchName: SketchName,
  configuration?: Configuration,
  file?: File
): string {
  const sketch = getSketch(sketchName);
  const sketchConfig = getSketchConfig(sketchName);
  const purePath = `${path} --sketch=${join(sketchBase as string, sketch.name)} --run`;
  const args = configuration ? stringifyConfig(configuration, sketchConfig.parameters) : '';
  const fileInfo = file ? `filename=${file.name} format=${file.extension}` : '';

  return [purePath, args, fileInfo].join(' ').trim();
}
