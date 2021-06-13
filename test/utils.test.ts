import {
  getFileFormat,
  hasValidImage,
  getParentTweetId,
  getFilePath,
  getTweetUrl,
  getImageUrl,
  downloadImage,
  isValidSketch,
  isValidConfig,
  prepareOptions,
  mergeOptions,
  removeMentions,
  translatePath,
  resolveText,
  isValidValues,
} from '../src/util/common';

import { existsSync, unlinkSync } from 'fs';

import { File, Configuration } from '../src/types/utils';

import * as tweets from './mocks/tweets';
import { getSketchConfig, PSketchesEnum } from '../src/sketch';
import { SketchConfig } from '../src/types/sketch';

test('extrai a extensão correta das imagens', () => {
  expect(getFileFormat(tweets.mediaExtended)).toBe('.jpg');
  expect(getFileFormat(tweets.mediaNotExtended)).toBe('.png');
});

test('retorna a existência de imagem válida no tweet', () => {
  expect(hasValidImage(tweets.noMediaExtended)).toBe(false);
  expect(hasValidImage(tweets.noMediaNotExtended)).toBe(false);
  expect(hasValidImage(tweets.mediaExtended)).toBe(true);
  expect(hasValidImage(tweets.mediaNotExtended)).toBe(true);
});

test('retorna o "tweet pai"', () => {
  expect(getParentTweetId(tweets.sonTweet)).toBe('1235375942924632064');
  expect(getParentTweetId(tweets.orphanTweet)).toBeNull();
});

test('retorna o caminho do arquivo desejado', () => {
  const imagem1: File = {
    name: 'imagem',
    extension: '.jpg',
  };

  //TODO: Corrigir caminho de teste
  expect(getFilePath('pixelsort', imagem1)).toBe(
    'C:\\Processing\\sketches-p3\\pixelsort\\assets\\imagem.jpg'
  );
});

test('retorna a url do tweet', () => {
  expect(getTweetUrl(tweets.sonTweet)).toBe(
    'https://twitter.com/phriaca/status/1235377172883402753'
  );
  expect(getTweetUrl(tweets.orphanTweet)).toBe(
    'https://twitter.com/tthisolddog/status/1235375942924632064'
  );
  expect(getTweetUrl(tweets.mediaExtended)).toBe(
    'https://twitter.com/matheusmosa/status/1235349280120066049'
  );
  expect(getTweetUrl(tweets.noMediaNotExtended)).toBe(
    'https://twitter.com/phriaca/status/1232476926926708737'
  );
});

test('retorna a url da imagem', () => {
  expect(getImageUrl(tweets.mediaExtended, false)).toBe(
    'http://pbs.twimg.com/media/ESTXZQ7XcAAVD3t.jpg'
  );
  expect(getImageUrl(tweets.mediaExtended, true)).toBe(
    'http://pbs.twimg.com/media/ESTXZQ7XcAAVD3t.jpg?name=large'
  );
  expect(getImageUrl(tweets.mediaNotExtended, false)).toBe(
    'http://pbs.twimg.com/media/ERwMESlWkAconTy.png'
  );
  expect(getImageUrl(tweets.mediaNotExtended, true)).toBe(
    'http://pbs.twimg.com/media/ERwMESlWkAconTy.png?name=large'
  );
  expect(getImageUrl(tweets.multipleMediaExtended, false)).toBe(
    'http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg'
  );
  expect(getImageUrl(tweets.multipleMediaExtended, true)).toBe(
    'http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg?name=large'
  );
  expect(getImageUrl(tweets.multipleMediaExtended, true)).toBe(
    'http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg?name=large'
  );
  expect(getImageUrl(tweets.multipleMediaExtended, true, 2)).toBe(
    'http://pbs.twimg.com/media/ESc6pllWsAEirIo.jpg?name=large'
  );
  expect(getImageUrl(tweets.multipleMediaExtended, true, 1)).toBe(
    'http://pbs.twimg.com/media/ESc6pLPWsAEC8Ln.jpg?name=large'
  );
  expect(getImageUrl(tweets.multipleMediaNotExtended, false, 1)).toBe(
    'http://pbs.twimg.com/media/EWAXgzNWkAcpjvs.jpg'
  );
  expect(getImageUrl(tweets.multipleMediaNotExtended, false, -1)).toBe(
    'http://pbs.twimg.com/media/EWAXgzNWkAcpjvs.jpg'
  );
});

test('baixa as imagens', async () => {
  const infoImagem: IFile = {
    name: 'placeholder',
    format: '.png',
  };

  await downloadImage('https://via.placeholder.com/1280', 'pixelsort', infoImagem);
  expect(existsSync(getFilePath('pixelsort', infoImagem))).toBe(true);
  unlinkSync(getFilePath('pixelsort', infoImagem));
});

test('valida se o sketch escolhido é válido', () => {
  const validInputs = ['pixelsort'];
  const validResults = validInputs.filter(isValidSketch);

  const invalidInputs = ['pixelSort', 'pixel sort', 'pixel-sort'];
  const invalidResults = invalidInputs.filter(isValidSketch);

  expect(validResults.length).toBe(validInputs.length);
  expect(invalidResults.length).toBe(0);
});

test('valida se o texto do tweet é válido para configuração', () => {
  const validInputs = [
    ' mode=2 photo=4',
    ' abc=1 def=5',
    'a=3',
    '    a=3 b=5',
    ' mode=2       photo=4',
    'mode=2       photo=4         ',
  ];
  const validResults = validInputs.filter(isValidConfig);

  const invalidInputs = [
    'pixelsort ',
    'pixel-sort --ab',
    ' -a=4',
    ' a=b',
    'mode= 5',
    'mode =5',
    'mode = 5',
    'a-b=5',
    '  a= ab=5 cd=f',
    'ab=6 =t=4',
    'bv=-',
    '6',
    'u-u=5',
  ];
  const invalidResults = invalidInputs.filter(isValidConfig);

  expect(validResults.length).toBe(validInputs.length);
  expect(invalidResults.length).toBe(0);
});

test('prepara as opções removendo caracteres inúteis', () => {
  const expected = '--mode=2 --photo=2';

  const inputs = [
    'mode=2 photo=2',
    '\nmode=2\nphoto=2',
    '\nmode=2 photo=2',
    '    mode=2 photo=2',
    'mode=2     photo=2',
    'mode=2   \n photo=2',
    'mode=2\n   photo=2',
    'mode=2 photo=2   ',
  ];

  const allValid = inputs.filter(el => prepareOptions(el) === expected).length === inputs.length;

  expect(allValid).toBe(true);
});

test('funde as opções com o padrão', () => {
  const expected = {
    photo: 2,
    mode: 1,
  };
  const defaultPixelsort = getSketchConfig('pixelsort');
  const input = { photo: 2 };

  expect(mergeOptions(defaultPixelsort.defaultConfig, input)).toStrictEqual(expected);
});

test('remove as menções desnecessárias do texto', () => {
  const expected = 'photo=2';
  const input = '@AllAboutMariah @MariahCarey @WORLDMUSICAWARD @GlitchArtBot photo=2';

  expect(removeMentions(input)).toBe(expected);
});

test('traduz os caminhos em cada ambiente', () => {
  const NODE_ENV_DEV = 'development';
  const NODE_ENV_PROD = 'production';

  const path_dev = 'sketch\\output';
  const path_prod = 'sketch/output';

  expect(translatePath(path_dev, NODE_ENV_DEV)).toBe(path_dev);
  expect(translatePath(path_dev, NODE_ENV_PROD)).toBe(path_prod);
});

test('ordena corretamente as opções se não tem script', () => {
  const expected1 = ['', 'photo=2'];
  const input1 = '@GlitchArtBot photo=2';
  const withoutMentions1 = removeMentions(input1);
  const output1 = resolveText(withoutMentions1);

  const expected2 = ['pixelsort', 'photo=2'];
  const input2 = '@GlitchArtBot pixelsort photo=2';
  const withoutMentions2 = removeMentions(input2);
  const output2 = resolveText(withoutMentions2);

  const expected3 = ['pixelsort', 'photo=2 mode=2'];
  const input3 = '@GlitchArtBot pixelsort photo=2 mode=2';
  const withoutMentions3 = removeMentions(input3);
  const output3 = resolveText(withoutMentions3);

  const expected4 = ['', 'photo=2 mode=2'];
  const input4 = '@GlitchArtBot photo=2 mode=2';
  const withoutMentions4 = removeMentions(input4);
  const output4 = resolveText(withoutMentions4);

  const expected5 = ['', ''];
  const input5 = '@GlitchArtBot ';
  const withoutMentions5 = removeMentions(input5);
  const output5 = resolveText(withoutMentions5);

  expect(output1[0]).toBe(expected1[0]);
  expect(output1[1]).toBe(expected1[1]);

  expect(output2[0]).toBe(expected2[0]);
  expect(output2[1]).toBe(expected2[1]);

  expect(output3[0]).toBe(expected3[0]);
  expect(output3[1]).toBe(expected3[1]);

  expect(output4[0]).toBe(expected4[0]);
  expect(output4[1]).toBe(expected4[1]);

  expect(output5[0]).toBe(expected5[0]);
  expect(output5[1]).toBe(expected5[1]);
});

test('informa se o valor das opções são válidos', () => {
  const dummySketchConfigAllowed: SketchConfig = {
    name: PSketchesEnum.pixelsort,
    parameters: ['mode'],
    values: {
      mode: {
        boundaries: [1, 2, 3],
        type: 'allowed',
      },
    },
    defaultConfig: {
      photo: 1,
      mode: 1,
    },
  };

  const invalidDummyAllowed: Configuration = {
    mode: 4,
    photo: 3,
  };

  const validDummyAllowed = { ...invalidDummyAllowed, ...{ mode: 1 } };

  const dummySketchConfigRange: SketchConfig = {
    ...dummySketchConfigAllowed,
    ...{ values: { mode: { boundaries: [0, 100], type: 'range' } } },
  };

  const invalidDummyRange: Configuration = {
    mode: 200,
    photo: 1,
  };

  const validDummyRange2: Configuration = {
    mode: 100,
    photo: 1,
  };

  const validDummyRange = { ...invalidDummyRange, ...{ mode: 50 } };

  const error = (prop, type) => ({ status: 'error', prop, type });
  const success = () => ({ status: 'success', prop: '', type: 'allowed' });

  expect(isValidValues(invalidDummyAllowed, dummySketchConfigAllowed)).toStrictEqual(
    error('mode', 'allowed')
  );
  expect(isValidValues(validDummyAllowed, dummySketchConfigAllowed)).toStrictEqual(success());
  expect(isValidValues(invalidDummyRange, dummySketchConfigRange)).toStrictEqual(
    error('mode', 'range')
  );
  expect(isValidValues(validDummyRange, dummySketchConfigRange)).toStrictEqual(success());
  expect(isValidValues(validDummyRange2, dummySketchConfigRange)).toStrictEqual(success());
});
