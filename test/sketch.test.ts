import {
  getVersion,
  getSketch,
  getProcessingCmd,
  getAssetsPath,
  getDataPath,
  getSetupFilePath,
  PVersions
} from '../src/sketch';

import { ISketch } from '../src/types/sketch'

test('retorna a versão do sketch', () => {
  const p3 = 'p3'
  const p2 = 'p2'
  
  expect(getVersion('pixelSort')).toBe(p3)
})

test('retorna o sketch', () => {
  const expected: ISketch = {
    name: 'pixelsort',
    data: 'pixelsort\\data',
    setup: 'pixelsort\\data\\setup.txt',
    assets: 'pixelsort\\assets',
    version: PVersions.p3,
  }

  expect(getSketch('pixelSort')).toBe(expected)
})
