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

  expect(getSketch('pixelSort')).toStrictEqual(expected)
})

test('retorna o comando certo pra executar o script', () => {
  const regex = /^.+-(\d.\d.\d).+\.exe --sketch=.+(\\|\/)(\w+) --run$/gm;
  const cmd = getProcessingCmd('pixelSort');
  const matches = cmd.match(regex);

  expect(matches).toBeTruthy();
})

test('retorna o caminho da pasta de recursos (fontes)', () => {
  const regex = /(\\|\/)assets$/gm;
  const pathAssets = getAssetsPath('pixelSort');
  const matches = pathAssets.match(regex);

  expect(matches).toBeTruthy();
})

test('retorna o caminho da pasta de arquivos necessários pro script funcionar', () => {
  const regex = /(\\|\/)data$/gm;
  const pathData = getDataPath('pixelSort');
  const matches = pathData.match(regex);

  expect(matches).toBeTruthy();
})

test('retorna o caminho da pasta do arquivo de preparação do script', () => {
  const regex = /(\\|\/)setup.txt$/gm;
  const pathSetup = getSetupFilePath('pixelSort');
  const matches = pathSetup.match(regex);

  expect(matches).toBeTruthy();
})
