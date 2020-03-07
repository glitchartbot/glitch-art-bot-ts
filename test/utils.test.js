const { getFileFormat } = require('../src/utils');
const tweets = require('./mocks/tweets');

test('extrai a extensão correta das imagens', () => {
  expect(getFileFormat(tweets.mediaExtended)).toBe('.jpg')
  expect(getFileFormat(tweets.mediaNotExtended)).toBe('.png')
})