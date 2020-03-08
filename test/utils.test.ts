import { 
  getFileFormat,
  hasValidImage,
  getParentTweetId,
  getFilePath,
  getTweetUrl,
  getImageUrl,
  downloadImage,
  saveSetupInfo
} from '../src/util/utils';

import {
  getSetupFilePath
} from '../src/sketch'

import { 
  existsSync, 
  unlinkSync,
  readFileSync,
  writeFileSync
} from 'fs';

import { IFile } from '../src/types/utils'

import * as tweets from './mocks/tweets';

test('extrai a extensão correta das imagens', () => {
  expect(getFileFormat(tweets.mediaExtended)).toBe('.jpg');
  expect(getFileFormat(tweets.mediaNotExtended)).toBe('.png');
})

test('retorna a existência de imagem válida no tweet', () => {
  expect(hasValidImage(tweets.noMediaExtended)).toBe(false);
  expect(hasValidImage(tweets.noMediaNotExtended)).toBe(false);
  expect(hasValidImage(tweets.mediaExtended)).toBe(true);
  expect(hasValidImage(tweets.mediaNotExtended)).toBe(true);
})

test('retorna o "tweet pai"', () => {
  expect(getParentTweetId(tweets.sonTweet)).toBe('1235375942924632064');
  expect(getParentTweetId(tweets.orphanTweet)).toBeNull();
})

test('retorna o caminho do arquivo desejado', () => {
  const imagem1: IFile = {
    name: 'imagem',
    format: '.jpg'
  }

  expect(getFilePath('pixelSort', imagem1)).toBe('C:\\Processing\\sketches-p3\\pixelsort\\assets\\imagem.jpg');
})

test('retorna a url do tweet', () => {
  expect(getTweetUrl(tweets.sonTweet)).toBe('https://twitter.com/phriaca/status/1235377172883402753');
  expect(getTweetUrl(tweets.orphanTweet)).toBe('https://twitter.com/tthisolddog/status/1235375942924632064');
  expect(getTweetUrl(tweets.mediaExtended)).toBe('https://twitter.com/matheusmosa/status/1235349280120066049');
  expect(getTweetUrl(tweets.noMediaNotExtended)).toBe('https://twitter.com/phriaca/status/1232476926926708737');
})

test('retorna a url da imagem', () => {
  expect(getImageUrl(tweets.mediaExtended, false)).toBe('http://pbs.twimg.com/media/ESTXZQ7XcAAVD3t.jpg');
  expect(getImageUrl(tweets.mediaExtended, true)).toBe('http://pbs.twimg.com/media/ESTXZQ7XcAAVD3t.jpg?name=large');
  expect(getImageUrl(tweets.mediaNotExtended, false)).toBe('http://pbs.twimg.com/media/ERwMESlWkAconTy.png');
  expect(getImageUrl(tweets.mediaNotExtended, true)).toBe('http://pbs.twimg.com/media/ERwMESlWkAconTy.png?name=large');
  expect(getImageUrl(tweets.multipleMediaExtended, false)).toBe('http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg');
  expect(getImageUrl(tweets.multipleMediaExtended, true)).toBe('http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg?name=large');
})

test('baixa as imagens', async () => {
  const infoImagem: IFile = {
    name: 'placeholder',
    format: '.png'
  }

  await downloadImage('https://via.placeholder.com/1280', 'pixelSort', infoImagem);
  expect(existsSync(getFilePath('pixelSort', infoImagem))).toBe(true);
  unlinkSync(getFilePath('pixelSort', infoImagem));
})

test('salva as informações da imagem no arquivo de setup', () => {
  const infoImagem: IFile = {
    name: 'imagem',
    format: '.png'
  }
  const expected = 'imagem,.png'

  saveSetupInfo(getSetupFilePath('pixelSort'), infoImagem);

  const content = readFileSync(getSetupFilePath('pixelSort')).toString();
  expect(content).toBe(expected);
  writeFileSync(getSetupFilePath('pixelSort'), '');
})