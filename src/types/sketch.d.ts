import { PVersions } from '../sketch';

export interface Sketch {
  version: PVersions,
  name: string,
  data: string,
  setup: string,
  assets: string
}



