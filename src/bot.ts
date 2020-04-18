const twit = require('twit')

import { readFileSync } from 'fs';
import { keys } from './config';
import * as utils from './util/utils';

import { Get } from './types/twit';
import { Params } from './types/api';
import { Tweet } from './types/twitter/tweet';
import { UploadedMedia } from './types/twitter/media';
import { SketchOption } from './types/sketch';
import { ExtendedError, IFile } from './types/utils';

const twitter = new twit(keys);
export const ID = '1232403291151196160';

function uploadTweet(params: Params): Promise<Tweet> { 
  return twitter.post('statuses/update', params)
    .then((res: Get<Tweet>) => res.data)
    .catch((error: Error) => { throw error; })
}

function uploadImage(sketch: SketchOption, file: IFile): Promise<UploadedMedia> {
  const filePath = utils.getFilePath(sketch, file);
  const b64 = readFileSync(filePath, { encoding: 'base64' });
  const params: Params = { media_data: b64 };

  return twitter.post('media/upload', params)
    .then((res: Get<UploadedMedia>) => res.data)
    .catch((error: ExtendedError) => { throw error; })
}

export function getTweetById(tweetId: string): Promise<Tweet> {
  const params: Params = { id: tweetId, tweet_mode: 'extended' }

  return twitter.get('statuses/show', params)
    .then((res: Get<Tweet>) => res.data)
    .catch((error: ExtendedError) => { 
      error.id = tweetId; 
      throw error; 
    })
}

export function listenQuery(query: string | string[], callback: Function) {
  const stream = twitter.stream('statuses/filter', { track: query })
  stream.on('tweet', callback)
}

export function replyTweet(tweetId: string): Promise<Tweet>
export function replyTweet(tweetId: string, status?: string, sketch?: SketchOption, file?: IFile): Promise<Tweet>

export async function replyTweet(tweetId: string, status?: string, sketch?: SketchOption, file?: IFile): Promise<Tweet> {
  try {
    const tweet = await getTweetById(tweetId);
    const screenName = tweet.user.screen_name;
    let uploaded: UploadedMedia;
    let params: Params = {
      in_reply_to_status_id: tweet.id_str, 
      status: `@${screenName}` 
    };
  
    if (file && sketch) {
      uploaded = await uploadImage(sketch, file);
      params.media_ids = [uploaded.media_id_string];
    }
    
    if (status) {
      params.status += ` ${status}`;
    }
  
    return await uploadTweet(params);
  } catch (error) {
    throw error;
  }
} 