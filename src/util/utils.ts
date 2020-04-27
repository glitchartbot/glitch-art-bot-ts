// got não exporta ou não tem definições
const got = require('got');

import { createWriteStream, writeFileSync, unlink, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import { getAvailableSketchNames, getAssetsPath, getOutputPath } from '../sketch';
import { promisify } from 'util';
import logger from './logger';

import { SketchOption } from '../types/sketch';
import { Tweet, Media } from '../types/twitter/tweet';
import { IFile, ILog, CustomObject, Configuration } from '../types/utils';

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

export const getFilePath = (sketch: SketchOption, file: IFile) =>
  join(getAssetsPath(sketch), `${file.name}${file.format}`);

export const getOuputPath = (sketch: SketchOption, file: IFile) =>
  join(getOutputPath(sketch), `${file.name}${file.format}`);

export const removeMentions = (text: string): string =>
  text
    .trim()
    .split(' ')
    .filter(el => !el.startsWith('@'))
    .join(' ')
    .trim();

export function getImageUrl(tweet: Tweet, withSize: boolean): string;
export function getImageUrl(tweet: Tweet, withSize: boolean, index: number): string;

export function getImageUrl(tweet: Tweet, withSize: boolean, index?: number): string {
  const photos = tweet.extended_entities!.media!.filter(media => media.type === 'photo');
  let finalIndex = 0;

  if (index) {
    if (index - 1 > photos!.length) {
      finalIndex = photos!.length - 1;
    } else {
      finalIndex = index - 1;
    }
  }

  if (finalIndex < 0) finalIndex = 0;

  return withSize
    ? photos![finalIndex].media_url.concat('?name=large')
    : photos![finalIndex].media_url;
}

export const getFileFormat = (tweet: Tweet, index: number = 1) =>
  getImageUrl(tweet, false, index).match(/\.[0-9a-z]+$/i)![0];

export const getTweetUrl = (tweet: Tweet) =>
  `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

export async function downloadImage(uri: string, sketch: SketchOption, file: IFile) {
  try {
    return await pipelineAsync(got.stream(uri), createWriteStream(getFilePath(sketch, file)));
  } catch (error) {
    throw error;
  }
}

export function stringifyConfig(config: Configuration, whitelist: string[]): string {
  let result = '';

  for (const [key, value] of Object.entries(config)) {
    if (whitelist.includes(key)) {
      result += `${key}=${value} `;
    }
  }

  return result.trim();
}

export function resolveText(text: string): string[] {
  let [first, ...rest] = text.split(' ');
  let result: string[] = [];

  if (isValidSketch(first)) {
    result = [first].concat(rest.join(' '));
  } else if (isValidConfig(first)) {
    const configText = [first].concat(rest).join(' ');
    result = [''].concat(configText);
  } else {
    result = ['', ''];
  }

  return result;
}

export function translatePath(path: string, env?: string): string {
  const environment = env ?? (process.env.NODE_ENV as string);
  return environment === 'production' ? path.replace(/\\/g, '/') : path;
}

export function deleteFile(sketch: SketchOption, file: IFile): void {
  const assets = join(getAssetsPath(sketch), `${file.name}${file.format}`);
  const output = join(getOutputPath(sketch), `${file.name}${file.format}`);

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
    .filter(el => el) // tirar espaços extras
    .map(el => `--${el}`)
    .join(' ');

export function log(logEntry: ILog): void;
export function log(logEntry: ILog, error: Error): void;
export function log(logEntry: ILog, error: Error, tweet: Tweet): void;

export function log(logEntry: ILog, error?: Error, tweet?: Tweet): void {
  logger.log(logEntry);

  if (error || tweet) {
    const json = JSON.stringify({ error, tweet }, null, 2);
    const logId = Date.now();

    if (!existsSync('./logs')) {
      mkdirSync('./logs');
    }

    writeFileSync(`logs/${logId}.json`, json);
  }
}
