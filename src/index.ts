import './util/secrets';

import * as bot from './bot';
import * as utils from './util/utils';
import replies from './util/replies';
import { promisify } from 'util';
import { getProcessingCmd, getSketchConfig } from './sketch';
import { exec } from 'child_process';
import yargsParser from 'yargs-parser';

import { ILog, Configuration, IFile } from './types/utils';
import { Tweet } from './types/twitter/tweet';
import { SketchConfig, SketchOption } from './types/sketch';

const execAsync = promisify(exec);

async function onTweet(tweet: Tweet) {
  if (tweet.in_reply_to_user_id_str == bot.ID) return;

  let baseLog = { id: tweet.id_str };

  try {
    const tweetId = tweet.id_str;
    const parentId = utils.getParentTweetId(tweet);

    if (!parentId) return replyWithError(tweet.id_str, replies.orphanTweet);

    utils.log({
      level: 'info',
      message: 'Tweet válido recebido na stream',
      ...baseLog,
    });

    const parentTweet = await bot.getTweetById(parentId as string);
    const tweetText = utils.removeMentions(tweet.full_text ?? (tweet.text as string));
    const [sketchName, ...customOptions] = tweetText.split(' ');

    let chosenSketch: SketchConfig;
    let replyText: string;
    let config: Configuration;
    let sanitizedOptions: string;

    if (!utils.hasValidImage(parentTweet)) return;

    if (!utils.isValidSketch(sketchName)) {
      chosenSketch = getSketchConfig('pixelsort');
    } else {
      chosenSketch = getSketchConfig(sketchName as SketchOption);
    }

    if (!utils.isValidConfig(customOptions.join(' '))) {
      replyText = replies.defaultConfig;
      config = chosenSketch.defaultConfig;
    } else {
      chosenSketch = getSketchConfig(sketchName as SketchOption);
      sanitizedOptions = utils.prepareOptions(customOptions.join(' '));
      config = yargsParser(sanitizedOptions);
      replyText = replies.standard;
    }

    config = utils.mergeOptions(chosenSketch.defaultConfig, config);

    //Baixa a imagem do tweet
    const imageUrl = utils.getImageUrl(parentTweet, true, config.photo);
    const format = utils.getFileFormat(parentTweet, config.photo);
    const file: IFile = { name: tweetId, format };
    await utils.downloadImage(imageUrl, chosenSketch.name, file);

    //Executa o comando que edita a imagem
    const cmd = getProcessingCmd(chosenSketch.name, config, file);
    const { stdout, stderr } = await execAsync(cmd);

    if (stderr) {
      utils.log({
        level: 'error',
        message: 'Não foi possível editar a imagem',
        ...baseLog,
      });
    } else {
      utils.log({
        level: 'info',
        message: 'A imagem foi editada',
        ...baseLog,
      });
    }

    //Responde o tweet que mencionou ele
    const reply = await bot.replyTweet(tweetId, replyText, chosenSketch.name, file);

    if (reply.id_str) {
      utils.log({
        level: 'info',
        message: 'Respondido o tweet com imagem editada',
        ...baseLog,
      });

      utils.deleteFile(chosenSketch.name, file);
    } else {
      utils.log({
        level: 'error',
        message: 'O tweet não foi respondido com a imagem editada',
        ...baseLog,
      });
    }
  } catch (error) {
    const log: ILog = {
      level: 'error',
      message: error.message,
      ...baseLog,
    };

    utils.log(log, error);
    throw error;
  }
}

function replyWithError(tweetId: string, reason: string) {
  bot.replyTweet(tweetId, reason);
}

console.log('Starting bot...');
console.log('The bot started');
bot.listenQuery('@GlitchArtBot', onTweet);
