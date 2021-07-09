import got from 'got';
import { createWriteStream, unlink, promises } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import { getAvailableSketchNames, getAssetsPath, getOutputPath } from '../sketch';
import { promisify } from 'util';
import logger from './logger';

import { SketchName, SketchConfig, ValueBoundary, ValueType } from '../types/sketch';
import { Tweet } from '../types/twitter/tweet';
import { File, Log, Configuration, ValueValidation } from '../types/utils';

const { writeFile } = promises;
const pipelineAsync = promisify(pipeline);

export const getParentTweetId = (tweet: Tweet) => tweet.in_reply_to_status_id_str;

export const hasValidImage = (tweet: Tweet) =>
  Boolean(
    tweet.entities.media && tweet.entities.media.filter(media => media.type === 'photo').length
  );

export const isValidSketch = (sketchName: string): boolean =>
  getAvailableSketchNames().find(sketch => sketch === sketchName) !== undefined;

export const isValidConfig = (text: string): boolean =>
  Boolean(text.trim().match(/^(\w+=\d+( |)+){1,}$/gm));

export const getFilePath = (sketch: SketchName, file: File) =>
  join(getAssetsPath(sketch), `${file.name}${file.extension}`);

export const getOuputPath = (sketch: SketchName, file: File) =>
  join(getOutputPath(sketch), `${file.name}${file.extension}`);

export const removeMentions = (text: string): string =>
  text
    .split(' ')
    .filter(el => !el.startsWith('@') && Boolean(el))
    .join(' ');

export function getImageUrl(tweet: Tweet, withSize: boolean, index: number = 1): string {
  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

  const photos = tweet.extended_entities!.media!.filter(media => media.type === 'photo');
  const finalIndex = clamp(index, 1, photos.length) - 1;

  return withSize
    ? photos![finalIndex].media_url.concat('?name=large')
    : photos![finalIndex].media_url;
}

export const getFileExtension = (tweet: Tweet, index: number = 1) =>
  getImageUrl(tweet, false, index).match(/\.[0-9a-z]+$/i)![0];

export const getTweetUrl = (tweet: Tweet) =>
  `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

export async function downloadImage(uri: string, sketch: SketchName, file: File) {
  try {
    return await pipelineAsync(got.stream(uri), createWriteStream(getFilePath(sketch, file)));
  } catch (error) {
    throw error;
  }
}

export const stringifyConfig = (config: Configuration, whitelist: string[]) =>
  Object.entries(config)
    .filter(([key]) => whitelist.includes(key))
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')

export function resolveText(text: string): string[] {
  const [first, ...rest] = text.split(' ');

  // como eu queria que tivesse pattern matching no javascript...
  if (isValidSketch(first)) return [first, rest.join(' ')];
  else if (isValidConfig(first)) return ['', text];
  else return ['', ''];
}

export const parseConfig = (configText: string) => 
  configText
    .split(' ')
    .map(each => each.split('='))
    .reduce<Configuration>((acc, [key, value]) => ({...acc, ...{[key]: Number(value)}}), {})

const isAllowedValue = (allowed: ValueBoundary, value: number, type: ValueType) => 
  type === 'allowed' ? 
    allowed.includes(value) : 
    value >= allowed[0] && value <= allowed[1];

export function isValidValues(configObj: Configuration, sketchConfig: SketchConfig) {
  const { parameters } = sketchConfig;
  const keys = Object.keys(configObj).filter(key => !['photo', '_'].includes(key));
  let valid: ValueValidation = {
    status: 'success',
    prop: '',
    type: 'allowed',
  };

  for (const key of keys) {
    if (!parameters.includes(key)) continue;

    if (sketchConfig.values[key].type === 'allowed') {
      if (
        !isAllowedValue(
          sketchConfig.values[key].boundaries,
          configObj[key],
          sketchConfig.values[key].type
        )
      ) {
        valid = { status: 'error', prop: key, type: 'allowed' };
        break;
      }
    } else {
      if (
        !isAllowedValue(
          sketchConfig.values[key].boundaries,
          configObj[key],
          sketchConfig.values[key].type
        )
      ) {
        valid = { status: 'error', prop: key, type: 'range' };
        break;
      }
    }
  }

  return valid;
}

export function deleteFile(sketch: SketchName, file: File): void {
  const assets = join(getAssetsPath(sketch), `${file.name}${file.extension}`);
  const output = join(getOutputPath(sketch), `${file.name}${file.extension}`);

  unlink(assets, () => {
    unlink(output, () => {});
  });
}

export const mergeOptions = (defaultOptions: Configuration, customOptions: Configuration) => ({
  ...defaultOptions,
  ...customOptions,
});

export const prepareOptions = (customOptions: string): string =>
  customOptions
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .split(' ')
    .filter(Boolean)
    .join(' ');

export function log(logEntry: Log): void;
export function log(logEntry: Log, error: Error): void;
export function log(logEntry: Log, error: Error, tweet: Tweet): void;

export function log(logEntry: Log, error?: Error, tweet?: Tweet): void {
  logger.log(logEntry);

  if (error || tweet) {
    const json = JSON.stringify({ error, tweet }, null, 2);
    const logId = Date.now();

    writeFile(`logs/${logId}.json`, json);
  }
}
