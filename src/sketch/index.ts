import { join } from 'path';

import { sketches, sketchesConfig } from './definitions';
import { ISketch, SketchOption, SketchConfig } from '../types/sketch';
import { CustomObject, Configuration, IFile } from '../types/utils';
import { stringifyConfig, translatePath } from '../util/utils';

export enum PSketchesEnum {
  pixelsort = 'pixelsort',
}

const path = process.env.P3_PATH;
const sketchBase = process.env.P3_SKETCH_BASE;

export const getSketch = (sketchName: SketchOption): ISketch =>
  sketches.find(sketch => sketch.name === sketchName) as ISketch;

export const getAvailableSketchNames = (): string[] => sketches.map(sketch => sketch.name);

export const getSketchConfig = (sketchName: SketchOption): SketchConfig =>
  sketchesConfig.find(sketch => sketch.name === sketchName) as SketchConfig;

export const getAssetsPath = (sketchName: SketchOption) => {
  const sketch = getSketch(sketchName);
  return join(sketchBase as string, translatePath(sketch.assets));
};

export const getOutputPath = (sketchName: SketchOption) => {
  const sketch = getSketch(sketchName);
  return join(sketchBase as string, translatePath(sketch.output));
};

export function getProcessingCmd(sketchName: SketchOption): string;
export function getProcessingCmd(sketchName: SketchOption, configuration: Configuration): string;
export function getProcessingCmd(
  sketchName: SketchOption,
  configuration: Configuration,
  file: IFile
): string;

export function getProcessingCmd(
  sketchName: SketchOption,
  configuration?: Configuration,
  file?: IFile
): string {
  const sketch = getSketch(sketchName);
  const sketchConfig = getSketchConfig(sketchName);
  const purePath = `${path} --sketch=${join(sketchBase as string, sketch.name)} --run`;
  const args = configuration ? stringifyConfig(configuration, sketchConfig.parameters) : '';
  const fileInfo = file ? `filename=${file.name} format=${file.format}` : '';

  return [purePath, args, fileInfo].join(' ').trim();
}
