import { join } from 'path';

import { sketchesConfig } from './definitions';
import { SketchName, SketchConfig } from '../types/sketch';
import { Configuration, File } from '../types/utils';
import { stringifyConfig } from '../util/common';

export enum PSketchesEnum {
  pixelsort = 'pixelsort',
  pixeldrift = 'pixeldrift',
}

const path = process.env.P3_PATH;
const sketchBase = process.env.P3_SKETCH_BASE as string;

export const getAvailableSketchNames = (): string[] => sketchesConfig.map(sketch => sketch.name);

export const getSketchConfig = (sketchName: SketchName): SketchConfig =>
  sketchesConfig.find(sketch => sketch.name === sketchName) as SketchConfig;

export const getAssetsPath = (sketchName: SketchName) => join(sketchBase, sketchName, 'assets');

export const getOutputPath = (sketchName: SketchName) => join(sketchBase, sketchName, 'output');

export function getProcessingCmd(sketchName: SketchName, configuration?: Configuration, file?: File): string {
  const sketchConfig = getSketchConfig(sketchName);
  const purePath = `${path} --sketch=${join(sketchBase, sketchConfig.name)} --run`;
  const args = configuration ? stringifyConfig(configuration, sketchConfig.parameters) : '';
  const fileInfo = file ? `filename=${file.name} format=${file.extension}` : '';

  return [purePath, args, fileInfo].join(' ');
}
