import {
  getSketch,
  getProcessingCmd,
  getAssetsPath,
} from '../src/sketch';

import { ISketch } from '../src/types/sketch'

test('retorna o sketch', () => {
  const expected: ISketch = {
    name: 'pixelsort',
    assets: 'pixelsort\\assets'
  }

  expect(getSketch('pixelsort')).toStrictEqual(expected)
})

test('retorna o comando certo pra executar o script', () => {
  const regex = /^.+-(\d.\d.\d).+\.exe --sketch=.+(\\|\/)(\w+) --run$/gm;
  const cmd = getProcessingCmd('pixelsort');
  const matches = cmd.match(regex);

  expect(matches).toBeTruthy();
})

test('retorna o caminho da pasta de recursos (fontes)', () => {
  const regex = /(\\|\/)assets$/gm;
  const pathAssets = getAssetsPath('pixelsort');
  const matches = pathAssets.match(regex);

  expect(matches).toBeTruthy();
})
