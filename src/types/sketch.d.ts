import { PSketchesEnum } from '../../src/sketch/index';
import { Configuration } from './utils';

export interface ISketch {
  name: string;
  assets: string;
  output: string;
}

export type SketchOption = keyof typeof PSketchesEnum;

export type SketchConfig = {
  name: PSketchesEnum;
  parameters: string[];
  values: ValueRange;
  defaultConfig: Configuration;
};

export interface ValueRange {
  [key: string]: { range?: [number, number]; allowed?: number[] };
}
