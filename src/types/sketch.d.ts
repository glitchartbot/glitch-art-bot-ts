import { PSketchesEnum } from '../../src/sketch/index';
import { Configuration } from './utils';

export interface Sketch {
  name: SketchName;
  assets: string;
  output: string;
}

export type SketchName = keyof typeof PSketchesEnum;
export type ValueType = 'range' | 'allowed';
export type ValueBoundary = number[] | [number, number];

export type SketchConfig = {
  name: SketchName;
  parameters: string[];
  values: ParameterValues;
  defaultConfig: Configuration;
};

export interface ParameterValues {
  [key: string]: {
    boundaries: ValueBoundary;
    type: ValueType;
  };
}