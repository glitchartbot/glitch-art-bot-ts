import './util/secrets';

import * as bot from './bot';
import * as utils from './util/common';
import replies, { invalidValues } from './util/replies';
import { promisify } from 'util';
import { getProcessingCmd, getSketchConfig } from './sketch';
import { exec } from 'child_process';

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

    if (!parentId) return;

    utils.log({
      level: 'info',
      message: 'Tweet válido recebido na stream',
      ...baseLog,
    });

    const parentTweet = await bot.getTweetById(parentId as string);

    if (!utils.hasValidImage(parentTweet)) return;

    const tweetText = utils.removeMentions(tweet.full_text ?? (tweet.text as string));
    const [sketchName, customOptions] = utils.resolveText(tweetText);

    let chosenSketch: SketchConfig;
    let replyText: string;
    let config: Configuration;
    let sanitizedOptions: string;
    let parsedOptions: Configuration;

    if (utils.isValidSketch(sketchName)) {
      chosenSketch = getSketchConfig(sketchName as SketchOption);
    } else {
      chosenSketch = getSketchConfig('pixelsort');
    }

    if (utils.isValidConfig(customOptions)) {
      sanitizedOptions = utils.prepareOptions(customOptions);
      parsedOptions = utils.parseConfig(sanitizedOptions);
      config = utils.mergeOptions(chosenSketch.defaultConfig, parsedOptions);
      replyText = replies.standard;
    } else {
      replyText = replies.defaultConfig;
      config = chosenSketch.defaultConfig;
    }

    const values = utils.isValidValues(config, chosenSketch);

    if (values.status === 'error') {
      return replyWithError(
        tweetId,
        invalidValues(values.type, values.prop, chosenSketch.values[values.prop].boundaries)
      );
    }

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
