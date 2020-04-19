// got não exporta ou não tem definições
const got = require('got');

import { createWriteStream, writeFileSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import * as sketches from '../sketch';
import { promisify } from 'util';
import logger from './logger';

import { SketchOption } from '../types/sketch';
import { Tweet, Media } from '../types/twitter/tweet';
import { IFile, ILog } from '../types/utils';

const pipelineAsync = promisify(pipeline);

export const getParentTweetId = (tweet: Tweet) => tweet.in_reply_to_status_id_str 

export const hasValidImage = (tweet: Tweet) => 
  Boolean(tweet.entities.media && tweet.entities.media.filter(media => media.type === 'photo').length)

export const isValidSketch = (sketchName: string): boolean =>
  sketches.getAvailableSketchNames().find(sketch => sketch === sketchName) !== undefined

export const isValidConfig = (text: string): boolean =>
  Boolean(text.trim().match(/^(\w+ {0,}|\w+)((\w+=\d+) {0,}|(\w+=\d+)){0,}$$/gm))

export const getFilePath = (sketch: SketchOption, file: IFile) => join(sketches.getAssetsPath(sketch), `${file.name}${file.format}`)

export const getImageUrl = (tweet: Tweet, withSize: boolean) => 
  withSize ?
  (tweet.entities.media!.find((media: Media) => media.type === 'photo')!.media_url).concat('?name=large') :
  tweet.entities.media!.find((media: Media) => media.type === 'photo')!.media_url

export const getFileFormat = (tweet: Tweet) => getImageUrl(tweet, false).match(/\.[0-9a-z]+$/i)![0]

export const getTweetUrl = (tweet: Tweet) => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

export async function downloadImage(uri: string, sketch: SketchOption, file: IFile) {
  try {
    return await pipelineAsync(
      got.stream(uri),
      createWriteStream(getFilePath(sketch, file))
    )
  } catch (error) {
    throw error;
  }
}

export const prepareOptions = (customOptions: string): string => 
    customOptions
      .trim()
      .replace(/\r?\n|\r/g, ' ')
      .split(' ')
      .filter(el => el) // tirar espaços extras
      .map(el => `--${el}`)
      .join(' ')


export function log(logEntry: ILog): void;
export function log(logEntry: ILog, error: Error): void
export function log(logEntry: ILog, error: Error, tweet: Tweet): void

export function log(logEntry: ILog, error?: Error, tweet?: Tweet): void {
  logger.log(logEntry)

  if (error || tweet) { 
    const json = JSON.stringify({error, tweet}, null, 2)
    const logId = tweet ? tweet.id_str : 'nt_' + Date.now()

    writeFileSync(`logs/${logId}.json`, json)
  }
}