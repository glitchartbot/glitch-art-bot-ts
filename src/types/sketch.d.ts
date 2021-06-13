import { PSketchesEnum } from '../../src/sketch/index';
import { Configuration } from './utils';

export interface Sketch {
  name: SketchName;
  assets: string;
  output: string;
}

export type SketchName = keyof typeof PSketchesEnum;

export type SketchConfig = {
  name: SketchName;
  parameters: string[];
  values: ParameterValues;
  defaultConfig: Configuration;
};

export interface ParameterValues {
  [key: string]: {
    boundaries: number[] | [number, number];
    type: 'range' | 'allowed';
  };
}