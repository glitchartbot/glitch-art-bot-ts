// got não exporta ou não tem definições
const got = require('got');

import { createWriteStream, writeFileSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import * as sketches from './sketch';
import { promisify } from 'util';

import { Tweet, Media } from './types/tweet';
import { File } from './types/utils';

const pipelineAsync = promisify(pipeline);

const getParentTweetId = (tweet: Tweet) => tweet.in_reply_to_status_id_str 

const hasValidImage = (tweet: Tweet) => 
  Boolean(tweet.entities.media && tweet.entities.media.filter(media => media.type === 'photo').length)

const getFilePath = (sketch: keyof typeof sketches.PSketchesEnum, fileName: string) => join(sketches.getAssetsPath(sketch), fileName)

const getImageUrl = (tweet: Tweet, withSize: boolean) => 
  withSize ?
  (tweet.entities!.media.find((media: Media) => media.type === 'photo')!.media_url).concat('?name=large') :
  tweet.entities!.media.find((media: Media) => media.type === 'photo')!.media_url

const getFileFormat = (tweet: Tweet) => getImageUrl(tweet, false).match(/\.[0-9a-z]+$/i)![0]

const getTweetUrl = (tweet: Tweet) => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

async function downloadImage(uri: string, sketch: keyof typeof sketches.PSketchesEnum, file: File) {
  return await pipelineAsync(
    got.stream(uri),
    createWriteStream(getFilePath(sketch, `${file.name}${file.format}`))
  )
}

function saveInfo(setupPath: string, file: File) {
  try {
    writeFileSync(setupPath, `${file.name},${file.format}`)
  } catch (error) {
    throw error
  }
}

function log(content: any) {
  const json = JSON.stringify(content, null, 2);
  writeFileSync('log.json', json);
}

module.exports = {
  downloadImage,
  getParentTweetId,
  hasValidImage,
  getImageUrl,
  getFilePath,
  getFileFormat,
  saveInfo,
  log,
  getTweetUrl
}